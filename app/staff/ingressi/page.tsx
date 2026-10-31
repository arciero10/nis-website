import StaffNavigation from "@/components/StaffNavigation";
import StaffIngressDashboard from "@/components/StaffIngressDashboard";
import {requireStaffSession} from "@/lib/ticketing/staff-page";
import {ticketingRepository} from "@/lib/ticketing/repository";
import {getStaffEventContext} from "@/lib/ticketing/staff-event-context";

export const dynamic="force-dynamic";

export default async function StaffIngressPage(){
  const session=await requireStaffSession();
  const event=await getStaffEventContext(session);const dashboard=await ticketingRepository.getStaffIngressDashboard(event.slug);
  return <main className="nis-checkin-page nis-staff-page"><div className="staff-workspace"><StaffNavigation role={session.role}/><header className="staff-page-heading"><span>{event.title}</span><h1>Storico ingressi</h1><p>{session.role==="SUPERADMIN"?"Audit completo degli accessi, dal più recente.":"Ingressi registrati, dal più recente."}</p></header><StaffIngressDashboard initialDashboard={dashboard} role={session.role}/></div></main>;
}
