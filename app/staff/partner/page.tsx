import StaffNavigation from "@/components/StaffNavigation";
import StaffPartnerDashboard from "@/components/StaffPartnerDashboard";
import {requireStaffSession} from "@/lib/ticketing/staff-page";

export const dynamic="force-dynamic";

export default async function StaffPartnerPage(){await requireStaffSession();return <main className="nis-checkin-page nis-staff-page"><div className="staff-workspace"><StaffNavigation/><header className="staff-page-heading"><span>NIS GALA CHARITY NIGHT</span><h1>Partner</h1><p>Assegnazioni aziendali, posti riservati e inviti nominativi.</p></header><StaffPartnerDashboard/></div></main>;}
