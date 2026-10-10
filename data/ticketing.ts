import type {Event} from "@/types/ticketing";

export const NIS_GALA_PRIVATE_INVITATION_URL="https://www.nazionaleitalianasanitari.com/i/gala-2026";
export const NIS_GALA_SOCIAL_IMAGE="https://www.nazionaleitalianasanitari.com/og-nis-social.png";

export const NIS_GALA_DETAILS={
  dateLabel:"28 ottobre 2026",
  venue:"Another Studio",
  venueAddress:"Via di Pietralata, 183",
  venueLocality:"00158 Roma RM",
  venueUrl:"https://www.google.com/maps/search/?api=1&query=Another+Studio%2C+Via+di+Pietralata+183%2C+Roma",
  parking:"Parking Pietralata",
  parkingAddress:"Via del Casale Rocchi n. 3",
  parkingLocality:"Roma",
  parkingUrl:"https://www.google.com/maps/search/?api=1&query=Parking+Pietralata%2C+Via+del+Casale+Rocchi+3%2C+Roma",
} as const;

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
  updatedAt:"2026-10-08T00:00:00.000Z",
};

export const ticketingEvents:readonly Event[]=[nisGala2026];

export function getTicketingEventBySlug(slug:string){
  return ticketingEvents.find(event=>event.slug===slug)??null;
}

export function formatEventPrice(event:Pick<Event,"price"|"currency">){
  return new Intl.NumberFormat("it-IT",{style:"currency",currency:event.currency}).format(event.price);
}
