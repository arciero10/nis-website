import {NextResponse} from "next/server";
import {ticketingRepository} from "@/lib/ticketing/repository";
import {hasValidStaffSession} from "@/lib/ticketing/staff-auth";

export const runtime="nodejs";

export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await hasValidStaffSession(request))return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({message:"Assegnazione non valida."},{status:400});
  try{const allocation=await ticketingRepository.getPartnerAllocation(id);return allocation?NextResponse.json({allocation}):NextResponse.json({message:"Assegnazione non trovata."},{status:404});}
  catch(error){console.error("Partner allocation detail failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Dettaglio partner temporaneamente non disponibile."},{status:500});}
}

export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await hasValidStaffSession(request))return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({message:"Assegnazione non valida."},{status:400});
  try{return await ticketingRepository.cancelPartnerAllocation(id)?NextResponse.json({message:"Assegnazione annullata. Gli slot non nominati sono stati liberati."}):NextResponse.json({message:"Assegnazione non trovata."},{status:404});}
  catch(error){console.error("Partner allocation cancellation failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Annullamento temporaneamente non disponibile."},{status:500});}
}
