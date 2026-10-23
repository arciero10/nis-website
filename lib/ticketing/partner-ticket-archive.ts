import {zipSync} from "fflate";
import {formatPersonFullName} from "@/lib/ticketing/name-format";
import {ticketingRepository,type PartnerAllocationEmailPayload} from "@/lib/ticketing/repository";
import {createTicketPdf} from "@/lib/ticketing/ticket-pdf";

export type PartnerTicketPdfEntry={
  firstName:string;
  lastName:string;
  ticketCode:string;
  qrToken:string;
  sequenceNumber:number;
  totalQuantity:number;
  pdf:Uint8Array;
};

const safeFilePart=(value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("it-IT").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,70)||"biglietto";

export function buildPartnerTicketArchive(companyName:string,entries:PartnerTicketPdfEntry[]){
  if(entries.length===0)throw new Error("Nessun biglietto disponibile per l'archivio aziendale.");
  if(new Set(entries.map(entry=>entry.ticketCode)).size!==entries.length||new Set(entries.map(entry=>entry.qrToken)).size!==entries.length)throw new Error("Codici ticket o QR duplicati nell'assegnazione aziendale.");
  if(entries.some(entry=>entry.totalQuantity!==entries.length||entry.sequenceNumber<1||entry.sequenceNumber>entries.length||!entry.pdf.byteLength))throw new Error("Progressivi o PDF non validi nell'assegnazione aziendale.");
  const width=String(entries.length).length;
  const files=Object.fromEntries(entries.sort((a,b)=>a.sequenceNumber-b.sequenceNumber).map(entry=>{
    const sequence=String(entry.sequenceNumber).padStart(width,"0");
    const holder=safeFilePart(formatPersonFullName(entry.firstName,entry.lastName));
    return [`${sequence}-${holder}-${entry.ticketCode}.pdf`,entry.pdf];
  }));
  const content=zipSync(files,{level:6});
  return {name:`biglietti-gala-2026-${safeFilePart(companyName)}.zip`,content,pdfCount:entries.length,fileNames:Object.keys(files)};
}

export async function createPartnerTicketArchive(payload:PartnerAllocationEmailPayload){
  const entries:PartnerTicketPdfEntry[]=[];
  for(const ticket of payload.tickets){
    const record=await ticketingRepository.findDigitalTicketByQrToken(ticket.qrToken);
    if(!record||record.ticket.partnerAllocationId!==payload.allocationId||record.ticket.ticketCode!==ticket.ticketCode||record.ticket.issuanceSource!=="COMPANY")throw new Error("Biglietto aziendale non coerente con l'assegnazione.");
    entries.push({...ticket,pdf:await createTicketPdf(record)});
  }
  return buildPartnerTicketArchive(payload.companyName,entries);
}
