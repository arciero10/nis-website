import {NextResponse} from "next/server";
import {parseCharityParticipationInput} from "@/lib/ticketing/charity-request-input";
import {createCharityParticipationRequest} from "@/lib/ticketing/charity-request-repository";

export const runtime="nodejs";
const PAYPAL_CHARITY_URL="https://www.paypal.com/fundraiser/charity/6169624";

export async function POST(request:Request){
  try{
    const input=parseCharityParticipationInput(await request.json());if(!input)return NextResponse.json({message:"Controlla i campi obbligatori e il consenso privacy."},{status:400});
    const result=await createCharityParticipationRequest("nis-gala-2026","gala-2026",input);
    return NextResponse.json({requestId:result.request.id,status:result.request.status,redirectUrl:PAYPAL_CHARITY_URL},{status:result.created?201:200});
  }catch(error){const message=error instanceof Error?error.message:"Richiesta non valida.";const conflict=/Posti insufficienti|Evento non disponibile|Invito non disponibile/.test(message);return NextResponse.json({message:conflict?message:"Non è stato possibile registrare la richiesta. Riprova tra qualche minuto."},{status:conflict?409:500});}
}
