import Link from "next/link";
import {notFound} from "next/navigation";
import StaffNavigation from "@/components/StaffNavigation";
import {getStaffTicketDetail} from "@/lib/ticketing/manual-repository";
import {complimentaryReasonLabel,issuanceSourceLabel} from "@/lib/ticketing/presentation";
import {requireStaffSession} from "@/lib/ticketing/staff-page";

export const dynamic="force-dynamic";

const dateTime=(value:string)=>new Intl.DateTimeFormat("it-IT",{dateStyle:"medium",timeStyle:"short",timeZone:"Europe/Rome"}).format(new Date(value));

export default async function StaffTicketDetailPage({params}:{params:Promise<{ticketCode:string}>}){
  const session=await requireStaffSession();const {ticketCode}=await params;if(!/^NIS26-[A-Z0-9]{8}$/i.test(ticketCode))notFound();const ticket=await getStaffTicketDetail(ticketCode.toUpperCase());if(!ticket)notFound();const reason=ticket.complimentaryReason==="OTHER"?ticket.complimentaryReasonOther:complimentaryReasonLabel(ticket.complimentaryReason);
  return <main className="nis-checkin-page nis-staff-page"><div className="staff-workspace"><StaffNavigation/><header className="staff-page-heading"><Link className="staff-back-link" href="/staff/partecipanti">← Partecipanti</Link><span>NIS GALA CHARITY NIGHT</span><h1>{ticket.ticketCode}</h1><p>{ticket.firstName} {ticket.lastName}</p></header><section className="staff-ticket-detail"><dl><div><dt>Origine</dt><dd>{issuanceSourceLabel(ticket.issuanceSource)}</dd></div><div><dt>Pagamento</dt><dd>{ticket.paymentStatus}</dd></div><div><dt>Data emissione</dt><dd>{dateTime(ticket.createdAt)}</dd></div>{ticket.createdBy&&<div><dt>Operatore</dt><dd>{ticket.createdBy}{ticket.createdByRole?` · ${ticket.createdByRole}`:""}</dd></div>}{ticket.declaredAmount!==null&&<div><dt>Importo dichiarato</dt><dd>{new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(ticket.declaredAmount)}</dd></div>}{ticket.transferDate&&<div><dt>Data bonifico</dt><dd>{new Intl.DateTimeFormat("it-IT",{dateStyle:"medium",timeZone:"UTC"}).format(new Date(`${ticket.transferDate}T00:00:00Z`))}</dd></div>}{ticket.transferReference&&<div><dt>CRO / TRN</dt><dd>{ticket.transferReference}</dd></div>}{ticket.complimentaryReason&&<div><dt>Motivo omaggio</dt><dd>{reason}</dd></div>}{ticket.notes&&<div className="is-wide"><dt>Note</dt><dd>{ticket.notes}</dd></div>}</dl>{ticket.document&&ticket.manualIssuanceId&&session.role==="SUPERADMIN"&&<a className="staff-document-link" href={`/api/ticketing/staff/manual-issuance/${ticket.manualIssuanceId}/document`} target="_blank" rel="noopener noreferrer">Visualizza contabile ({ticket.document.filename})</a>}</section></div></main>;
}
