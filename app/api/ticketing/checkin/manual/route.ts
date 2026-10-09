import {NextResponse} from "next/server";
import {hasValidStaffSession} from "@/lib/ticketing/staff-auth";
import {ticketingRepository} from "@/lib/ticketing/repository";

export const runtime="nodejs";

export async function POST(request:Request){
  if(!await hasValidStaffSession(request))return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  try{
    const payload=await request.json() as {ticketCode?:unknown};
    const ticketCode=typeof payload.ticketCode==="string"?payload.ticketCode.trim():"";
    if(!ticketCode||ticketCode.length>64||!/^[A-Za-z0-9-]+$/.test(ticketCode))return NextResponse.json({status:"INVALID"});
    return NextResponse.json(await ticketingRepository.checkInByTicketCode(ticketCode));
  }catch(error){console.error("Manual ticket check-in failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Registrazione ingresso non disponibile."},{status:500});}
}
