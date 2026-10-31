import StaffEventsManager from "@/components/StaffEventsManager";
import StaffNavigation from "@/components/StaffNavigation";
import {listManagedEvents} from "@/lib/ticketing/event-management";
import {requireSuperadminSession} from "@/lib/ticketing/staff-page";

export const dynamic="force-dynamic";

export default async function StaffEventsPage(){const session=await requireSuperadminSession();const events=await listManagedEvents();return <main className="nis-checkin-page nis-staff-page"><div className="staff-workspace"><StaffNavigation role={session.role}/><header className="staff-page-heading"><span>MOTORE EVENTI NIS</span><h1>Gestione eventi</h1><p>Crea nuove configurazioni, seleziona l&apos;evento operativo e consulta lo storico senza alterarlo.</p></header><StaffEventsManager initialEvents={events} selectedEventId={session.selectedEventId}/></div></main>;}
