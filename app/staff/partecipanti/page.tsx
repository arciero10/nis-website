import StaffNavigation from "@/components/StaffNavigation";
import StaffParticipantsDashboard from "@/components/StaffParticipantsDashboard";
import {requireStaffSession} from "@/lib/ticketing/staff-page";
import {getStaffEventContext} from "@/lib/ticketing/staff-event-context";

export const dynamic="force-dynamic";

export default async function StaffParticipantsPage(){
  const session=await requireStaffSession();
  const event=await getStaffEventContext(session);
  return <main className="nis-checkin-page nis-staff-page"><div className="staff-workspace"><StaffNavigation role={session.role} selectedEventTitle={event.title}/><header className="staff-page-heading"><span>{event.title}</span><h1>Partecipanti</h1><p>Controllo affluenza e registrazione manuale degli ingressi.</p></header><StaffParticipantsDashboard role={session.role}/></div></main>;
}
