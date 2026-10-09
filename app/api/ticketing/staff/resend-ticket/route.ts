import {NextResponse} from "next/server";
import {hasValidStaffSession} from "@/lib/ticketing/staff-auth";
import {resendTicketEmail} from "@/lib/ticketing/ticket-email";

export const runtime="nodejs";

export async function POST(request:Request){
  if(!await hasValidStaffSession(request))return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  try{const body=await request.json() as {ticketCode?:unknown};const ticketCode=typeof body.ticketCode==="string"?body.ticketCode.trim():"";if(!ticketCode||ticketCode.length>64||!/^[A-Za-z0-9-]+$/.test(ticketCode))return NextResponse.json({message:"Codice ticket non valido."},{status:400});const result=await resendTicketEmail(ticketCode);if(result.status==="NOT_FOUND")return NextResponse.json({message:"Biglietto non trovato."},{status:404});if(result.status==="SKIPPED")return NextResponse.json({message:"Invio già in corso."},{status:409});if(result.status==="FAILED")return NextResponse.json({message:"Invio email non riuscito. Riprova tra poco."},{status:502});return NextResponse.json({message:"Biglietto inviato nuovamente."});}
  catch(error){console.error("Staff ticket resend failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Reinvio temporaneamente non disponibile."},{status:500});}
}
