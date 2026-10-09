import nodemailer from "nodemailer";

export type EmailMessage={to:string;subject:string;text:string;html:string};
export interface EmailProvider{send(message:EmailMessage):Promise<void>}

type SmtpSettings={host:string;port:number;user:string;password:string;from:string};

function smtpSettings():SmtpSettings{
  const host=process.env.SMTP_HOST?.trim();const port=Number(process.env.SMTP_PORT);const user=process.env.SMTP_USER?.trim();const password=process.env.SMTP_PASSWORD;const from=(process.env.TICKETING_EMAIL_FROM||process.env.SMTP_FROM)?.trim();
  if(!host||!Number.isInteger(port)||port<1||port>65535||!user||!password||!from)throw new Error("Provider email ticketing non configurato.");
  return {host,port,user,password,from};
}

class SmtpEmailProvider implements EmailProvider{
  async send(message:EmailMessage){
    const settings=smtpSettings();const transporter=nodemailer.createTransport({host:settings.host,port:settings.port,secure:settings.port===465,auth:{user:settings.user,pass:settings.password},connectionTimeout:10_000,greetingTimeout:10_000,socketTimeout:20_000});
    await transporter.sendMail({...message,from:settings.from});
  }
}

export function getEmailProvider():EmailProvider{return new SmtpEmailProvider();}
