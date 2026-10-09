import StaffNavigation from "@/components/StaffNavigation";
import {requireStaffSession} from "@/lib/ticketing/staff-page";
import {ticketingRepository} from "@/lib/ticketing/repository";

export const dynamic="force-dynamic";

const formatDateTime=(value:string)=>new Intl.DateTimeFormat("it-IT",{dateStyle:"short",timeStyle:"medium",timeZone:"Europe/Rome"}).format(new Date(value));

export default async function StaffIngressPage(){
  await requireStaffSession();
  const dashboard=await ticketingRepository.getStaffIngressDashboard("nis-gala-2026");
  return <main className="nis-checkin-page nis-staff-page"><div className="staff-workspace"><StaffNavigation/><header className="staff-page-heading"><span>NIS GALA CHARITY NIGHT</span><h1>Storico ingressi</h1><p>Ingressi registrati, dal più recente.</p></header><section className="staff-metrics" aria-label="Riepilogo ingressi"><article><span>Biglietti emessi</span><strong>{dashboard.totalIssued}</strong></article><article><span>Ingressi registrati</span><strong>{dashboard.totalCheckedIn}</strong></article><article><span>Ancora da registrare</span><strong>{dashboard.totalPending}</strong></article></section><section className="staff-ingress-list" aria-label="Ingressi registrati">{dashboard.entries.length===0?<p className="staff-empty">Nessun ingresso registrato.</p>:dashboard.entries.map(entry=><article key={entry.ticketCode}><div><h2>{entry.firstName} {entry.lastName}</h2><p>{entry.ticketCode} · {entry.category}{entry.companyName?` · ${entry.companyName}`:""}</p></div><time dateTime={entry.checkedInAt}>{formatDateTime(entry.checkedInAt)}</time></article>)}</section></div></main>;
}
