import {notFound} from "next/navigation";
import TicketPurchaseForm from "@/components/TicketPurchaseForm";
import {formatEventPrice} from "@/data/ticketing";
import {ticketingRepository} from "@/lib/ticketing/repository";

export const dynamic="force-dynamic";

export default async function GalaInvitationPage({params}:{params:Promise<{accessToken:string}>}){
  const {accessToken}=await params;
  const [invitation,event]=await Promise.all([ticketingRepository.findInvitationByAccessToken(accessToken),ticketingRepository.findEventBySlug("nis-gala-2026")]);

  if(!invitation||!event||invitation.eventId!==event.id) notFound();

  return <>
    <header className="ticketing-page-head">
      <div className="shell">
        <div className="eyebrow white">INVITO RISERVATO · NIS TICKETING</div>
        <h1>{event.title}</h1>
        <p>Inserisci i dati del partecipante e prosegui sul checkout sicuro PayPal Sandbox.</p>
      </div>
    </header>
    <section className="ticketing-checkout-section">
      <div className="shell ticketing-checkout-layout">
        <div className="ticketing-form-panel">
          <h2>Dati partecipante</h2>
          <TicketPurchaseForm accessToken={accessToken} paypalClientId={process.env.PAYPAL_CLIENT_ID?.trim()??""}/>
        </div>
        <aside className="ticketing-order-summary">
          <span>RIEPILOGO</span>
          <h2>{event.title}</h2>
          <div><span>Quantità</span><strong>1 ingresso</strong></div>
          <div className="ticketing-order-total"><span>Totale</span><strong>{formatEventPrice(event)}</strong></div>
          <p>Categoria Standard · Accesso singolo</p>
        </aside>
      </div>
    </section>
  </>;
}
