import type {DigitalTicketRecord} from "@/lib/ticketing/repository";
import {allocationTypeLabel,buildTicketQrPayload,ticketStatusLabel} from "@/lib/ticketing/presentation";

export type WalletTicketModel={
  ticketId:string;
  ticketCode:string;
  qrPayload:string;
  eventTitle:string;
  statusLabel:string;
  companyInvitation:boolean;
  holderName:string|null;
  companyName:string|null;
  allocationType:string|null;
  sequenceNumber:number|null;
  totalQuantity:number|null;
  amountLabel:string|null;
};

export function buildWalletTicketModel(record:DigitalTicketRecord):WalletTicketModel{
  const companyInvitation=record.ticket.category==="PARTNER";
  return {
    ticketId:record.ticket.id,
    ticketCode:record.ticket.ticketCode,
    qrPayload:buildTicketQrPayload(record.ticket.qrToken),
    eventTitle:record.event.title,
    statusLabel:ticketStatusLabel(record.ticket.status),
    companyInvitation,
    holderName:companyInvitation?null:`${record.attendee.firstName} ${record.attendee.lastName}`,
    companyName:companyInvitation?record.companyName:null,
    allocationType:companyInvitation?allocationTypeLabel(record.allocationType??"AZIENDA"):null,
    sequenceNumber:companyInvitation?(record.ticket.sequenceNumber??1):null,
    totalQuantity:companyInvitation?(record.ticket.totalQuantity??1):null,
    amountLabel:companyInvitation||record.ticket.issuanceSource==="COMPLIMENTARY"?null:new Intl.NumberFormat("it-IT",{style:"currency",currency:record.event.currency}).format(record.event.price),
  };
}
