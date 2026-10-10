import {NextResponse} from "next/server";
import {ticketingRepository} from "@/lib/ticketing/repository";
import {hasValidStaffSession} from "@/lib/ticketing/staff-auth";

export const runtime="nodejs";

export async function GET(request:Request,{params}:{params:Promise<{id:string;ticketCode:string}>}){
  if(!await hasValidStaffSession(request))return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  const {id,ticketCode}=await params;if(!/^[0-9a-f-]{36}$/i.test(id)||!/^[A-Za-z0-9-]{6,64}$/.test(ticketCode))return NextResponse.json({message:"Ticket non valido."},{status:400});
  const qrToken=await ticketingRepository.findPartnerTicketQrToken(id,ticketCode);return qrToken?NextResponse.redirect(new URL(`/biglietto/${encodeURIComponent(qrToken)}`,request.url)):NextResponse.json({message:"Ticket non trovato."},{status:404});
}
