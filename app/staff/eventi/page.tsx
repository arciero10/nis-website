import StaffEventsManager from "@/components/StaffEventsManager";
import StaffNavigation from "@/components/StaffNavigation";
import Link from "next/link";
import {listManagedEvents} from "@/lib/ticketing/event-management";
import {requireSuperadminSession} from "@/lib/ticketing/staff-page";

export const dynamic="force-dynamic";

export default async function StaffEventsPage(){const session=await requireSuperadminSession();const events=await listManagedEvents();const selected=events.find(event=>event.id===session.selectedEventId);return <main className="nis-checkin-page nis-staff-page event-admin-page"><div className="staff-workspace event-admin-workspace"><StaffNavigation role={session.role} selectedEventTitle={selected?.title}/><div className="staff-main-content"><header className="event-admin-heading"><div><span>BACKOFFICE NIS</span><h1>Eventi</h1><p>Crea, pubblica e gestisci gli eventi della Nazionale Italiana Sanitari.</p></div><Link className="event-admin-primary-cta" href="/staff/eventi/nuovo">+ Nuovo evento</Link></header><StaffEventsManager initialEvents={events} selectedEventId={session.selectedEventId}/></div></div></main>;}
