import CheckInScanner from "@/components/CheckInScanner";
import {requireStaffSession} from "@/lib/ticketing/staff-page";

export const dynamic="force-dynamic";

export default async function CheckInPage(){await requireStaffSession();return <div className="nis-checkin-page"><CheckInScanner/></div>;}
