import {NextResponse} from "next/server";
import {ticketingRepository} from "@/lib/ticketing/repository";
import {isGoogleWalletConfigured} from "@/lib/ticketing/wallet/config";
import {createGoogleWalletSaveUrl} from "@/lib/ticketing/wallet/google";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(_request:Request,{params}:{params:Promise<{qrToken:string}>}){
  if(!isGoogleWalletConfigured())return NextResponse.json({error:"Google Wallet non disponibile"},{status:503});
  const {qrToken}=await params;const record=await ticketingRepository.findDigitalTicketByQrToken(qrToken);
  if(!record)return NextResponse.json({error:"Biglietto non trovato"},{status:404});
  try{return NextResponse.redirect(createGoogleWalletSaveUrl(record),302);}
  catch{return NextResponse.json({error:"Google Wallet temporaneamente non disponibile"},{status:503});}
}
