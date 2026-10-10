import {randomUUID} from "node:crypto";
import {generateQrToken,generateTicketCode} from "@/lib/ticketing/security";
import type {Ticket} from "@/types/ticketing";

type StandardTicketInput={
  eventId:string;
  attendeeId:string;
  orderId:string;
  eventYear?:number;
  createdAt?:Date;
};

export function issueStandardTicket({
  eventId,
  attendeeId,
  orderId,
  eventYear=2026,
  createdAt=new Date(),
}:StandardTicketInput):Ticket{
  return {
    id:randomUUID(),
    eventId,
    attendeeId,
    orderId,
    partnerAllocationId:null,
    ticketCode:generateTicketCode(eventYear),
    qrToken:generateQrToken(),
    category:"STANDARD",
    accessMode:"ONE_SHOT",
    status:"ACTIVE",
    sequenceNumber:null,
    totalQuantity:null,
    createdAt:createdAt.toISOString(),
    updatedAt:createdAt.toISOString(),
    firstCheckInAt:null,
    lastCheckInAt:null,
  };
}
