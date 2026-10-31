import Link from "next/link";
import StaffNavigation from "@/components/StaffNavigation";
import {listManagedEvents} from "@/lib/ticketing/event-management";
import {requireSuperadminSession} from "@/lib/ticketing/staff-page";

export const dynamic="force-dynamic";

export default async function StaffDashboardPage(){
  const session=await requireSuperadminSession();
  const events=await listManagedEvents();
  const selected=events.find(event=>event.id===session.selectedEventId)??events[0];
  return <main className="nis-checkin-page nis-staff-page event-admin-page"><div className="staff-workspace event-admin-workspace"><StaffNavigation role={session.role} selectedEventTitle={selected?.title}/><div className="staff-main-content"><header className="event-admin-heading"><div><span>BACKOFFICE NIS</span><h1>Dashboard</h1><p>Una vista rapida sull&apos;evento selezionato e sulle attività operative.</p></div><Link className="event-admin-primary-cta" href="/staff/eventi">Gestisci eventi</Link></header>{selected?<><section className="staff-dashboard-overview"><header><div><span>EVENTO SELEZIONATO</span><h2>{selected.title}</h2><p>{selected.location||"Luogo da definire"}</p></div><strong>{selected.status}</strong></header><dl><div><dt>Registrati</dt><dd>{selected.registered}</dd></div><div><dt>Biglietti</dt><dd>{selected.operational}</dd></div><div><dt>Entrati</dt><dd>{selected.entered}</dd></div><div><dt>No-show</dt><dd>{selected.noShow}</dd></div><div><dt>Ricavi</dt><dd>{new Intl.NumberFormat("it-IT",{style:"currency",currency:selected.currency,maximumFractionDigits:0}).format(selected.revenue)}</dd></div></dl></section><section className="staff-dashboard-shortcuts" aria-label="Azioni rapide"><Link href="/staff/partecipanti"><strong>Partecipanti</strong><span>Consulta iscritti e biglietti</span></Link><Link href="/checkin"><strong>Check-in</strong><span>Apri lo scanner operativo</span></Link><Link href="/staff/partecipanti#report"><strong>Report</strong><span>Esporta dati e riepiloghi</span></Link></section></>:<p className="event-admin-empty">Nessun evento configurato.</p>}</div></div></main>;
}
