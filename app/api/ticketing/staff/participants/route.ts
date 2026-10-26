import {NextResponse} from "next/server";
import {getStaffSession} from "@/lib/ticketing/staff-auth";
import {ticketingRepository} from "@/lib/ticketing/repository";
import {INVITATION_TYPES,type StaffInvitationTypeFilter,type TicketIssuanceSource} from "@/types/ticketing";

export const runtime="nodejs";

export async function GET(request:Request){
  const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  const params=new URL(request.url).searchParams;const search=params.get("q")?.trim()??"";const rawFilter=params.get("filter")?.toUpperCase()??"ALL";const rawSource=params.get("source")?.toUpperCase()??"ALL";
  if(search.length>100)return NextResponse.json({message:"Ricerca non valida."},{status:400});
  if(!["ALL","PENDING","ENTERED","CANCELLED"].includes(rawFilter))return NextResponse.json({message:"Filtro non valido."},{status:400});
  const rawType=params.get("type")?.toUpperCase()??"ALL";
  if(!["ALL","PAYPAL","PAYPAL_CHARITY","CASH","BANK_TRANSFER","COMPANY","ADMIN"].includes(rawSource))return NextResponse.json({message:"Origine non valida."},{status:400});
  if(!["ALL","OMAGGIO"].includes(rawType)&&!INVITATION_TYPES.includes(rawType as (typeof INVITATION_TYPES)[number]))return NextResponse.json({message:"Tipo invito non valido."},{status:400});
  try{
    const dashboard=await ticketingRepository.getStaffParticipants("nis-gala-2026",search,rawFilter as "ALL"|"PENDING"|"ENTERED"|"CANCELLED",session.role==="SUPERADMIN"?rawSource as "ALL"|TicketIssuanceSource:"ALL",session.role==="SUPERADMIN"?rawType as StaffInvitationTypeFilter:"ALL");
    if(session.role==="SUPERADMIN")return NextResponse.json(dashboard);
    return NextResponse.json({participants:dashboard.participants,entered:dashboard.entered,pending:dashboard.pending,cancelled:dashboard.cancelled,results:dashboard.results.map(person=>({ticketCode:person.ticketCode,firstName:person.firstName,lastName:person.lastName,status:person.status,companyName:person.companyName,source:person.companyName?"COMPANY":"PAYPAL"}))});
  }
  catch(error){console.error("Staff participants dashboard failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Dashboard temporaneamente non disponibile."},{status:500});}
}
