import {NextResponse} from "next/server";
import {canIssueCash,parseCashInput,validIdempotencyKey} from "@/lib/ticketing/manual-input";
import {createManualIssuance,findManualIssuanceByIdempotencyKey} from "@/lib/ticketing/manual-repository";
import {getStaffSession} from "@/lib/ticketing/staff-auth";
import {deliverTicketEmail} from "@/lib/ticketing/ticket-email";

export const runtime="nodejs";

export async function POST(request:Request){
  const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  const idempotencyKey=request.headers.get("Idempotency-Key")?.trim()??"";if(!validIdempotencyKey(idempotencyKey))return NextResponse.json({message:"Chiave di invio non valida."},{status:400});
  try{
    const existing=await findManualIssuanceByIdempotencyKey(idempotencyKey);if(existing){await Promise.all(existing.emailPayloads.map(payload=>deliverTicketEmail(payload)));return NextResponse.json({issuanceId:existing.issuanceId,source:existing.source,created:false,tickets:existing.tickets.map(({ticketCode})=>({ticketCode}))});}
    const input=parseCashInput(await request.formData());if(!input)return NextResponse.json({message:"Controlla i dati nominativi, l’importo, il referente e lo stato dell’incasso."},{status:400});
    if(!canIssueCash(input,session.role))return NextResponse.json({message:"L’emissione con incasso ancora pendente richiede l’autorizzazione esplicita del Superadmin."},{status:403});
    const result=await createManualIssuance("nis-gala-2026",idempotencyKey,input,session);await Promise.all(result.emailPayloads.map(payload=>deliverTicketEmail(payload)));
    return NextResponse.json({issuanceId:result.issuanceId,source:result.source,created:result.created,tickets:result.tickets.map(({ticketCode})=>({ticketCode}))},{status:result.created?201:200});
  }catch(error){const message=error instanceof Error?error.message:"Emissione non riuscita.";console.error("Manual cash ticket issuance failed",message);const conflict=/biglietto attivo|Posti insufficienti/.test(message);return NextResponse.json({message:conflict?message:"Non è stato possibile emettere il biglietto. Riprova senza ripetere l’invio."},{status:conflict?409:500});}
}
