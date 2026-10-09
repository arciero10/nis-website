import TicketPurchaseForm from "@/components/TicketPurchaseForm";
import {formatEventPrice} from "@/data/ticketing";
import type {Event} from "@/types/ticketing";

type InvitationCredential={accessToken:string;invitationAlias?:never}|{accessToken?:never;invitationAlias:string};

export default function GalaInvitationCheckout({event,paypalClientId,availableSeats,...credential}:{event:Event;paypalClientId:string;availableSeats:number|null}&InvitationCredential){
  const maxQuantity=availableSeats===null?10:Math.min(10,availableSeats);const soldOut=maxQuantity===0;
  return <>
    <header className="ticketing-page-head"><div className="shell"><div className="eyebrow white">INVITO RISERVATO · NIS TICKETING</div><h1>{event.title}</h1><p>Inserisci i dati del partecipante e prosegui sul checkout sicuro PayPal Sandbox.</p></div></header>
    <section className="ticketing-checkout-section"><div className="shell ticketing-checkout-layout"><div className="ticketing-form-panel"><h2>{soldOut?"Posti esauriti":"Dati partecipante"}</h2>{soldOut?<div className="ticketing-sold-out" role="status"><strong>POSTI ESAURITI</strong><p>La capienza disponibile per il NIS Gala è stata raggiunta.</p></div>:<TicketPurchaseForm {...credential} paypalClientId={paypalClientId} unitPrice={event.price} maxQuantity={maxQuantity}/>}</div><aside className="ticketing-order-summary"><span>RIEPILOGO</span><h2>{event.title}</h2><div><span>Ingressi</span><strong>{soldOut?"Non disponibili":"Selezionabili nel modulo"}</strong></div><div className="ticketing-order-total"><span>Prezzo unitario</span><strong>{formatEventPrice(event)}</strong></div><p>Categoria Standard · Accesso singolo</p></aside></div></section>
  </>;
}
