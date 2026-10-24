import {NextResponse} from "next/server";
import {ticketingRepository} from "@/lib/ticketing/repository";
import {hasValidStaffSession} from "@/lib/ticketing/staff-auth";
import {deliverPartnerAllocationEmail} from "@/lib/ticketing/ticket-email";

export const runtime="nodejs";

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await hasValidStaffSession(request))return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({message:"Assegnazione non valida."},{status:400});
  try{const allocation=await ticketingRepository.getPartnerAllocation(id);if(!allocation?.contactEmail)return NextResponse.json({message:"Assegnazione o email referente non disponibile."},{status:404});const isResend=allocation.emailDeliveryStatus==="SENT";const result=await deliverPartnerAllocationEmail(id,true);if(result.status==="NOT_FOUND")return NextResponse.json({message:"Assegnazione o email referente non disponibile."},{status:404});if(result.status==="SKIPPED")return NextResponse.json({message:"Invio già in corso."},{status:409});if(result.status==="ERROR"||result.status==="FAILED")return NextResponse.json({message:"Invio email non riuscito. Riprova tra poco."},{status:502});const action=isResend?"reinviati":"inviati";return NextResponse.json({message:`Inviti aziendali ${action} tramite i link privati individuali.`});}
  catch{console.error("Partner invitation delivery failed");return NextResponse.json({message:"Invio temporaneamente non disponibile."},{status:500});}
}
