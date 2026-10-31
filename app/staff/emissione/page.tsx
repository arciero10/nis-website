import StaffManualIssuance from "@/components/StaffManualIssuance";
import StaffCharityRequests from "@/components/StaffCharityRequests";
import StaffNavigation from "@/components/StaffNavigation";
import {requireSuperadminSession} from "@/lib/ticketing/staff-page";
import {getStaffEventContext} from "@/lib/ticketing/staff-event-context";

export const dynamic="force-dynamic";

export default async function StaffManualIssuancePage(){const session=await requireSuperadminSession();const event=await getStaffEventContext(session);return <main className="nis-checkin-page nis-staff-page"><div className="staff-workspace"><StaffNavigation role={session.role} selectedEventTitle={event.title}/><header className="staff-page-heading"><span>{event.title}</span><h1>Emissione biglietti</h1><p>Emissioni manuali tracciate per PayPal Charity, contanti, bonifici e inviti autorizzati.</p></header><StaffCharityRequests/><StaffManualIssuance role={session.role}/></div></main>;}
