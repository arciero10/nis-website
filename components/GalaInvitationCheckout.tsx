import Image from "next/image";
import TicketPurchaseForm from "@/components/TicketPurchaseForm";
import {formatEventPrice,NIS_GALA_DETAILS} from "@/data/ticketing";
import type {Event} from "@/types/ticketing";

type InvitationCredential={accessToken:string;invitationAlias?:never}|{accessToken?:never;invitationAlias:string};

export default function GalaInvitationCheckout({event,paypalClientId,availableSeats,...credential}:{event:Event;paypalClientId:string;availableSeats:number|null}&InvitationCredential){
  const maxQuantity=availableSeats===null?10:Math.min(10,availableSeats);const soldOut=maxQuantity===0;
  return <div className="nis-gala-invite-page">
    <header className="nis-gala-hero">
      <div className="nis-gala-tricolore" aria-hidden="true"><span/><span/><span/></div>
      <div className="shell nis-gala-hero-inner">
        <Image className="nis-gala-logo" src="/logo/nis-logo-square.png" width={150} height={150} alt="Logo Nazionale Italiana Sanitari" priority/>
        <p className="nis-gala-kicker">INVITO RISERVATO · NIS TICKETING</p>
        <h1>{event.title}</h1>
        <p className="nis-gala-date">{NIS_GALA_DETAILS.dateLabel}</p>
        <p className="nis-gala-intro">Una serata di beneficenza per sostenere i progetti della Nazionale Italiana Sanitari.</p>
        <div className="nis-gala-event-info" aria-label="Informazioni sull'evento">
          <article><span>LOCATION</span><strong>{NIS_GALA_DETAILS.venue}</strong><p>{NIS_GALA_DETAILS.venueAddress}<br/>{NIS_GALA_DETAILS.venueLocality}</p><a href={NIS_GALA_DETAILS.venueUrl} target="_blank" rel="noopener noreferrer">Apri location</a></article>
          <article><span>PARCHEGGIO</span><strong>{NIS_GALA_DETAILS.parking}</strong><p>{NIS_GALA_DETAILS.parkingAddress}<br/>{NIS_GALA_DETAILS.parkingLocality}</p><a href={NIS_GALA_DETAILS.parkingUrl} target="_blank" rel="noopener noreferrer">Apri parcheggio</a></article>
        </div>
        <p className="nis-gala-confidential">Invito riservato e confidenziale. Evento a numero chiuso.</p>
      </div>
    </header>
    <section className="ticketing-checkout-section" aria-labelledby="gala-checkout-title"><div className="shell ticketing-checkout-layout"><div className="ticketing-form-panel"><p className="ticketing-section-label">PRENOTAZIONE NOMINATIVA</p><h2 id="gala-checkout-title">{soldOut?"Posti esauriti":"I dati dei partecipanti"}</h2>{soldOut?<div className="ticketing-sold-out" role="status"><strong>POSTI ESAURITI</strong><p>Non è più possibile acquistare ingressi per questo evento.</p></div>:<TicketPurchaseForm {...credential} paypalClientId={paypalClientId} unitPrice={event.price} maxQuantity={maxQuantity}/>}</div><aside className="ticketing-order-summary" aria-label="Riepilogo ordine"><span>RIEPILOGO</span><h2>{event.title}</h2><p className="ticketing-summary-date">{NIS_GALA_DETAILS.dateLabel} · Roma</p><div><span>Ingressi</span><strong>{soldOut?"Non disponibili":"Selezionabili nel modulo"}</strong></div><div className="ticketing-order-total"><span>Prezzo unitario</span><strong>{formatEventPrice(event)}</strong></div><p>Categoria Standard · Accesso singolo</p></aside></div></section>
    <footer className="nis-gala-footer"><Image src="/logo/nis-logo-round-transparent.png" width={54} height={54} alt="Nazionale Italiana Sanitari"/><div><strong>Nazionale Italiana Sanitari</strong><span>Ticketing ufficiale NIS · Ingresso nominativo</span></div></footer>
  </div>;
}
