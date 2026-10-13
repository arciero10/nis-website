import {getEmailProvider} from "@/lib/email/provider";
import {markCharityAdminEmailFailed,markCharityAdminEmailSent,type CharityRequest} from "@/lib/ticketing/charity-request-repository";

const fallbackRecipient="alessandro.arciero@tiscali.it";
const escapeHtml=(value:string)=>value.replace(/[&<>"']/g,character=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[character]??character);
const amount=(value:number)=>new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(value);

export function buildCharityAdminEmail(request:CharityRequest){
  const participantText=request.participants.map(participant=>`${participant.position}. ${participant.firstName} ${participant.lastName}`).join("\n");
  const participantHtml=request.participants.map(participant=>`<li>${escapeHtml(`${participant.firstName} ${participant.lastName}`)}</li>`).join("");
  const html=`<!doctype html><html lang="it"><body style="font-family:Arial,sans-serif;color:#15324e"><h1 style="color:#073064">NUOVA RICHIESTA NIS GALA</h1><p><strong>Codice richiesta:</strong><br>${escapeHtml(request.requestCode)}</p><p><strong>Referente:</strong><br>${escapeHtml(`${request.firstName} ${request.lastName}`)}</p><p><strong>Email:</strong><br>${escapeHtml(request.email)}</p><p><strong>Telefono:</strong><br>${escapeHtml(request.phone||"Non indicato")}</p><p><strong>Numero ingressi:</strong> ${request.quantity}</p><p><strong>Importo atteso:</strong> ${amount(request.expectedAmount)}</p><p><strong>Partecipanti:</strong></p><ol>${participantHtml}</ol><p><strong>Stato:</strong> DONAZIONE DA VERIFICARE</p><div style="margin-top:24px;padding:18px;border:2px solid #a22935;background:#fff5f6;color:#791c27"><strong>NON EMETTERE ANCORA I BIGLIETTI.</strong><br>Verificare prima che la donazione sia effettivamente arrivata tramite PayPal Charity.</div></body></html>`;
  const text=["NUOVA RICHIESTA NIS GALA",`Codice richiesta: ${request.requestCode}`,`Referente: ${request.firstName} ${request.lastName}`,`Email: ${request.email}`,`Telefono: ${request.phone||"Non indicato"}`,`Numero ingressi: ${request.quantity}`,`Importo atteso: ${amount(request.expectedAmount)}`,"Partecipanti:",participantText,"Stato: DONAZIONE DA VERIFICARE","","NON EMETTERE ANCORA I BIGLIETTI.","Verificare prima che la donazione sia effettivamente arrivata tramite PayPal Charity."].join("\n");
  return {subject:"Nuova richiesta Gala - Donazione da verificare",html,text};
}

export async function notifyCharityRequestAdmin(request:CharityRequest){
  const recipient=process.env.NIS_TICKETING_ADMIN_EMAIL?.trim()||fallbackRecipient;const content=buildCharityAdminEmail(request);
  try{await getEmailProvider().send({to:recipient,...content});await markCharityAdminEmailSent(request.id);return {status:"SENT" as const};}
  catch(error){const message=error instanceof Error?error.message:"Errore provider email";await markCharityAdminEmailFailed(request.id,message).catch(()=>undefined);console.error(`[NIS-TICKETING] Charity admin email failed for ${request.requestCode}`);return {status:"FAILED" as const};}
}
