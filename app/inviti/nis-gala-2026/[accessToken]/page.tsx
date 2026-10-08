import {notFound} from "next/navigation";
import TicketPurchaseForm from "@/components/TicketPurchaseForm";
import {formatEventPrice,nisGala2026} from "@/data/ticketing";
import {ticketingRepository} from "@/lib/ticketing/repository";

export const dynamic="force-dynamic";

export default async function GalaInvitationPage({params}:{params:Promise<{accessToken:string}>}){
  const {accessToken}=await params;
  const invitation=await ticketingRepository.findInvitationByAccessToken(accessToken);

  if(!invitation||invitation.eventId!==nisGala2026.id) notFound();

  return <>
    <header className="ticketing-page-head">
      <div className="shell">
        <div className="eyebrow white">INVITO RISERVATO · NIS TICKETING</div>
        <h1>{nisGala2026.title}</h1>
        <p>Inserisci i dati del partecipante. Il pagamento non è ancora attivo in questa prima fase.</p>
      </div>
    </header>
    <section className="ticketing-checkout-section">
      <div className="shell ticketing-checkout-layout">
        <div className="ticketing-form-panel">
          <h2>Dati partecipante</h2>
          <TicketPurchaseForm/>
        </div>
        <aside className="ticketing-order-summary">
          <span>RIEPILOGO</span>
          <h2>{nisGala2026.title}</h2>
          <div><span>Quantità</span><strong>1 ingresso</strong></div>
          <div className="ticketing-order-total"><span>Totale</span><strong>{formatEventPrice(nisGala2026)}</strong></div>
          <p>Categoria Standard · Accesso singolo</p>
        </aside>
      </div>
    </section>
  </>;
}
