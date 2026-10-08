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
    ticketCode:generateTicketCode(eventYear),
    qrToken:generateQrToken(),
    category:"STANDARD",
    accessMode:"ONE_SHOT",
    status:"ACTIVE",
    createdAt:createdAt.toISOString(),
    firstCheckInAt:null,
    lastCheckInAt:null,
  };
}
