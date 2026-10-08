import type {Event} from "@/types/ticketing";

export const nisGala2026:Event={
  id:"evt_nis_gala_2026",
  slug:"nis-gala-2026",
  title:"NIS Gala Charity Night",
  description:"Evento charity della Nazionale Italiana Sanitari.",
  location:null,
  eventDate:null,
  doorsOpenAt:null,
  price:200,
  currency:"EUR",
  capacity:null,
  status:"ANNOUNCED",
  createdAt:"2026-10-08T00:00:00.000Z",
};

export const ticketingEvents:readonly Event[]=[nisGala2026];

export function getTicketingEventBySlug(slug:string){
  return ticketingEvents.find(event=>event.slug===slug)??null;
}

export function formatEventPrice(event:Pick<Event,"price"|"currency">){
  return new Intl.NumberFormat("it-IT",{style:"currency",currency:event.currency}).format(event.price);
}
