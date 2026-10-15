import {NextResponse} from "next/server";
import {parseCharityParticipationInput} from "@/lib/ticketing/charity-request-input";
import {notifyCharityRequestAdmin} from "@/lib/ticketing/charity-admin-email";
import {createCharityParticipationRequest,DuplicateCharityRequestError} from "@/lib/ticketing/charity-request-repository";
import {deliverCharityRequesterEmail} from "@/lib/ticketing/charity-requester-email";

export const runtime="nodejs";
const PAYPAL_CHARITY_URL="https://www.paypal.com/fundraiser/charity/6169624";

export async function POST(request:Request){
  try{
    const input=parseCharityParticipationInput(await request.json());if(!input)return NextResponse.json({message:"Controlla i campi obbligatori e il consenso privacy."},{status:400});
    const result=await createCharityParticipationRequest("nis-gala-2026","gala-2026",input);
    const [requesterEmail]=await Promise.all([
      result.created?deliverCharityRequesterEmail(result.request):Promise.resolve({status:"SKIPPED" as const}),
      result.created?notifyCharityRequestAdmin(result.request):Promise.resolve({status:"SKIPPED" as const}),
    ]);
    return NextResponse.json({requestId:result.request.id,requestCode:result.request.requestCode,status:result.request.status,quantity:result.request.quantity,expectedAmount:result.request.expectedAmount,currency:result.request.currency,requesterEmailStatus:requesterEmail.status,redirectUrl:PAYPAL_CHARITY_URL},{status:result.created?201:200});
  }catch(error){
    if(error instanceof DuplicateCharityRequestError)return NextResponse.json({message:error.message},{status:409});
    const message=error instanceof Error?error.message:"Richiesta non valida.";const conflict=/Posti insufficienti|Evento non disponibile|Invito non disponibile/.test(message);return NextResponse.json({message:conflict?message:"Non è stato possibile registrare la richiesta. Riprova tra qualche minuto."},{status:conflict?409:500});
  }
}
