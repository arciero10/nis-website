import {NextResponse} from "next/server";
import {extractTicketQrToken} from "@/lib/ticketing/presentation";
import {ticketingRepository} from "@/lib/ticketing/repository";
import {hasValidStaffSession} from "@/lib/ticketing/staff-auth";

export const runtime="nodejs";
export async function POST(request:Request){if(!await hasValidStaffSession(request))return NextResponse.json({message:"Sessione staff non valida."},{status:401});try{const payload=await request.json() as {qrToken?:unknown};const raw=typeof payload.qrToken==="string"?payload.qrToken:"";const qrToken=extractTicketQrToken(raw);if(!qrToken||qrToken.length<20||qrToken.length>160||!/^[A-Za-z0-9_-]+$/.test(qrToken))return NextResponse.json({status:"INVALID"});return NextResponse.json(await ticketingRepository.checkInByQrToken(qrToken));}catch(error){console.error("Ticket check-in failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Verifica ticket non disponibile."},{status:500});}}
