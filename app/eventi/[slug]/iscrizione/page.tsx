import {notFound} from "next/navigation";
import EventRsvpForm from "@/components/EventRsvpForm";
import {findPublicEvent,listPublicTicketTypes} from "@/lib/ticketing/public-events";

export const dynamic="force-dynamic";
export const metadata={robots:{index:false,follow:false,noarchive:true}};

export default async function EventRegistrationPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const event=await findPublicEvent(slug);if(!event||event.status!=="OPEN")notFound();const ticketTypes=await listPublicTicketTypes(event.id);return <main className="public-event-registration"><div className="container"><span>REGISTRAZIONE EVENTO</span><h1>{event.title}</h1><p>{event.isFree?"Conferma la partecipazione. Il QR potrà essere emesso dall'organizzazione.":"Registra i dati dei partecipanti. Il pagamento sarà gestito nel passaggio successivo quando configurato."}</p><EventRsvpForm event={event} ticketTypes={ticketTypes}/></div></main>;}
