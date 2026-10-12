import type {AllocationType,ComplimentaryReason,InvitationType,TicketIssuanceSource,TicketStatus} from "@/types/ticketing";

const productionOrigin="https://www.nazionaleitalianasanitari.com";

export function buildTicketPageUrl(qrToken:string,origin=productionOrigin){
  return new URL(`/biglietto/${encodeURIComponent(qrToken)}`,origin).toString();
}

export function buildTicketPdfUrl(qrToken:string,origin=productionOrigin){
  return new URL(`/api/ticketing/tickets/${encodeURIComponent(qrToken)}/pdf`,origin).toString();
}

export function buildTicketQrPayload(qrToken:string){
  return `NIS:${qrToken}`;
}

export function extractTicketQrToken(payload:string){
  const value=payload.trim();
  if(value.startsWith("NIS:"))return value.slice(4);
  try{const url=new URL(value);const match=url.pathname.match(/^\/biglietto\/([^/]+)$/);if(match)return decodeURIComponent(match[1]);}catch{}
  return value;
}

export function findTicketPosition(tickets:ReadonlyArray<{qrToken:string}>,qrToken:string){
  return tickets.findIndex(ticket=>ticket.qrToken===qrToken);
}

export function ticketStatusLabel(status:TicketStatus){
  if(status==="ACTIVE")return "VALIDO";
  if(status==="USED")return "GIÀ UTILIZZATO";
  if(status==="REFUNDED")return "RIMBORSATO";
  return "ANNULLATO";
}

export function allocationTypeLabel(type:AllocationType){
  if(type==="SPONSOR")return "Sponsor";
  if(type==="DONATORE")return "Donatore";
  if(type==="OSPITE")return "Ospite";
  return "Azienda";
}

export function issuanceSourceLabel(source:TicketIssuanceSource){
  if(source==="BANK_TRANSFER")return "Bonifico";
  if(source==="COMPANY")return "Azienda";
  if(source==="ADMIN")return "Admin";
  return "PayPal";
}

export function invitationTypeLabel(type:InvitationType){
  if(type==="STANDARD")return "Standard";
  if(type==="SPONSOR")return "Sponsor";
  if(type==="DONATORE")return "Donatore";
  if(type==="AZIENDA")return "Azienda";
  if(type==="OSPITE")return "Ospite";
  if(type==="STAMPA")return "Stampa";
  if(type==="MEDIA")return "Media";
  if(type==="PRESS")return "Press";
  return "Omaggio";
}

export function complimentaryReasonLabel(reason:ComplimentaryReason|null){
  if(reason==="INSTITUTIONAL_GUEST")return "Ospite istituzionale";
  if(reason==="NIS_GUEST")return "Invitato NIS";
  if(reason==="SPEAKER")return "Relatore";
  if(reason==="STAFF_ORGANIZATION")return "Staff / Organizzazione";
  if(reason==="COURTESY")return "Cortesia";
  if(reason==="OTHER")return "Altro";
  return "-";
}
