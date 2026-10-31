import Link from "next/link";
import StaffEventWizard from "@/components/StaffEventWizard";
import StaffNavigation from "@/components/StaffNavigation";
import {listManagedEvents} from "@/lib/ticketing/event-management";
import {requireSuperadminSession} from "@/lib/ticketing/staff-page";

export const dynamic="force-dynamic";

export default async function NewStaffEventPage(){
  const session=await requireSuperadminSession();
  const events=await listManagedEvents();
  const selected=events.find(event=>event.id===session.selectedEventId);
  return <main className="nis-checkin-page nis-staff-page event-admin-page"><div className="staff-workspace event-admin-workspace"><StaffNavigation role={session.role} selectedEventTitle={selected?.title}/><div className="staff-main-content"><header className="event-admin-heading event-admin-heading-compact"><div><Link href="/staff/eventi">← Eventi</Link><h1>Nuovo evento</h1><p>Configura il nuovo appuntamento NIS. Il salvataggio crea sempre una bozza.</p></div></header><StaffEventWizard/></div></div></main>;
}
