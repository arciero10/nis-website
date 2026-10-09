import {NextResponse} from "next/server";
import {parsePartnerAllocationInput} from "@/lib/ticketing/partner-input";
import {TicketingConflictError,ticketingRepository} from "@/lib/ticketing/repository";
import {hasValidStaffSession} from "@/lib/ticketing/staff-auth";

export const runtime="nodejs";

export async function GET(request:Request){
  if(!await hasValidStaffSession(request))return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  try{return NextResponse.json({allocations:await ticketingRepository.listPartnerAllocations("nis-gala-2026")});}
  catch(error){console.error("Partner allocations list failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Elenco partner temporaneamente non disponibile."},{status:500});}
}

export async function POST(request:Request){
  if(!await hasValidStaffSession(request))return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  try{const payload=await request.json() as Record<string,unknown>;const input=parsePartnerAllocationInput(payload);if(!input)return NextResponse.json({message:"Controlla i dati dell'assegnazione partner."},{status:400});const allocation=await ticketingRepository.createPartnerAllocation("nis-gala-2026",input);return NextResponse.json({allocation},{status:201});}
  catch(error){if(error instanceof TicketingConflictError)return NextResponse.json({message:error.message,code:error.code},{status:409});console.error("Partner allocation creation failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Non è stato possibile creare l'assegnazione."},{status:500});}
}
