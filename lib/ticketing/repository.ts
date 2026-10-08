import {getTicketingEventBySlug} from "@/data/ticketing";
import {findConfiguredGalaInvitation} from "@/lib/ticketing/invitations";
import type {Attendee,CheckIn,Event,Invitation,Order,Ticket,TicketLookup,TicketPurchaseInput} from "@/types/ticketing";

export class TicketingPersistenceNotConfiguredError extends Error{
  constructor(){
    super("La persistenza del sistema NIS Ticketing non e ancora configurata.");
    this.name="TicketingPersistenceNotConfiguredError";
  }
}

export interface TicketingRepository{
  findEventBySlug(slug:string):Promise<Event|null>;
  findInvitationByAccessToken(accessToken:string):Promise<Invitation|null>;
  consumeInvitation(invitation:Invitation):Promise<Invitation>;
  createAttendee(input:TicketPurchaseInput):Promise<Attendee>;
  createPendingOrder(event:Event,attendee:Attendee):Promise<Order>;
  createStandardTicket(order:Order,attendee:Attendee):Promise<Ticket>;
  findTicket(lookup:TicketLookup):Promise<Ticket|null>;
  recordCheckIn(ticket:Ticket,result:CheckIn["result"]):Promise<CheckIn>;
}

const persistenceUnavailable=async<T>():Promise<T>=>{
  // TODO(BLOCCO 2): replace with a PostgreSQL-backed implementation.
  throw new TicketingPersistenceNotConfiguredError();
};

export const ticketingRepository:TicketingRepository={
  async findEventBySlug(slug){
    return getTicketingEventBySlug(slug);
  },
  async findInvitationByAccessToken(accessToken){
    return findConfiguredGalaInvitation(accessToken);
  },
  consumeInvitation:()=>persistenceUnavailable<Invitation>(),
  createAttendee:()=>persistenceUnavailable<Attendee>(),
  createPendingOrder:()=>persistenceUnavailable<Order>(),
  createStandardTicket:()=>persistenceUnavailable<Ticket>(),
  findTicket:()=>persistenceUnavailable<Ticket|null>(),
  recordCheckIn:()=>persistenceUnavailable<CheckIn>(),
};
