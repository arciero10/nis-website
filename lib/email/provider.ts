export type EmailAttachment={
  name:string;
  contentType:string;
  content:Uint8Array;
};

export type EmailMessage={
  to:string;
  subject:string;
  text:string;
  html:string;
  replyTo?:string;
  attachments?:EmailAttachment[];
};

export interface EmailProvider{
  send(message:EmailMessage):Promise<void>;
}

export class EmailAttachmentDeliveryError extends Error{
  constructor(message:string){super(message);this.name="EmailAttachmentDeliveryError";}
}

type MicrosoftGraphSettings={
  tenantId:string;
  clientId:string;
  clientSecret:string;
  sender:string;
};

type CachedAccessToken={
  value:string;
  expiresAt:number;
  configurationKey:string;
};

type TokenResponse={
  access_token?:unknown;
  expires_in?:unknown;
};

const tokenRefreshSkewMs=60_000;
export const microsoftGraphSimpleAttachmentLimit=3*1024*1024;
export const microsoftGraphLargeAttachmentLimit=150*1024*1024;
const microsoftGraphUploadChunkSize=10*320*1024;
let cachedAccessToken:CachedAccessToken|null=null;

function attachmentPayload(attachment:EmailAttachment){
  return {"@odata.type":"#microsoft.graph.fileAttachment",name:attachment.name,contentType:attachment.contentType,contentBytes:Buffer.from(attachment.content).toString("base64")};
}

function graphMessage(message:EmailMessage,settings:MicrosoftGraphSettings,includeAttachments=false){
  return {
    subject:message.subject,
    body:{contentType:"HTML",content:message.html},
    toRecipients:[{emailAddress:{address:message.to}}],
    from:{emailAddress:{name:"Biglietti NIS",address:settings.sender}},
    ...(message.replyTo?{replyTo:[{emailAddress:{address:message.replyTo}}]}:{}),
    ...(includeAttachments&&message.attachments?.length?{attachments:message.attachments.map(attachmentPayload)}:{}),
  };
}

function microsoftGraphSettings():MicrosoftGraphSettings{
  const tenantId=process.env.MICROSOFT_TENANT_ID?.trim();
  const clientId=process.env.MICROSOFT_CLIENT_ID?.trim();
  const clientSecret=process.env.MICROSOFT_CLIENT_SECRET;
  const sender=process.env.TICKETING_EMAIL_FROM?.trim();

  if(!tenantId||!clientId||!clientSecret||!sender){
    throw new Error("Provider email Microsoft Graph non configurato.");
  }

  return {tenantId,clientId,clientSecret,sender};
}

function tokenConfigurationKey(settings:MicrosoftGraphSettings){
  return `${settings.tenantId}:${settings.clientId}:${settings.sender}`;
}

export class MicrosoftGraphEmailProvider implements EmailProvider{
  constructor(private readonly fetcher:typeof fetch=fetch){}

  private async getAccessToken(settings:MicrosoftGraphSettings,forceRefresh=false){
    const configurationKey=tokenConfigurationKey(settings);
    if(!forceRefresh&&cachedAccessToken?.configurationKey===configurationKey&&cachedAccessToken.expiresAt>Date.now()+tokenRefreshSkewMs){
      return cachedAccessToken.value;
    }

    const body=new URLSearchParams({
      client_id:settings.clientId,
      client_secret:settings.clientSecret,
      scope:"https://graph.microsoft.com/.default",
      grant_type:"client_credentials",
    });
    const response=await this.fetcher(`https://login.microsoftonline.com/${encodeURIComponent(settings.tenantId)}/oauth2/v2.0/token`,{
      method:"POST",
      headers:{"Content-Type":"application/x-www-form-urlencoded"},
      body,
    });

    if(!response.ok){
      throw new Error(`Autenticazione Microsoft Graph non riuscita (${response.status}).`);
    }

    const tokenResponse=await response.json() as TokenResponse;
    if(typeof tokenResponse.access_token!=="string"||!tokenResponse.access_token||typeof tokenResponse.expires_in!=="number"||tokenResponse.expires_in<=0){
      throw new Error("Risposta di autenticazione Microsoft Graph non valida.");
    }

    cachedAccessToken={
      value:tokenResponse.access_token,
      expiresAt:Date.now()+tokenResponse.expires_in*1000,
      configurationKey,
    };
    return cachedAccessToken.value;
  }

