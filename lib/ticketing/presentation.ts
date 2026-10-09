import type {TicketStatus} from "@/types/ticketing";

const productionOrigin="https://www.nazionaleitalianasanitari.com";

export function buildTicketPageUrl(qrToken:string,origin=productionOrigin){
  return new URL(`/biglietto/${encodeURIComponent(qrToken)}`,origin).toString();
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
