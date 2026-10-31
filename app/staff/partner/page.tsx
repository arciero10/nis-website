import StaffNavigation from "@/components/StaffNavigation";
import StaffPartnerDashboard from "@/components/StaffPartnerDashboard";
import {requireSuperadminSession} from "@/lib/ticketing/staff-page";
import {getStaffEventContext} from "@/lib/ticketing/staff-event-context";

export const dynamic="force-dynamic";

export default async function StaffPartnerPage(){const session=await requireSuperadminSession();const event=await getStaffEventContext(session);return <main className="nis-checkin-page nis-staff-page"><div className="staff-workspace"><StaffNavigation role={session.role} selectedEventTitle={event.title}/><header className="staff-page-heading"><span>{event.title}</span><h1>Inviti aziendali</h1><p>Assegnazioni Sponsor, Donatore, Azienda e Ospite con ticket non nominativi.</p></header><StaffPartnerDashboard/></div></main>;}