  private async sendWithToken(message:EmailMessage,settings:MicrosoftGraphSettings,accessToken:string){
    const attachments=message.attachments??[];
    const totalAttachmentSize=attachments.reduce((total,attachment)=>total+attachment.content.byteLength,0);
    if(attachments.some(attachment=>attachment.content.byteLength===0||attachment.content.byteLength>microsoftGraphLargeAttachmentLimit))throw new EmailAttachmentDeliveryError("Allegato email vuoto o superiore al limite Microsoft Graph di 150 MB.");
    const canSendInline=attachments.every(attachment=>attachment.content.byteLength<microsoftGraphSimpleAttachmentLimit)&&totalAttachmentSize<microsoftGraphSimpleAttachmentLimit;

    if(attachments.length>0&&!canSendInline)return this.sendDraftWithAttachments(message,settings,accessToken);

    return this.fetcher(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(settings.sender)}/sendMail`,{
      method:"POST",
      headers:{
        Authorization:`Bearer ${accessToken}`,
        "Content-Type":"application/json",
      },
      body:JSON.stringify({message:graphMessage(message,settings,true),saveToSentItems:true}),
    });
  }

  private async sendDraftWithAttachments(message:EmailMessage,settings:MicrosoftGraphSettings,accessToken:string){
    const base=`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(settings.sender)}`;
    const authorization={Authorization:`Bearer ${accessToken}`};
    const draftResponse=await this.fetcher(`${base}/messages`,{method:"POST",headers:{...authorization,"Content-Type":"application/json"},body:JSON.stringify(graphMessage(message,settings))});
    if(!draftResponse.ok)throw new EmailAttachmentDeliveryError(`Creazione bozza Microsoft Graph non riuscita (${draftResponse.status}).`);
    const draft=await draftResponse.json() as {id?:unknown};
    if(typeof draft.id!=="string"||!draft.id)throw new EmailAttachmentDeliveryError("Microsoft Graph non ha restituito l'identificativo della bozza.");

    try{
      for(const attachment of message.attachments??[]){
        if(attachment.content.byteLength<microsoftGraphSimpleAttachmentLimit){
          const response=await this.fetcher(`${base}/messages/${encodeURIComponent(draft.id)}/attachments`,{method:"POST",headers:{...authorization,"Content-Type":"application/json"},body:JSON.stringify(attachmentPayload(attachment))});
          if(!response.ok)throw new EmailAttachmentDeliveryError(`Allegato Microsoft Graph rifiutato (${response.status}).`);
          continue;
        }

        const sessionResponse=await this.fetcher(`${base}/messages/${encodeURIComponent(draft.id)}/attachments/createUploadSession`,{method:"POST",headers:{...authorization,"Content-Type":"application/json"},body:JSON.stringify({AttachmentItem:{attachmentType:"file",name:attachment.name,size:attachment.content.byteLength,contentType:attachment.contentType}})});
        if(!sessionResponse.ok)throw new EmailAttachmentDeliveryError(`Sessione allegato Microsoft Graph non riuscita (${sessionResponse.status}).`);
        const session=await sessionResponse.json() as {uploadUrl?:unknown};
        if(typeof session.uploadUrl!=="string"||!session.uploadUrl)throw new EmailAttachmentDeliveryError("Microsoft Graph non ha restituito l'URL di caricamento dell'allegato.");
        for(let start=0;start<attachment.content.byteLength;start+=microsoftGraphUploadChunkSize){
          const end=Math.min(start+microsoftGraphUploadChunkSize,attachment.content.byteLength)-1;
          const chunk=Buffer.from(attachment.content.subarray(start,end+1));
          const response=await this.fetcher(session.uploadUrl,{method:"PUT",headers:{"Content-Length":String(chunk.byteLength),"Content-Range":`bytes ${start}-${end}/${attachment.content.byteLength}`,"Content-Type":"application/octet-stream"},body:chunk});
          if(!response.ok)throw new EmailAttachmentDeliveryError(`Caricamento allegato Microsoft Graph non riuscito (${response.status}).`);
        }
      }
      return this.fetcher(`${base}/messages/${encodeURIComponent(draft.id)}/send`,{method:"POST",headers:authorization});
    }catch(error){
      try{await this.fetcher(`${base}/messages/${encodeURIComponent(draft.id)}`,{method:"DELETE",headers:authorization});}catch{}
      throw error;
    }
  }

  async send(message:EmailMessage){
    const settings=microsoftGraphSettings();
    let accessToken=await this.getAccessToken(settings);
    let response=await this.sendWithToken(message,settings,accessToken);

    if(response.status===401){
      cachedAccessToken=null;
      accessToken=await this.getAccessToken(settings,true);
      response=await this.sendWithToken(message,settings,accessToken);
    }

    if(!response.ok){
      if(message.attachments?.length)throw new EmailAttachmentDeliveryError(`Invio con allegato tramite Microsoft Graph non riuscito (${response.status}).`);
      throw new Error(`Invio tramite Microsoft Graph non riuscito (${response.status}).`);
    }
  }
}

export function resetMicrosoftGraphTokenCacheForTests(){
  cachedAccessToken=null;
}

export function getEmailProvider():EmailProvider{
  return new MicrosoftGraphEmailProvider();
}
