import StaffNavigation from "@/components/StaffNavigation";
import StaffNissettoneOrders from "@/components/StaffNissettoneOrders";
import {requireSuperadminSession} from "@/lib/ticketing/staff-page";
export const dynamic="force-dynamic";
export default async function Page(){const session=await requireSuperadminSession();return <main className="nis-checkin-page nis-staff-page"><div className="staff-workspace"><StaffNavigation role={session.role}/><div className="staff-main-content"><header className="staff-page-heading"><span>ECOMMERCE SOLIDALE</span><h1>Ordini NISSETTONE</h1><p>Ordini, pagamenti verificati, consegne, ritiri e disponibilità del NISSETTONE 2026.</p></header><StaffNissettoneOrders/></div></div></main>}
