"use client";

import Image from "next/image";
import {FormEvent,useRef,useState} from "react";
import {formatEventPrice,NIS_GALA_DETAILS} from "@/data/ticketing";
import type {Event} from "@/types/ticketing";

const PAYPAL_CHARITY_URL="https://www.paypal.com/fundraiser/charity/6169624";

type RequestConfirmation={
  requestCode:string;
  quantity:number;
  expectedAmount:number;
  currency:string;
  requesterEmailStatus:"SENT"|"FAILED"|"SKIPPED";
};

const money=(value:number,currency:string)=>new Intl.NumberFormat("it-IT",{style:"currency",currency}).format(value);

export default function GalaInvitationCheckout({event,availableSeats}:{event:Event;availableSeats:number|null}){
  const maximumQuantity=Math.max(0,Math.min(10,availableSeats??10));
  const soldOut=maximumQuantity===0;
  const [quantity,setQuantity]=useState(1);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [confirmation,setConfirmation]=useState<RequestConfirmation|null>(null);
  const requestId=useRef(crypto.randomUUID());
  const total=money(event.price*quantity,event.currency);

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const form=event.currentTarget;
    if(!form.reportValidity())return;
    setBusy(true);
    setError("");
    const data=new FormData(form);

    try{
      const firstName=String(data.get("firstName")||"");
      const lastName=String(data.get("lastName")||"");
      const participants=[
        {firstName,lastName},
        ...Array.from({length:quantity-1},(_,index)=>({
          firstName:String(data.get(`participant-${index+2}-firstName`)||""),
          lastName:String(data.get(`participant-${index+2}-lastName`)||""),
        })),
      ];
      const response=await fetch("/api/ticketing/charity-requests",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          requestId:requestId.current,
          firstName,
          lastName,
          email:data.get("email"),
          phone:data.get("phone"),
          quantity,
          participants,
          privacyAccepted:data.get("privacyAccepted")==="on",
        }),
      });
      const body=await response.json() as {
        message?:string;
        requestCode?:string;
        quantity?:number;
        expectedAmount?:number;
        currency?:string;
        requesterEmailStatus?:"SENT"|"FAILED"|"SKIPPED";
        redirectUrl?:string;
      };
      if(!response.ok||body.redirectUrl!==PAYPAL_CHARITY_URL||!body.requestCode||typeof body.quantity!=="number"||typeof body.expectedAmount!=="number"||!body.currency||!body.requesterEmailStatus){
        throw new Error(body.message||"Richiesta non riuscita.");
      }
      setConfirmation({
        requestCode:body.requestCode,
        quantity:body.quantity,
        expectedAmount:body.expectedAmount,
        currency:body.currency,
        requesterEmailStatus:body.requesterEmailStatus,
      });
    }catch(cause){
      setError(cause instanceof Error?cause.message:"Non è stato possibile registrare la richiesta.");
      setBusy(false);
    }
  }

  const summaryQuantity=confirmation?.quantity??quantity;
  const summaryTotal=confirmation?money(confirmation.expectedAmount,confirmation.currency):total;

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

    <section className="ticketing-checkout-section" aria-labelledby="gala-checkout-title">
      <div className="shell ticketing-checkout-layout">
        <div className="ticketing-form-panel">
          <p className="ticketing-section-label">PARTECIPAZIONE AL GALA</p>
          <h2 id="gala-checkout-title">{soldOut?"Posti esauriti":confirmation?"Richiesta registrata correttamente":"Sostieni i progetti NIS"}</h2>

          {soldOut?<div className="ticketing-sold-out" role="status"><strong>POSTI ESAURITI</strong><p>Non è più possibile richiedere inviti per questo evento.</p></div>:confirmation?<div className="ticketing-request-success" role="status" aria-live="polite">
            <div className="ticketing-request-success-mark" aria-hidden="true">✓</div>
            <p className="ticketing-request-status">IN ATTESA DI VERIFICA DELLA DONAZIONE</p>
            <dl>
              <div><dt>Codice richiesta</dt><dd>{confirmation.requestCode}</dd></div>
              <div><dt>Numero ingressi</dt><dd>{confirmation.quantity}</dd></div>
              <div><dt>Contributo previsto</dt><dd>{summaryTotal}</dd></div>
            </dl>
            <div className="ticketing-request-next-step">
              <strong>La richiesta non costituisce ancora un biglietto.</strong>
              <p>Dopo aver effettuato la donazione, riceverai l&apos;invito ufficiale con QR code soltanto quando l&apos;organizzazione avrà verificato il contributo. Non è necessario ripetere la richiesta mentre attendi la conferma.</p>
            </div>
            {confirmation.requesterEmailStatus==="SENT"?<p className="ticketing-request-email-note">Abbiamo inviato una conferma all&apos;indirizzo email indicato. Controlla anche la cartella Spam o Posta indesiderata.</p>:<p className="ticketing-request-email-note">Conserva il codice richiesta mostrato in questa pagina. La richiesta è stata registrata correttamente.</p>}
            <a className="btn btn-blue ticketing-submit" href={PAYPAL_CHARITY_URL} rel="noopener noreferrer">CONTINUA SU PAYPAL CHARITY</a>
          </div>:<form onSubmit={submit} className="ticketing-charity-donation">
            <fieldset className="ticketing-participant-fields">
              <legend>Partecipante 1 · Referente</legend>
              <div className="ticketing-form-grid">
                <label className="ticketing-field">Nome *<input name="firstName" required maxLength={80} autoComplete="given-name" disabled={busy}/></label>
                <label className="ticketing-field">Cognome *<input name="lastName" required maxLength={80} autoComplete="family-name" disabled={busy}/></label>
                <label className="ticketing-field">Email *<input name="email" type="email" required maxLength={254} autoComplete="email" disabled={busy}/></label>
                <label className="ticketing-field">Telefono<input name="phone" type="tel" maxLength={40} autoComplete="tel" disabled={busy}/></label>
              </div>
            </fieldset>
            <label className="ticketing-field ticketing-field-full">Numero ingressi *<select name="quantity" value={quantity} onChange={change=>setQuantity(Number(change.target.value))} disabled={busy}>{Array.from({length:maximumQuantity},(_,index)=>index+1).map(value=><option key={value} value={value}>{value}</option>)}</select></label>
            {Array.from({length:quantity-1},(_,index)=>index+2).map(position=><fieldset className="ticketing-participant-fields" key={position}><legend>Partecipante {position}</legend><div className="ticketing-form-grid"><label className="ticketing-field">Nome *<input name={`participant-${position}-firstName`} required maxLength={80} disabled={busy}/></label><label className="ticketing-field">Cognome *<input name={`participant-${position}-lastName`} required maxLength={80} disabled={busy}/></label></div></fieldset>)}
            <div className="ticketing-privacy"><label><input name="privacyAccepted" type="checkbox" required disabled={busy}/><span>Dichiaro di aver letto la <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> e acconsento al trattamento dei dati per la gestione della richiesta.</span></label></div>
            <div className="ticketing-request-warning" role="note">
              <strong>Prima di continuare</strong>
              <p>La registrazione della richiesta non costituisce ancora un biglietto. Dopo aver effettuato la donazione, riceverai l&apos;invito ufficiale con QR code soltanto quando l&apos;organizzazione avrà verificato il contributo. Non è necessario ripetere la richiesta mentre attendi la conferma.</p>
            </div>
            <p>La partecipazione al NIS Gala Charity Night prevede una donazione di 200 € per ingresso.</p>
            <button className="btn btn-blue ticketing-submit" type="submit" disabled={busy}>{busy?"REGISTRAZIONE IN CORSO...":`REGISTRA LA RICHIESTA · ${total}`}</button>
            {error&&<p className="ticketing-request-error" role="alert">{error}</p>}
            <small>Dopo la registrazione potrai continuare sulla pagina ufficiale PayPal Charity.</small>
          </form>}
        </div>

        <aside className="ticketing-order-summary" aria-label="Riepilogo">
          <span>RIEPILOGO</span>
          <h2>{event.title}</h2>
          <p className="ticketing-summary-date">{NIS_GALA_DETAILS.dateLabel} · Roma</p>
          <div><span>Numero ingressi</span><strong>{soldOut?"Non disponibile":summaryQuantity}</strong></div>
          <div><span>Prezzo unitario</span><strong>{formatEventPrice(event)}</strong></div>
          <div className="ticketing-order-total"><span>Totale</span><strong>{soldOut?"—":summaryTotal}</strong></div>
          <p>Emissione dopo verifica della donazione</p>
        </aside>
      </div>
    </section>

    <footer className="nis-gala-footer"><Image src="/logo/nis-logo-round-transparent.png" width={54} height={54} alt="Nazionale Italiana Sanitari"/><div><strong>Nazionale Italiana Sanitari</strong><span>Ticketing ufficiale NIS · Ingresso nominativo</span></div></footer>
  </div>;
}
