import StaffNavigation from "@/components/StaffNavigation";
import StaffIngressDashboard from "@/components/StaffIngressDashboard";
import {requireStaffSession} from "@/lib/ticketing/staff-page";
import {ticketingRepository} from "@/lib/ticketing/repository";

export const dynamic="force-dynamic";

export default async function StaffIngressPage(){
  const session=await requireStaffSession();
  const dashboard=await ticketingRepository.getStaffIngressDashboard("nis-gala-2026");
  return <main className="nis-checkin-page nis-staff-page"><div className="staff-workspace"><StaffNavigation/><header className="staff-page-heading"><span>NIS GALA CHARITY NIGHT</span><h1>Storico ingressi</h1><p>Audit completo degli accessi, dal più recente.</p></header><StaffIngressDashboard initialDashboard={dashboard} role={session.role}/></div></main>;
}
