"use client";

import Image from "next/image";
import {FormEvent,useRef,useState} from "react";
import {formatEventPrice,NIS_GALA_DETAILS} from "@/data/ticketing";
import type {Event} from "@/types/ticketing";

const PAYPAL_CHARITY_URL="https://www.paypal.com/fundraiser/charity/6169624";

export default function GalaInvitationCheckout({event,availableSeats}:{event:Event;availableSeats:number|null}){
  const maximumQuantity=Math.max(0,Math.min(10,availableSeats??10));const soldOut=maximumQuantity===0;const [quantity,setQuantity]=useState(1);const [busy,setBusy]=useState(false);const [error,setError]=useState("");const requestId=useRef(crypto.randomUUID());
  const total=new Intl.NumberFormat("it-IT",{style:"currency",currency:event.currency}).format(event.price*quantity);

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;setBusy(true);setError("");const data=new FormData(form);
    try{
      const response=await fetch("/api/ticketing/charity-requests",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({requestId:requestId.current,firstName:data.get("firstName"),lastName:data.get("lastName"),email:data.get("email"),phone:data.get("phone"),quantity,privacyAccepted:data.get("privacyAccepted")==="on"})});
      const body=await response.json() as {message?:string;redirectUrl?:string};if(!response.ok||body.redirectUrl!==PAYPAL_CHARITY_URL)throw new Error(body.message||"Richiesta non riuscita.");window.location.assign(body.redirectUrl);
    }catch(cause){setError(cause instanceof Error?cause.message:"Non è stato possibile registrare la richiesta.");setBusy(false);}
  }

  return <div className="nis-gala-invite-page">
    <header className="nis-gala-hero"><div className="nis-gala-tricolore" aria-hidden="true"><span/><span/><span/></div><div className="shell nis-gala-hero-inner">
      <Image className="nis-gala-logo" src="/logo/nis-logo-square.png" width={150} height={150} alt="Logo Nazionale Italiana Sanitari" priority/><p className="nis-gala-kicker">INVITO RISERVATO · NIS TICKETING</p><h1>{event.title}</h1><p className="nis-gala-date">{NIS_GALA_DETAILS.dateLabel}</p><p className="nis-gala-intro">Una serata di beneficenza per sostenere i progetti della Nazionale Italiana Sanitari.</p>
      <div className="nis-gala-event-info" aria-label="Informazioni sull'evento"><article><span>LOCATION</span><strong>{NIS_GALA_DETAILS.venue}</strong><p>{NIS_GALA_DETAILS.venueAddress}<br/>{NIS_GALA_DETAILS.venueLocality}</p><a href={NIS_GALA_DETAILS.venueUrl} target="_blank" rel="noopener noreferrer">Apri location</a></article><article><span>PARCHEGGIO</span><strong>{NIS_GALA_DETAILS.parking}</strong><p>{NIS_GALA_DETAILS.parkingAddress}<br/>{NIS_GALA_DETAILS.parkingLocality}</p><a href={NIS_GALA_DETAILS.parkingUrl} target="_blank" rel="noopener noreferrer">Apri parcheggio</a></article></div><p className="nis-gala-confidential">Invito riservato e confidenziale. Evento a numero chiuso.</p>
    </div></header>
    <section className="ticketing-checkout-section" aria-labelledby="gala-checkout-title"><div className="shell ticketing-checkout-layout"><div className="ticketing-form-panel"><p className="ticketing-section-label">PARTECIPAZIONE AL GALA</p><h2 id="gala-checkout-title">{soldOut?"Posti esauriti":"Sostieni i progetti NIS"}</h2>
      {soldOut?<div className="ticketing-sold-out" role="status"><strong>POSTI ESAURITI</strong><p>Non è più possibile richiedere inviti per questo evento.</p></div>:<form onSubmit={submit} className="ticketing-charity-donation"><div className="ticketing-form-grid"><label className="ticketing-field">Nome *<input name="firstName" required maxLength={80} autoComplete="given-name" disabled={busy}/></label><label className="ticketing-field">Cognome *<input name="lastName" required maxLength={80} autoComplete="family-name" disabled={busy}/></label><label className="ticketing-field">Email *<input name="email" type="email" required maxLength={254} autoComplete="email" disabled={busy}/></label><label className="ticketing-field">Telefono<input name="phone" type="tel" maxLength={40} autoComplete="tel" disabled={busy}/></label><label className="ticketing-field ticketing-field-full">Numero ingressi *<select name="quantity" value={quantity} onChange={change=>setQuantity(Number(change.target.value))} disabled={busy}>{Array.from({length:maximumQuantity},(_,index)=>index+1).map(value=><option key={value} value={value}>{value}</option>)}</select></label></div><div className="ticketing-privacy"><label><input name="privacyAccepted" type="checkbox" required disabled={busy}/><span>Dichiaro di aver letto la <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> e acconsento al trattamento dei dati per la gestione della richiesta.</span></label></div><p>La partecipazione al NIS Gala Charity Night prevede una donazione di 200 € per ingresso.<br/>Dopo aver effettuato la donazione, il tuo invito verrà emesso e inviato via email dopo la verifica.</p><button className="btn btn-blue ticketing-submit" type="submit" disabled={busy}>{busy?"REGISTRAZIONE IN CORSO...":`EFFETTUA UNA DONAZIONE DI ${total}`}</button>{error&&<p className="ticketing-request-error" role="alert">{error}</p>}<small>La richiesta non genera ancora alcun biglietto. Verrai indirizzato alla pagina ufficiale PayPal Charity.</small></form>}
    </div><aside className="ticketing-order-summary" aria-label="Riepilogo"><span>RIEPILOGO</span><h2>{event.title}</h2><p className="ticketing-summary-date">{NIS_GALA_DETAILS.dateLabel} · Roma</p><div><span>Numero ingressi</span><strong>{soldOut?"Non disponibile":quantity}</strong></div><div><span>Prezzo unitario</span><strong>{formatEventPrice(event)}</strong></div><div className="ticketing-order-total"><span>Totale</span><strong>{soldOut?"—":total}</strong></div><p>Emissione dopo verifica della donazione</p></aside></div></section>
    <footer className="nis-gala-footer"><Image src="/logo/nis-logo-round-transparent.png" width={54} height={54} alt="Nazionale Italiana Sanitari"/><div><strong>Nazionale Italiana Sanitari</strong><span>Ticketing ufficiale NIS · Ingresso nominativo</span></div></footer>
  </div>;
}
