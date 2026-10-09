import {notFound} from "next/navigation";
import {ticketingRepository} from "@/lib/ticketing/repository";

export const dynamic="force-dynamic";

export default async function TicketConfirmationPage({params}:{params:Promise<{qrToken:string}>}){
  const {qrToken}=await params;const confirmation=await ticketingRepository.findConfirmationByQrToken(qrToken);if(!confirmation)notFound();const {event,attendees,order,tickets}=confirmation;
  return <div className="ticketing-confirmation"><div className="shell ticketing-confirmation-card"><span>PAGAMENTO COMPLETATO</span><h1>{tickets.length===1?"Il tuo ingresso è confermato":"I tuoi ingressi sono confermati"}</h1><p>Conserva questa pagina. L'email con i biglietti sarà disponibile in una fase successiva.</p><dl><div><dt>Evento</dt><dd>{event.title}</dd></div><div><dt>Ingressi</dt><dd>{tickets.length}</dd></div><div><dt>Importo totale</dt><dd>{new Intl.NumberFormat("it-IT",{style:"currency",currency:order.currency}).format(order.amount)}</dd></div></dl><div className="ticketing-confirmation-tickets">{tickets.map((ticket,index)=><article key={ticket.id}><span>BIGLIETTO {index+1}</span><h2>{attendees[index].firstName} {attendees[index].lastName}</h2><p><strong>Codice:</strong> {ticket.ticketCode}</p><a className="btn btn-blue" href={`/biglietto/${ticket.qrToken}`}>Apri biglietto</a></article>)}</div></div></div>;
}
