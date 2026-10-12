import Image from "next/image";
import {notFound} from "next/navigation";
import QRCode from "qrcode";
import {NIS_GALA_DETAILS} from "@/data/ticketing";
import {allocationTypeLabel,buildTicketQrPayload,ticketStatusLabel} from "@/lib/ticketing/presentation";
import {ticketingRepository} from "@/lib/ticketing/repository";
import {walletLinksForToken} from "@/lib/ticketing/wallet/config";

export const dynamic="force-dynamic";

export default async function DigitalTicketPage({params}:{params:Promise<{qrToken:string}>}){
  const {qrToken}=await params;const record=await ticketingRepository.findDigitalTicketByQrToken(qrToken);if(!record)notFound();
  const {event,attendee,ticket,companyName,allocationType}=record;const companyInvitation=ticket.category==="PARTNER";const complimentary=ticket.issuanceSource==="COMPLIMENTARY";const invitationType=allocationTypeLabel(allocationType??"AZIENDA");const qrPayload=buildTicketQrPayload(qrToken);const statusLabel=ticketStatusLabel(ticket.status);
  const qrDataUrl=await QRCode.toDataURL(qrPayload,{errorCorrectionLevel:"M",margin:2,width:320,color:{dark:"#041d3b",light:"#ffffff"}});const walletLinks=walletLinksForToken(qrToken);

  return <div className="nis-digital-ticket-page"><div className="nis-digital-ticket-shell"><article className="nis-digital-ticket">
    <header className="nis-ticket-brand"><Image src="/logo/nis-logo-square.png" width={112} height={112} alt="Logo Nazionale Italiana Sanitari" priority/><div><span>NIS TICKETING</span><h1>{event.title}</h1><p><time dateTime="2026-10-28">{NIS_GALA_DETAILS.dateLabel}</time> · {NIS_GALA_DETAILS.venue}, Roma</p></div></header>
    <div className="nis-ticket-body">
      {companyInvitation?<section className="nis-ticket-holder nis-ticket-partner-holder" aria-labelledby="ticket-holder-name"><span>INVITO</span><h2 id="ticket-holder-name">{companyName}</h2><p>Ingresso {ticket.sequenceNumber??1} di {ticket.totalQuantity??1}</p></section>:<section className="nis-ticket-holder" aria-labelledby="ticket-holder-name"><span>PARTECIPANTE</span><h2 id="ticket-holder-name">{attendee.firstName} {attendee.lastName}</h2></section>}
      <section className="nis-ticket-qr" aria-label="Codice QR del biglietto"><div className="nis-ticket-qr-frame"><Image src={qrDataUrl} width={320} height={320} unoptimized alt={`QR Code del ticket ${ticket.ticketCode}`}/></div><p>Mostra questo QR all’ingresso</p></section>
      <section className="nis-ticket-verification"><div><span>Codice ticket</span><strong className="nis-ticket-code">{ticket.ticketCode}</strong></div><div className={`nis-ticket-status nis-ticket-status-${ticket.status.toLowerCase()}`}><span>Stato ticket</span><strong>{statusLabel}</strong>{ticket.status==="USED"&&ticket.firstCheckInAt&&<small>Utilizzato il {new Intl.DateTimeFormat("it-IT",{dateStyle:"short",timeStyle:"medium",timeZone:"Europe/Rome"}).format(new Date(ticket.firstCheckInAt))}</small>}</div></section>
      <section className="nis-ticket-details" aria-label="Dettagli ingresso"><div className="nis-ticket-detail-grid">{companyInvitation?<p><span>Tipo invito</span><strong>{invitationType}</strong></p>:<><p><span>Categoria</span><strong>Standard</strong></p>{!complimentary&&<p><span>Importo</span><strong>{new Intl.NumberFormat("it-IT",{style:"currency",currency:event.currency}).format(event.price)}</strong></p>}</>}</div></section>
      {(walletLinks.apple||walletLinks.google)&&<section className="nis-ticket-wallets" aria-label="Aggiungi il biglietto al wallet">{walletLinks.apple&&<a className="nis-wallet-button nis-wallet-button-apple" href={walletLinks.apple}>Aggiungi ad Apple Wallet</a>}{walletLinks.google&&<a className="nis-wallet-button nis-wallet-button-google" href={walletLinks.google}>Aggiungi a Google Wallet</a>}</section>}
    </div><footer className="nis-ticket-footer"><span>Ticket gestito tramite piattaforma digitale NIS</span></footer>
  </article></div></div>;
}
