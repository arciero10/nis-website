import {NextResponse} from "next/server";
import {extractTicketQrToken} from "@/lib/ticketing/presentation";
import {ticketingRepository} from "@/lib/ticketing/repository";
import {getStaffSession} from "@/lib/ticketing/staff-auth";

export const runtime="nodejs";
const tokenFrom=async(request:Request)=>{const payload=await request.json() as {qrToken?:unknown};const raw=typeof payload.qrToken==="string"?payload.qrToken:"";const qrToken=extractTicketQrToken(raw);return qrToken&&qrToken.length>=20&&qrToken.length<=160&&/^[A-Za-z0-9_-]+$/.test(qrToken)?qrToken:"";};

export async function POST(request:Request){const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});try{const qrToken=await tokenFrom(request);if(!qrToken)return NextResponse.json({status:"INVALID"});return NextResponse.json(await ticketingRepository.inspectByQrToken(qrToken));}catch(error){console.error("Ticket check-in lookup failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Verifica ticket non disponibile."},{status:500});}}

export async function PATCH(request:Request){const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});try{const qrToken=await tokenFrom(request);if(!qrToken)return NextResponse.json({status:"INVALID"});return NextResponse.json(await ticketingRepository.checkInByQrToken(qrToken,session));}catch(error){console.error("Ticket check-in confirmation failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Registrazione ingresso non disponibile."},{status:500});}}
