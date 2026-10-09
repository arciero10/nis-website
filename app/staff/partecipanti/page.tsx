import StaffNavigation from "@/components/StaffNavigation";
import StaffParticipantsDashboard from "@/components/StaffParticipantsDashboard";
import {requireStaffSession} from "@/lib/ticketing/staff-page";

export const dynamic="force-dynamic";

export default async function StaffParticipantsPage(){
  await requireStaffSession();
  return <main className="nis-checkin-page nis-staff-page"><div className="staff-workspace"><StaffNavigation/><header className="staff-page-heading"><span>NIS GALA CHARITY NIGHT</span><h1>Partecipanti</h1><p>Controllo affluenza e registrazione manuale degli ingressi.</p></header><StaffParticipantsDashboard/></div></main>;
}
