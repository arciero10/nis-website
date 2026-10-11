import {NextResponse} from "next/server";
import {createAppleWalletPass} from "@/lib/ticketing/wallet/apple";
import {isAppleWalletConfigured} from "@/lib/ticketing/wallet/config";
import {ticketingRepository} from "@/lib/ticketing/repository";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(_request:Request,{params}:{params:Promise<{qrToken:string}>}){
  if(!isAppleWalletConfigured())return NextResponse.json({error:"Apple Wallet non disponibile"},{status:503});
  const {qrToken}=await params;const record=await ticketingRepository.findDigitalTicketByQrToken(qrToken);
  if(!record)return NextResponse.json({error:"Biglietto non trovato"},{status:404});
  try{
    const pass=await createAppleWalletPass(record);
    return new NextResponse(new Uint8Array(pass),{headers:{"Content-Type":"application/vnd.apple.pkpass","Content-Disposition":`attachment; filename="nis-gala-${record.ticket.ticketCode}.pkpass"`,"Cache-Control":"private, no-store"}});
  }catch{return NextResponse.json({error:"Apple Wallet temporaneamente non disponibile"},{status:503});}
}
