import Image from "next/image";
import {notFound} from "next/navigation";
import QRCode from "qrcode";
import {buildTicketQrPayload,findTicketPosition,ticketStatusLabel} from "@/lib/ticketing/presentation";
import {ticketingRepository} from "@/lib/ticketing/repository";

export const dynamic="force-dynamic";

export default async function DigitalTicketPage({params}:{params:Promise<{qrToken:string}>}){
  const {qrToken}=await params;const confirmation=await ticketingRepository.findConfirmationByQrToken(qrToken);if(!confirmation)notFound();
  const position=findTicketPosition(confirmation.tickets,qrToken);if(position<0)notFound();
  const ticket=confirmation.tickets[position];const attendee=confirmation.attendees[position];const qrPayload=buildTicketQrPayload(qrToken);const statusLabel=ticketStatusLabel(ticket.status);
  const qrDataUrl=await QRCode.toDataURL(qrPayload,{errorCorrectionLevel:"M",margin:2,width:320,color:{dark:"#041d3b",light:"#ffffff"}});

  return <div className="nis-digital-ticket-page"><div className="nis-digital-ticket-shell"><article className="nis-digital-ticket">
    <header className="nis-ticket-brand"><Image src="/logo/nis-logo-square.png" width={112} height={112} alt="Logo Nazionale Italiana Sanitari" priority/><div><span>NIS TICKETING</span><h1>{confirmation.event.title}</h1></div></header>
    <div className="nis-ticket-body"><section className="nis-ticket-details"><div><span>Partecipante</span><strong>{attendee.firstName} {attendee.lastName}</strong></div><div><span>Codice ticket</span><strong className="nis-ticket-code">{ticket.ticketCode}</strong></div><div className="nis-ticket-detail-grid"><p><span>Categoria</span><strong>Standard</strong></p><p><span>Importo</span><strong>{new Intl.NumberFormat("it-IT",{style:"currency",currency:confirmation.event.currency}).format(confirmation.event.price)}</strong></p></div><div className={`nis-ticket-status nis-ticket-status-${ticket.status.toLowerCase()}`}><span>Stato ticket</span><strong>{statusLabel}</strong>{ticket.status==="USED"&&ticket.firstCheckInAt&&<small>Utilizzato il {new Intl.DateTimeFormat("it-IT",{dateStyle:"short",timeStyle:"medium",timeZone:"Europe/Rome"}).format(new Date(ticket.firstCheckInAt))}</small>}</div></section>
      <section className="nis-ticket-qr" aria-label="Codice QR del biglietto"><Image src={qrDataUrl} width={320} height={320} unoptimized alt={`QR Code del ticket ${ticket.ticketCode}`}/><p>Mostra questo QR all'ingresso</p></section>
    </div><footer className="nis-ticket-footer"><span>Nazionale Italiana Sanitari</span><span>Ingresso nominativo · Accesso singolo</span></footer>
  </article></div></div>;
}
