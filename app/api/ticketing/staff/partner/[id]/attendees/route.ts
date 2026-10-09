import {NextResponse} from "next/server";
import {parsePartnerNomineeInput} from "@/lib/ticketing/partner-input";
import {TicketingConflictError,ticketingRepository} from "@/lib/ticketing/repository";
import {hasValidStaffSession} from "@/lib/ticketing/staff-auth";
import {deliverTicketEmail} from "@/lib/ticketing/ticket-email";

export const runtime="nodejs";

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await hasValidStaffSession(request))return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({message:"Assegnazione non valida."},{status:400});
  try{const payload=await request.json() as Record<string,unknown>;const input=parsePartnerNomineeInput(payload);if(!input)return NextResponse.json({message:"Controlla nome, cognome ed email."},{status:400});const emailPayload=await ticketingRepository.addPartnerNominee(id,input);const delivery=await deliverTicketEmail(emailPayload);return NextResponse.json({ticketCode:emailPayload.ticketCode,emailStatus:delivery.status,message:delivery.status==="SENT"?"Nominativo aggiunto e invito inviato.":"Nominativo e ticket creati. L'email potrà essere reinviata dallo staff."},{status:201});}
  catch(error){if(error instanceof TicketingConflictError)return NextResponse.json({message:error.message,code:error.code},{status:409});console.error("Partner nominee creation failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Non è stato possibile aggiungere il nominativo."},{status:500});}
}
