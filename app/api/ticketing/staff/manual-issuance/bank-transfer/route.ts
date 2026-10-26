import {NextResponse} from "next/server";
import {parseBankTransferInput,validIdempotencyKey} from "@/lib/ticketing/manual-input";
import {createManualIssuance,findManualIssuanceByIdempotencyKey} from "@/lib/ticketing/manual-repository";
import {getStaffSession} from "@/lib/ticketing/staff-auth";
import {deliverTicketEmail} from "@/lib/ticketing/ticket-email";

export const runtime="nodejs";

export async function POST(request:Request){
  const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  if(session.role!=="SUPERADMIN")return NextResponse.json({message:"Operazione riservata al Superadmin."},{status:403});
  const idempotencyKey=request.headers.get("Idempotency-Key")?.trim()??"";if(!validIdempotencyKey(idempotencyKey))return NextResponse.json({message:"Chiave di invio non valida."},{status:400});
  try{
    const existing=await findManualIssuanceByIdempotencyKey(idempotencyKey);if(existing){await Promise.all(existing.emailPayloads.map(payload=>deliverTicketEmail(payload)));return NextResponse.json({issuanceId:existing.issuanceId,source:existing.source,created:false,tickets:existing.tickets.map(({ticketCode})=>({ticketCode}))});}
    const data=await request.formData();const input=parseBankTransferInput(data);if(!input)return NextResponse.json({message:"Controlla i campi obbligatori e i valori inseriti."},{status:400});
    const result=await createManualIssuance("nis-gala-2026",idempotencyKey,input,session);
    await Promise.all(result.emailPayloads.map(payload=>deliverTicketEmail(payload)));
    return NextResponse.json({issuanceId:result.issuanceId,source:result.source,created:result.created,tickets:result.tickets.map(({ticketCode})=>({ticketCode}))},{status:result.created?201:200});
  }catch(error){
    console.error("Manual bank transfer ticket issuance failed",error instanceof Error?error.message:"unknown");
    return NextResponse.json({message:"Non è stato possibile emettere i biglietti. Riprova senza ripetere l'invio."},{status:500});
  }
}
