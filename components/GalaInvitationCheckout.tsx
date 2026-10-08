import TicketPurchaseForm from "@/components/TicketPurchaseForm";
import {formatEventPrice} from "@/data/ticketing";
import type {Event} from "@/types/ticketing";

type InvitationCredential={accessToken:string;invitationAlias?:never}|{accessToken?:never;invitationAlias:string};

export default function GalaInvitationCheckout({event,paypalClientId,...credential}:{event:Event;paypalClientId:string}&InvitationCredential){
  return <>
    <header className="ticketing-page-head"><div className="shell"><div className="eyebrow white">INVITO RISERVATO · NIS TICKETING</div><h1>{event.title}</h1><p>Inserisci i dati del partecipante e prosegui sul checkout sicuro PayPal Sandbox.</p></div></header>
    <section className="ticketing-checkout-section"><div className="shell ticketing-checkout-layout"><div className="ticketing-form-panel"><h2>Dati partecipante</h2><TicketPurchaseForm {...credential} paypalClientId={paypalClientId} unitPrice={event.price}/></div><aside className="ticketing-order-summary"><span>RIEPILOGO</span><h2>{event.title}</h2><div><span>Ingressi</span><strong>Da 1 a 10</strong></div><div className="ticketing-order-total"><span>Prezzo unitario</span><strong>{formatEventPrice(event)}</strong></div><p>Categoria Standard · Accesso singolo</p></aside></div></section>
  </>;
}
