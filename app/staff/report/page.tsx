import StaffNavigation from "@/components/StaffNavigation";
import StaffParticipantsDashboard from "@/components/StaffParticipantsDashboard";
import {requireSuperadminSession} from "@/lib/ticketing/staff-page";
import {getStaffEventContext} from "@/lib/ticketing/staff-event-context";

export const dynamic="force-dynamic";

export default async function StaffReportPage(){
  const session=await requireSuperadminSession();
  const event=await getStaffEventContext(session);
  return <main className="nis-checkin-page nis-staff-page"><div className="staff-workspace"><StaffNavigation role={session.role} selectedEventTitle={event.title}/><header className="staff-page-heading"><span>{event.title}</span><h1>Report</h1><p>Esporta i dati dell&apos;evento e consulta il riepilogo operativo.</p></header><StaffParticipantsDashboard role={session.role}/></div></main>;
}
