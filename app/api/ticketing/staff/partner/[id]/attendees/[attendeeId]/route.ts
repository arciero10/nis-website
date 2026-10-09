import {NextResponse} from "next/server";
import {parsePartnerNomineeInput} from "@/lib/ticketing/partner-input";
import {ticketingRepository} from "@/lib/ticketing/repository";
import {hasValidStaffSession} from "@/lib/ticketing/staff-auth";

export const runtime="nodejs";

export async function PUT(request:Request,{params}:{params:Promise<{id:string;attendeeId:string}>}){
  if(!await hasValidStaffSession(request))return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  const {id,attendeeId}=await params;if(!/^[0-9a-f-]{36}$/i.test(id)||!/^[0-9a-f-]{36}$/i.test(attendeeId))return NextResponse.json({message:"Nominativo non valido."},{status:400});
  try{const payload=await request.json() as Record<string,unknown>;const input=parsePartnerNomineeInput(payload);if(!input)return NextResponse.json({message:"Controlla nome, cognome ed email."},{status:400});const nominee=await ticketingRepository.updatePartnerNominee(id,attendeeId,input);return nominee?NextResponse.json({nominee,message:"Nominativo aggiornato."}):NextResponse.json({message:"Nominativo non trovato."},{status:404});}
  catch(error){console.error("Partner nominee update failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Non è stato possibile aggiornare il nominativo."},{status:500});}
}
