import StaffNavigation from "@/components/StaffNavigation";
import StaffPartnerDashboard from "@/components/StaffPartnerDashboard";
import {requireSuperadminSession} from "@/lib/ticketing/staff-page";

export const dynamic="force-dynamic";

export default async function StaffPartnerPage(){const session=await requireSuperadminSession();return <main className="nis-checkin-page nis-staff-page"><div className="staff-workspace"><StaffNavigation role={session.role}/><header className="staff-page-heading"><span>NIS GALA CHARITY NIGHT</span><h1>Inviti aziendali</h1><p>Assegnazioni Sponsor, Donatore, Azienda e Ospite con ticket non nominativi.</p></header><StaffPartnerDashboard/></div></main>;}
