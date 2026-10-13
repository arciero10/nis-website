import Link from "next/link";
import {notFound} from "next/navigation";
import StaffNavigation from "@/components/StaffNavigation";
import {getStaffTicketDetail} from "@/lib/ticketing/manual-repository";
import {invitationTypeLabel,issuanceSourceLabel} from "@/lib/ticketing/presentation";
import {requireStaffSession} from "@/lib/ticketing/staff-page";

export const dynamic="force-dynamic";

const dateTime=(value:string)=>new Intl.DateTimeFormat("it-IT",{dateStyle:"medium",timeStyle:"short",timeZone:"Europe/Rome"}).format(new Date(value));

export default async function StaffTicketDetailPage({params}:{params:Promise<{ticketCode:string}>}){
  await requireStaffSession();const {ticketCode}=await params;if(!/^NIS26-[A-Z0-9]{8}$/i.test(ticketCode))notFound();const ticket=await getStaffTicketDetail(ticketCode.toUpperCase());if(!ticket)notFound();
  return <main className="nis-checkin-page nis-staff-page"><div className="staff-workspace"><StaffNavigation/><header className="staff-page-heading"><Link className="staff-back-link" href="/staff/partecipanti">← Partecipanti</Link><span>NIS GALA CHARITY NIGHT</span><h1>{ticket.ticketCode}</h1><p>{ticket.firstName} {ticket.lastName}</p></header><section className="staff-ticket-detail"><dl><div><dt>Origine</dt><dd>{issuanceSourceLabel(ticket.issuanceSource)}</dd></div><div><dt>Tipo invito</dt><dd>{invitationTypeLabel(ticket.invitationType)}</dd></div><div><dt>Email</dt><dd>{ticket.email}</dd></div><div><dt>Stato email</dt><dd>{ticket.emailStatus==="SENT"?"INVIATA":ticket.emailStatus==="FAILED"?"ERRORE":"DA INVIARE"}</dd></div>{ticket.emailSentAt&&<div><dt>Inviata il</dt><dd>{dateTime(ticket.emailSentAt)}</dd></div>}<div><dt>Tentativi</dt><dd>{ticket.emailSendAttempts}</dd></div>{ticket.emailLastError&&<div className="is-wide"><dt>Ultimo errore</dt><dd>{ticket.emailLastError}</dd></div>}<div><dt>Pagamento</dt><dd>{ticket.paymentStatus}</dd></div><div><dt>Data emissione</dt><dd>{dateTime(ticket.createdAt)}</dd></div>{ticket.createdBy&&<div><dt>Operatore</dt><dd>{ticket.createdBy}{ticket.createdByRole?` · ${ticket.createdByRole}`:""}</dd></div>}{ticket.organization&&<div><dt>Organizzazione</dt><dd>{ticket.organization}</dd></div>}{ticket.declaredAmount!==null&&<div><dt>Importo dichiarato</dt><dd>{new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(ticket.declaredAmount)}</dd></div>}{ticket.transferDate&&<div><dt>Data bonifico</dt><dd>{new Intl.DateTimeFormat("it-IT",{dateStyle:"medium",timeZone:"UTC"}).format(new Date(`${ticket.transferDate}T00:00:00Z`))}</dd></div>}{ticket.transferReference&&<div><dt>CRO / TRN</dt><dd>{ticket.transferReference}</dd></div>}{ticket.reason&&<div className="is-wide"><dt>Motivo amministrativo</dt><dd>{ticket.reason}</dd></div>}{ticket.notes&&<div className="is-wide"><dt>Note</dt><dd>{ticket.notes}</dd></div>}</dl></section></div></main>;
}
