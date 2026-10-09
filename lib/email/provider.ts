export type EmailMessage={
  to:string;
  subject:string;
  text:string;
  html:string;
  replyTo?:string;
};

export interface EmailProvider{
  send(message:EmailMessage):Promise<void>;
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
let cachedAccessToken:CachedAccessToken|null=null;

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
    const graphMessage={
      subject:message.subject,
      body:{contentType:"HTML",content:message.html},
      toRecipients:[{emailAddress:{address:message.to}}],
      from:{emailAddress:{name:"Biglietti NIS",address:settings.sender}},
      ...(message.replyTo?{replyTo:[{emailAddress:{address:message.replyTo}}]}:{}),
    };

    return this.fetcher(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(settings.sender)}/sendMail`,{
      method:"POST",
      headers:{
        Authorization:`Bearer ${accessToken}`,
        "Content-Type":"application/json",
      },
      body:JSON.stringify({message:graphMessage,saveToSentItems:true}),
    });
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
