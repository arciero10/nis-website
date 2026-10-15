import Image from "next/image";
import {notFound} from "next/navigation";
import QRCode from "qrcode";
import {NIS_GALA_DETAILS} from "@/data/ticketing";
import {buildTicketPdfUrl,buildTicketQrPayload,invitationTypeLabel,ticketStatusLabel} from "@/lib/ticketing/presentation";
import {formatTicketHolderName} from "@/lib/ticketing/name-format";
import {ticketingRepository} from "@/lib/ticketing/repository";
import {walletLinksForToken} from "@/lib/ticketing/wallet/config";

export const dynamic="force-dynamic";
const locationUrl="https://www.google.com/maps/search/?api=1&query=Another+Studio%2C+Via+di+Pietralata+183%2C+Roma";
const parkingUrl="https://www.google.com/maps/search/?api=1&query=Parking+Pietralata%2C+Via+del+Casale+Rocchi+3%2C+Roma";

export default async function DigitalTicketPage({params}:{params:Promise<{qrToken:string}>}){
  const {qrToken}=await params;const record=await ticketingRepository.findDigitalTicketByQrToken(qrToken);if(!record)notFound();
  const {attendee,ticket,companyName}=record;const company=ticket.issuanceSource==="COMPANY";const admin=ticket.issuanceSource==="ADMIN";const type=invitationTypeLabel(ticket.invitationType);const holderName=formatTicketHolderName(attendee.firstName,attendee.lastName);const qrPayload=buildTicketQrPayload(qrToken);const qrDataUrl=await QRCode.toDataURL(qrPayload,{errorCorrectionLevel:"M",margin:2,width:360,color:{dark:"#041d3b",light:"#ffffff"}});const walletLinks=walletLinksForToken(qrToken);
  return <main className="nis-digital-ticket-page"><div className="nis-digital-ticket-shell"><article className="nis-digital-ticket">
    <div className="nis-ticket-hero"><Image src="/images/nis-gala-2026-ticket-hero.png" width={1200} height={630} sizes="(max-width: 720px) 100vw, 700px" priority alt="NIS Gala Charity Night, 28 ottobre 2026, Another Studio Roma"/></div>
    <div className="nis-ticket-body">
      <section className="nis-ticket-holder" aria-labelledby="ticket-holder-name"><span>{admin?`INVITO ${type.toUpperCase()}`:company?"INVITO":"BIGLIETTO NOMINATIVO"}</span><h1 id="ticket-holder-name">{company?companyName:holderName}</h1>{company&&<p>{type} · Ingresso {ticket.sequenceNumber??1} di {ticket.totalQuantity??1}</p>}{admin&&<p>Tipo invito: {type}</p>}</section>
      <section className="nis-ticket-qr" aria-label="Codice QR del biglietto"><div className="nis-ticket-qr-frame"><Image src={qrDataUrl} width={360} height={360} unoptimized alt={`QR Code del ticket ${ticket.ticketCode}`}/></div><p>Mostra questo QR all’ingresso</p></section>
      <section className="nis-ticket-verification"><div><span>Codice ticket</span><strong className="nis-ticket-code">{ticket.ticketCode}</strong></div><div className={`nis-ticket-status nis-ticket-status-${ticket.status.toLowerCase()}`}><span>Stato ticket</span><strong>{ticketStatusLabel(ticket.status)}</strong>{ticket.status==="USED"&&ticket.firstCheckInAt&&<small>Utilizzato il {new Intl.DateTimeFormat("it-IT",{dateStyle:"short",timeStyle:"medium",timeZone:"Europe/Rome"}).format(new Date(ticket.firstCheckInAt))}</small>}</div></section>
      {!company&&!admin&&<section className="nis-ticket-details"><div className="nis-ticket-detail-grid"><p><span>Categoria</span><strong>Standard</strong></p><p><span>Importo</span><strong>{new Intl.NumberFormat("it-IT",{style:"currency",currency:record.event.currency}).format(record.event.price)}</strong></p></div></section>}
      <a className="btn btn-blue nis-ticket-download" href={buildTicketPdfUrl(qrToken)}>Scarica PDF</a>
      {(walletLinks.apple||walletLinks.google)&&<section className="nis-ticket-wallets" aria-label="Aggiungi il biglietto al wallet">{walletLinks.apple&&<a className="nis-wallet-button nis-wallet-button-apple" href={walletLinks.apple}>Aggiungi ad Apple Wallet</a>}{walletLinks.google&&<a className="nis-wallet-button nis-wallet-button-google" href={walletLinks.google}>Aggiungi a Google Wallet</a>}</section>}
      <section className="nis-ticket-visit" aria-label="Location e parcheggio"><article><span>LOCATION</span><h2>Another Studio</h2><p>Via di Pietralata 183<br/>00158 Roma RM</p><a href={locationUrl} target="_blank" rel="noopener noreferrer">APRI LOCATION</a></article><article><span>PARCHEGGIO</span><h2>Parking Pietralata</h2><p>Via del Casale Rocchi 3<br/>Roma</p><a href={parkingUrl} target="_blank" rel="noopener noreferrer">APRI PARCHEGGIO</a></article></section>
      <p className="nis-ticket-event-date"><time dateTime="2026-10-28">{NIS_GALA_DETAILS.dateLabel}</time> · Roma</p>
    </div><footer className="nis-ticket-footer">Ticket gestito tramite piattaforma digitale NIS</footer>
  </article></div></main>;
}
