import Link from "next/link";
import {notFound} from "next/navigation";
import StaffNavigation from "@/components/StaffNavigation";
import StaffPartnerDetail from "@/components/StaffPartnerDetail";
import {ticketingRepository} from "@/lib/ticketing/repository";
import {requireStaffSession} from "@/lib/ticketing/staff-page";

export const dynamic="force-dynamic";

export default async function StaffPartnerDetailPage({params}:{params:Promise<{id:string}>}){await requireStaffSession();const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))notFound();const allocation=await ticketingRepository.getPartnerAllocation(id);if(!allocation)notFound();return <main className="nis-checkin-page nis-staff-page"><div className="staff-workspace"><StaffNavigation/><header className="staff-page-heading"><Link className="staff-back-link" href="/staff/partner">← Partner</Link><span>NIS GALA CHARITY NIGHT</span><h1>{allocation.companyName}</h1><p>Gestione dei nominativi inclusi nell'assegnazione partner.</p></header><StaffPartnerDetail initialAllocation={allocation}/></div></main>;}
