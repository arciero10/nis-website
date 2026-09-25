import {createHash} from "node:crypto";
import nodemailer from "nodemailer";
import {NextResponse} from "next/server";

export const runtime="nodejs";

const requiredFields=["firstName","lastName","email","profession","city","message"] as const;
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxBodyLength=24_000;
const rateLimitWindow=15*60*1000;
const rateLimitMaximum=5;

type ApplicationPayload={
  firstName?:unknown;
  lastName?:unknown;
  email?:unknown;
  phone?:unknown;
  profession?:unknown;
  healthSector?:unknown;
  city?:unknown;
  interestArea?:unknown;
  message?:unknown;
  privacy?:unknown;
  website?:unknown;
};

type RateLimitEntry={count:number;resetAt:number};

const rateLimitStore=new Map<string,RateLimitEntry>();

function singleLine(value:unknown,maxLength:number){
  if(typeof value!=="string") return {value:"",valid:value===undefined};
  const sanitized=value.replace(/[\u0000-\u001f\u007f]+/g," ").replace(/\s+/g," ").trim();
  return {value:sanitized.slice(0,maxLength),valid:sanitized.length<=maxLength};
}

function multiLine(value:unknown,maxLength:number){
  if(typeof value!=="string") return {value:"",valid:value===undefined};
  const sanitized=value
    .replace(/\r\n?/g,"\n")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,"")
    .trim();
  return {value:sanitized.slice(0,maxLength),valid:sanitized.length<=maxLength};
}

function escapeHtml(value:string){
  return value.replace(/[&<>"']/g,character=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[character]??character);
}

function clientKey(request:Request){
  const forwarded=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address=forwarded||request.headers.get("x-real-ip")||"unknown";
  return createHash("sha256").update(address).digest("hex");
}

function isRateLimited(key:string){
  const now=Date.now();
  const current=rateLimitStore.get(key);

  if(!current||current.resetAt<=now){
    rateLimitStore.set(key,{count:1,resetAt:now+rateLimitWindow});
    return false;
  }

  current.count+=1;
  return current.count>rateLimitMaximum;
}

function smtpSettings(){
  const host=process.env.SMTP_HOST?.trim();
  const port=Number(process.env.SMTP_PORT);
  const user=process.env.SMTP_USER?.trim();
  const password=process.env.SMTP_PASSWORD;
  const from=process.env.SMTP_FROM?.trim();
  const to=process.env.CANDIDATURE_TO?.trim();

  if(!host||!Number.isInteger(port)||port<1||port>65535||!user||!password||!from||!to) return null;
  return {host,port,user,password,from,to};
}

export async function POST(request:Request){
  const declaredLength=Number(request.headers.get("content-length")||0);
  if(declaredLength>maxBodyLength){
    return NextResponse.json({message:"Dati della candidatura non validi."},{status:413});
  }

  let payload:ApplicationPayload;
  try{
    const rawBody=await request.text();
    if(rawBody.length>maxBodyLength) throw new Error("Body too large");
    payload=JSON.parse(rawBody) as ApplicationPayload;
  }catch{
    return NextResponse.json({message:"Dati della candidatura non validi."},{status:400});
  }

  const honeypot=singleLine(payload.website,200);
  if(honeypot.value){
    return NextResponse.json({message:"Candidatura inviata correttamente."});
  }

  if(isRateLimited(clientKey(request))){
    return NextResponse.json({message:"Troppe richieste. Riprova tra qualche minuto."},{status:429});
  }

  const fields={
    firstName:singleLine(payload.firstName,80),
    lastName:singleLine(payload.lastName,80),
    email:singleLine(payload.email,160),
    phone:singleLine(payload.phone,40),
    profession:singleLine(payload.profession,120),
    healthSector:singleLine(payload.healthSector,120),
    city:singleLine(payload.city,100),
    interestArea:singleLine(payload.interestArea,140),
    message:multiLine(payload.message,2000),
  };
  const application=Object.fromEntries(Object.entries(fields).map(([key,field])=>[key,field.value])) as Record<keyof typeof fields,string>;
  const validLengths=Object.values(fields).every(field=>field.valid);

  if(!validLengths||requiredFields.some(field=>!application[field])||!emailPattern.test(application.email)||payload.privacy!==true){
    return NextResponse.json({message:"Controlla i campi obbligatori e il consenso privacy."},{status:400});
  }

  const smtp=smtpSettings();
  if(!smtp){
    return NextResponse.json({message:"Il servizio di invio candidature non è configurato."},{status:503});
  }

  const submittedAt=new Intl.DateTimeFormat("it-IT",{
    dateStyle:"full",
    timeStyle:"medium",
    timeZone:"Europe/Rome",
  }).format(new Date());
  const rows:[string,string][]=[
    ["Nome",application.firstName],
    ["Cognome",application.lastName],
    ["Email",application.email],
    ["Telefono",application.phone||"Non indicato"],
    ["Professione / ruolo",application.profession],
    ["Ambito sanitario",application.healthSector||"Non indicato"],
    ["Città",application.city],
    ["Disciplina / area di interesse",application.interestArea||"Non indicata"],
    ["Motivazione / messaggio",application.message],
    ["Data e ora candidatura",submittedAt],
    ["Consenso privacy","Confermato"],
  ];
  const htmlRows=rows.map(([label,value])=>`<tr><th style="padding:10px 14px;text-align:left;vertical-align:top;border-bottom:1px solid #dce5ee;color:#153f68">${escapeHtml(label)}</th><td style="padding:10px 14px;border-bottom:1px solid #dce5ee;color:#263b50">${escapeHtml(value).replace(/\n/g,"<br>")}</td></tr>`).join("");
  const html=`<div style="font-family:Arial,sans-serif;color:#18324c"><h1 style="font-size:24px;color:#073064">Nuova candidatura NIS</h1><table style="width:100%;border-collapse:collapse">${htmlRows}</table></div>`;
  const plainText=["Nuova candidatura NIS","",...rows.map(([label,value])=>`${label}: ${value}`)].join("\n");

  try{
    const transporter=nodemailer.createTransport({
      host:smtp.host,
      port:smtp.port,
      secure:smtp.port===465,
      auth:{user:smtp.user,pass:smtp.password},
      connectionTimeout:10_000,
      greetingTimeout:10_000,
      socketTimeout:20_000,
    });
    await transporter.sendMail({
      from:smtp.from,
      to:smtp.to,
      replyTo:application.email,
      subject:`Nuova candidatura NIS - ${application.firstName} ${application.lastName}`,
      text:plainText,
      html,
    });
  }catch{
    console.error("Application email delivery failed");
    return NextResponse.json({message:"L’invio della candidatura non è riuscito."},{status:502});
  }

  return NextResponse.json({message:"Candidatura inviata correttamente."});
}
