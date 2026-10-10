import {NextResponse} from "next/server";
import {getStaffSession} from "@/lib/ticketing/staff-auth";
import {ticketingRepository} from "@/lib/ticketing/repository";

export const runtime="nodejs";

const inputFrom=async(request:Request)=>{const payload=await request.json() as {ticketCode?:unknown;bypassWindow?:unknown};const ticketCode=typeof payload.ticketCode==="string"?payload.ticketCode.trim():"";return {ticketCode,bypassWindow:payload.bypassWindow===true};};

export async function POST(request:Request){
  const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  try{
    const {ticketCode}=await inputFrom(request);
    if(!ticketCode||ticketCode.length>64||!/^[A-Za-z0-9-]+$/.test(ticketCode))return NextResponse.json({status:"INVALID"});
    return NextResponse.json(await ticketingRepository.inspectByTicketCode(ticketCode,session));
  }catch(error){console.error("Manual ticket lookup failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Verifica ingresso non disponibile."},{status:500});}
}

export async function PATCH(request:Request){
  const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  try{const {ticketCode,bypassWindow}=await inputFrom(request);if(!ticketCode||ticketCode.length>64||!/^[A-Za-z0-9-]+$/.test(ticketCode))return NextResponse.json({status:"INVALID"});return NextResponse.json(await ticketingRepository.checkInByTicketCode(ticketCode,session,bypassWindow));}
  catch(error){console.error("Manual ticket check-in failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Registrazione ingresso non disponibile."},{status:500});}
}
