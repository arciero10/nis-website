import {NextResponse} from "next/server";
import {validReverseReason} from "@/lib/ticketing/checkin-rules";
import {ticketingRepository} from "@/lib/ticketing/repository";
import {getStaffSession} from "@/lib/ticketing/staff-auth";

export const runtime="nodejs";

export async function POST(request:Request){
  const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  if(session.role!=="SUPERADMIN")return NextResponse.json({message:"Operazione riservata al Superadmin."},{status:403});
  try{
    const payload=await request.json() as {checkInId?:unknown;reason?:unknown};const checkInId=typeof payload.checkInId==="string"?payload.checkInId:"";
    if(!/^[0-9a-f-]{36}$/i.test(checkInId)||!validReverseReason(payload.reason))return NextResponse.json({message:"Indica un motivo valido per l'annullamento."},{status:400});
    const result=await ticketingRepository.reverseCheckIn(checkInId,String(payload.reason),session);
    if(result==="FORBIDDEN")return NextResponse.json({message:"Operazione riservata al Superadmin."},{status:403});
    if(result==="NOT_FOUND")return NextResponse.json({message:"Check-in non trovato."},{status:404});
    if(result==="ALREADY_REVERSED")return NextResponse.json({message:"Check-in già annullato."},{status:409});
    return NextResponse.json({message:"Check-in annullato. Il ticket è nuovamente valido."});
  }catch(error){console.error("Check-in reversal failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Annullamento check-in non disponibile."},{status:500});}
}
