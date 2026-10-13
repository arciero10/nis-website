"use client";
import Image from "next/image";
import {useState} from "react";
import {formatEventPrice,NIS_GALA_DETAILS} from "@/data/ticketing";
import type {Event} from "@/types/ticketing";

const PAYPAL_CHARITY_URL="https://www.paypal.com/fundraiser/charity/6169624";

export default function GalaInvitationCheckout({event,availableSeats}:{event:Event;availableSeats:number|null}){
  const maximumQuantity=Math.max(0,Math.min(10,availableSeats??10));const soldOut=maximumQuantity===0;const [quantity,setQuantity]=useState(1);
  const total=new Intl.NumberFormat("it-IT",{style:"currency",currency:event.currency}).format(event.price*quantity);
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
    <section className="ticketing-checkout-section" aria-labelledby="gala-checkout-title"><div className="shell ticketing-checkout-layout"><div className="ticketing-form-panel"><p className="ticketing-section-label">PARTECIPAZIONE AL GALA</p><h2 id="gala-checkout-title">{soldOut?"Posti esauriti":"Sostieni i progetti NIS"}</h2>{soldOut?<div className="ticketing-sold-out" role="status"><strong>POSTI ESAURITI</strong><p>Non è più possibile richiedere inviti per questo evento.</p></div>:<div className="ticketing-charity-donation"><label htmlFor="gala-ticket-quantity">Numero di ingressi<select id="gala-ticket-quantity" value={quantity} onChange={event=>setQuantity(Number(event.target.value))}>{Array.from({length:maximumQuantity},(_,index)=>index+1).map(value=><option key={value} value={value}>{value}</option>)}</select></label><p>La partecipazione al NIS Gala Charity Night prevede una donazione di 200 € per ingresso.<br/>Dopo aver effettuato la donazione, il tuo invito verrà emesso e inviato via email dopo la verifica.</p><a className="btn btn-blue ticketing-submit" href={PAYPAL_CHARITY_URL} rel="noopener noreferrer">EFFETTUA UNA DONAZIONE DI {total}</a><small>Il semplice click sul collegamento non genera alcun biglietto.</small></div>}</div><aside className="ticketing-order-summary" aria-label="Riepilogo"><span>RIEPILOGO</span><h2>{event.title}</h2><p className="ticketing-summary-date">{NIS_GALA_DETAILS.dateLabel} · Roma</p><div><span>Numero ingressi</span><strong>{soldOut?"Non disponibile":quantity}</strong></div><div><span>Prezzo unitario</span><strong>{formatEventPrice(event)}</strong></div><div className="ticketing-order-total"><span>Totale</span><strong>{soldOut?"—":total}</strong></div><p>Emissione dopo verifica della donazione</p></aside></div></section>
    <footer className="nis-gala-footer"><Image src="/logo/nis-logo-round-transparent.png" width={54} height={54} alt="Nazionale Italiana Sanitari"/><div><strong>Nazionale Italiana Sanitari</strong><span>Ticketing ufficiale NIS · Ingresso nominativo</span></div></footer>
  </div>;
}
