import StaffManualIssuance from "@/components/StaffManualIssuance";
import StaffCharityRequests from "@/components/StaffCharityRequests";
import StaffNavigation from "@/components/StaffNavigation";
import {requireStaffSession} from "@/lib/ticketing/staff-page";

export const dynamic="force-dynamic";

export default async function StaffManualIssuancePage(){const session=await requireStaffSession();return <main className="nis-checkin-page nis-staff-page"><div className="staff-workspace"><StaffNavigation/><header className="staff-page-heading"><span>NIS GALA CHARITY NIGHT</span><h1>Emissione biglietti</h1><p>Emissioni manuali tracciate per donazioni PayPal Charity, bonifici verificati e inviti autorizzati.</p></header>{session.role==="SUPERADMIN"&&<StaffCharityRequests/>}<StaffManualIssuance role={session.role}/></div></main>;}
