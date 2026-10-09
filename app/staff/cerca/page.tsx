import StaffNavigation from "@/components/StaffNavigation";
import StaffTicketSearch from "@/components/StaffTicketSearch";
import {requireStaffSession} from "@/lib/ticketing/staff-page";

export const dynamic="force-dynamic";

export default async function StaffSearchPage(){
  await requireStaffSession();
  return <main className="nis-checkin-page nis-staff-page"><div className="staff-workspace"><StaffNavigation/><header className="staff-page-heading"><span>NIS GALA CHARITY NIGHT</span><h1>Cerca ticket</h1><p>Trova un partecipante e registra manualmente il suo ingresso.</p></header><StaffTicketSearch/></div></main>;
}
