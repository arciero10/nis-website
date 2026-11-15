import Link from "next/link";
import Icon from "@/components/Icon";
import StaffNavigation from "@/components/StaffNavigation";
import {listManagedEvents} from "@/lib/ticketing/event-management";
import {getStaffEventContext} from "@/lib/ticketing/staff-event-context";
import {requireStaffSession} from "@/lib/ticketing/staff-page";

export const dynamic="force-dynamic";

const superadminShortcuts=[
  {href:"/admin/eventi",icon:"calendar",title:"Gestione eventi",description:"Configura, pubblica e consulta gli eventi NIS."},
  {href:"/admin/partecipanti",icon:"people",title:"Partecipanti",description:"Controlla iscritti, ticket e stato degli ingressi."},
  {href:"/admin/biglietti",icon:"ticket",title:"Biglietti",description:"Gestisci emissioni manuali e inviti autorizzati."},
  {href:"/admin/checkin",icon:"scan",title:"Check-in",description:"Apri lo scanner e controlla la finestra ingressi."},
  {href:"/admin/aziende",icon:"handshake",title:"Aziende",description:"Gestisci sponsor, ospiti e assegnazioni aziendali."},
  {href:"/admin/report",icon:"chart",title:"Report",description:"Consulta indicatori ed esporta i dati evento."},
  {href:"/admin/ordini-nissettone",icon:"box",title:"NISSETTONE",description:"Ordini, consegne e inventario autorizzato."},
];

const staffShortcuts=[
  {href:"/admin/checkin",icon:"scan",title:"Apri check-in",description:"Scansiona rapidamente il prossimo ingresso.",primary:true},
  {href:"/admin/cerca",icon:"search",title:"Cerca partecipante",description:"Trova un nominativo o un codice ticket."},
  {href:"/admin/partecipanti",icon:"people",title:"Partecipanti",description:"Consulta l'elenco operativo dell'evento."},
  {href:"/admin/ingressi",icon:"door",title:"Storico ingressi",description:"Visualizza gli accessi già registrati."},
];

export default async function StaffDashboardPage(){
  const session=await requireStaffSession();

  if(session.role==="STAFF"){
    const event=await getStaffEventContext(session);
    const dashboardLabel="Dashboard operativa";
    return <main className="nis-checkin-page nis-staff-page event-admin-page"><div className="staff-workspace event-admin-workspace"><StaffNavigation role={session.role} selectedEventTitle={event.title}/><div className="staff-main-content"><header className="event-admin-heading management-dashboard-intro"><div><span>AREA OPERATIVA</span><h1>{dashboardLabel}</h1><p>Le operazioni essenziali dell&apos;evento sono sempre a portata di mano.</p></div><strong className="management-role-chip">STAFF</strong></header><section className="staff-dashboard-overview"><header><div><span>EVENTO SELEZIONATO</span><h2>{event.title}</h2><p>Ambiente operativo corrente</p></div><strong>{event.status}</strong></header></section><section aria-labelledby="staff-actions-title"><div className="management-section-title"><div><span>OPERAZIONI RAPIDE</span><h2 id="staff-actions-title">Cosa devi fare?</h2></div></div><div className="management-shortcut-grid is-staff">{staffShortcuts.map(item=><Link key={item.href} href={item.href} className={item.primary?"is-primary":""}><span className="management-shortcut-icon"><Icon name={item.icon} size={25}/></span><div><strong>{item.title}</strong><span>{item.description}</span></div><b aria-hidden="true">→</b></Link>)}</div></section></div></div></main>;
  }

  const events=await listManagedEvents();
  const selected=events.find(event=>event.id===session.selectedEventId)??events[0];
  return <main className="nis-checkin-page nis-staff-page event-admin-page"><div className="staff-workspace event-admin-workspace"><StaffNavigation role={session.role} selectedEventTitle={selected?.title}/><div className="staff-main-content"><header className="event-admin-heading management-dashboard-intro"><div><span>PANORAMICA GENERALE</span><h1>Dashboard amministrativa</h1><p>Eventi, partecipanti e attività operative in un unico spazio.</p></div><Link className="event-admin-primary-cta" href="/admin/eventi"><Icon name="calendar" size={18}/>Gestisci eventi</Link></header>{selected?<><section className="staff-dashboard-overview"><header><div><span>EVENTO SELEZIONATO</span><h2>{selected.title}</h2><p>{selected.location||"Luogo da definire"}</p></div><strong>{selected.status}</strong></header><dl><div><dt>Registrati</dt><dd>{selected.registered}</dd></div><div><dt>Biglietti</dt><dd>{selected.operational}</dd></div><div><dt>Entrati</dt><dd>{selected.entered}</dd></div><div><dt>No-show</dt><dd>{selected.noShow}</dd></div><div><dt>Ricavi</dt><dd>{new Intl.NumberFormat("it-IT",{style:"currency",currency:selected.currency,maximumFractionDigits:0}).format(selected.revenue)}</dd></div></dl></section><section aria-labelledby="management-sections-title"><div className="management-section-title"><div><span>MODULI</span><h2 id="management-sections-title">Strumenti di gestione</h2></div><p>Accedi alle funzioni disponibili per il tuo ruolo.</p></div><div className="management-shortcut-grid">{superadminShortcuts.map(item=><Link key={item.href} href={item.href}><span className="management-shortcut-icon"><Icon name={item.icon} size={24}/></span><div><strong>{item.title}</strong><span>{item.description}</span></div><b aria-hidden="true">→</b></Link>)}</div></section></>:<p className="event-admin-empty">Nessun evento configurato.</p>}</div></div></main>;
}
