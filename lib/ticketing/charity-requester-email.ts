import {getEmailProvider} from "@/lib/email/provider";
import {GALA_REPLY_TO} from "@/lib/ticketing/email-config";
import {formatPersonFullName} from "@/lib/ticketing/name-format";
import {buildGalaSponsorEmailHtml,galaSponsorEmailText} from "@/lib/ticketing/sponsor-email";
import {
  claimCharityRequesterEmail,
  markCharityRequesterEmailFailed,
  markCharityRequesterEmailSent,
  type CharityRequest,
} from "@/lib/ticketing/charity-request-repository";

const PAYPAL_CHARITY_URL="https://www.paypal.com/fundraiser/charity/6169624";
const escapeHtml=(value:string)=>value.replace(/[&<>"']/g,character=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[character]??character);
const amount=(value:number)=>new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(value);

export function buildCharityRequesterEmail(request:CharityRequest){
  const displayName=formatPersonFullName(request.firstName,request.lastName);const greeting=escapeHtml(displayName);
  const requestCode=escapeHtml(request.requestCode);
  const expectedAmount=amount(request.expectedAmount);
  const subject=`NIS Gala - richiesta ${request.requestCode} ricevuta`;
  const html=`<!doctype html><html lang="it"><body style="margin:0;background:#f2f6f9;color:#17324d;font-family:Arial,sans-serif"><div style="max-width:640px;margin:0 auto;padding:32px 20px"><div style="padding:30px;border-top:5px solid #0b63b6;background:#ffffff"><p style="margin:0 0 8px;color:#0b63b6;font-size:12px;font-weight:700;letter-spacing:.08em">NIS GALA CHARITY NIGHT</p><h1 style="margin:0 0 22px;color:#062344;font-size:28px">Richiesta presa in carico</h1><p>Gentile ${greeting},</p><p>abbiamo registrato correttamente la tua richiesta di partecipazione.</p><div style="margin:24px 0;padding:18px;border-left:4px solid #0b63b6;background:#f4f8fc"><p style="margin:0 0 8px"><strong>Codice richiesta:</strong> ${requestCode}</p><p style="margin:0 0 8px"><strong>Numero ingressi:</strong> ${request.quantity}</p><p style="margin:0"><strong>Contributo previsto:</strong> ${expectedAmount}</p></div><p><strong>La richiesta non costituisce ancora un biglietto.</strong> Dopo la donazione, l'organizzazione verificherà manualmente il contributo. Soltanto al termine della verifica riceverai l'invito ufficiale con QR code.</p><p>Non è necessario ripetere la richiesta mentre attendi la conferma.</p><p style="margin:26px 0"><a href="${PAYPAL_CHARITY_URL}" style="display:inline-block;padding:14px 20px;background:#0b63b6;color:#ffffff;text-decoration:none;font-weight:700">CONTINUA SU PAYPAL CHARITY</a></p><p>Conserva il codice richiesta e controlla anche la cartella Spam o Posta indesiderata per le comunicazioni successive.</p><p>Per informazioni o assistenza, puoi rispondere direttamente a questa email oppure scrivere a <a href="mailto:${GALA_REPLY_TO}">${GALA_REPLY_TO}</a>.</p>${buildGalaSponsorEmailHtml()}<p style="margin-top:28px;color:#60758a;font-size:13px">Nazionale Italiana Sanitari</p></div></div></body></html>`;
  const text=[
    "NIS GALA CHARITY NIGHT",
    "Richiesta presa in carico",
    "",
    `Gentile ${displayName},`,
    "abbiamo registrato correttamente la tua richiesta di partecipazione.",
    "",
    `Codice richiesta: ${request.requestCode}`,
    `Numero ingressi: ${request.quantity}`,
    `Contributo previsto: ${expectedAmount}`,
    "",
    "La richiesta non costituisce ancora un biglietto. Dopo la donazione, l'organizzazione verificherà manualmente il contributo. Soltanto al termine della verifica riceverai l'invito ufficiale con QR code.",
    "Non è necessario ripetere la richiesta mentre attendi la conferma.",
    "",
    `Continua su PayPal Charity: ${PAYPAL_CHARITY_URL}`,
    "",
    "Conserva il codice richiesta e controlla anche la cartella Spam o Posta indesiderata per le comunicazioni successive.",
    `Per informazioni o assistenza, puoi rispondere direttamente a questa email oppure scrivere a ${GALA_REPLY_TO}.`,
    "",
    galaSponsorEmailText(),
  ].join("\n");
  return {subject,html,text};
}

export async function deliverCharityRequesterEmail(request:CharityRequest){
  try{
    if(!await claimCharityRequesterEmail(request.id))return {status:"SKIPPED" as const};
  }catch{
    console.error("Charity requester email claim failed");
    return {status:"FAILED" as const};
  }

  try{
    await getEmailProvider().send({to:request.email,replyTo:GALA_REPLY_TO,...buildCharityRequesterEmail(request)});
    await markCharityRequesterEmailSent(request.id);
    return {status:"SENT" as const};
  }catch(error){
    try{await markCharityRequesterEmailFailed(request.id,error instanceof Error?error.message:"Errore provider email");}
    catch{console.error("Charity requester email failure state could not be saved");}
    console.error(`Charity requester email failed for ${request.requestCode}`);
    return {status:"FAILED" as const};
  }
}
