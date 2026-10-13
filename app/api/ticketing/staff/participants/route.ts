import {NextResponse} from "next/server";
import {hasValidStaffSession} from "@/lib/ticketing/staff-auth";
import {ticketingRepository} from "@/lib/ticketing/repository";
import {INVITATION_TYPES,type StaffInvitationTypeFilter,type TicketIssuanceSource} from "@/types/ticketing";

export const runtime="nodejs";

export async function GET(request:Request){
  if(!await hasValidStaffSession(request))return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  const params=new URL(request.url).searchParams;const search=params.get("q")?.trim()??"";const rawFilter=params.get("filter")?.toUpperCase()??"ALL";const rawSource=params.get("source")?.toUpperCase()??"ALL";
  if(search.length>100)return NextResponse.json({message:"Ricerca non valida."},{status:400});
  if(!["ALL","PENDING","ENTERED","CANCELLED"].includes(rawFilter))return NextResponse.json({message:"Filtro non valido."},{status:400});
  const rawType=params.get("type")?.toUpperCase()??"ALL";
  if(!["ALL","PAYPAL","PAYPAL_CHARITY","BANK_TRANSFER","COMPANY","ADMIN"].includes(rawSource))return NextResponse.json({message:"Origine non valida."},{status:400});
  if(!["ALL","OMAGGIO"].includes(rawType)&&!INVITATION_TYPES.includes(rawType as (typeof INVITATION_TYPES)[number]))return NextResponse.json({message:"Tipo invito non valido."},{status:400});
  try{return NextResponse.json(await ticketingRepository.getStaffParticipants("nis-gala-2026",search,rawFilter as "ALL"|"PENDING"|"ENTERED"|"CANCELLED",rawSource as "ALL"|TicketIssuanceSource,rawType as StaffInvitationTypeFilter));}
  catch(error){console.error("Staff participants dashboard failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Dashboard temporaneamente non disponibile."},{status:500});}
}
