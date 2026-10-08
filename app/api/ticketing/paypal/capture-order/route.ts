import {NextResponse} from "next/server";
import {capturePayPalOrder,completedCapture,getPayPalOrder} from "@/lib/ticketing/paypal/client";
import {TicketingConflictError,ticketingRepository} from "@/lib/ticketing/repository";

export const runtime="nodejs";
export async function POST(request:Request){
  try{
    const body=await request.json() as {orderId?:unknown};const orderId=typeof body.orderId==="string"?body.orderId.trim():"";if(!orderId) return NextResponse.json({message:"Ordine non valido."},{status:400});
    const internal=await ticketingRepository.findOrderByProviderOrderId(orderId);if(!internal) return NextResponse.json({message:"Ordine non trovato."},{status:404});
    const existing=await ticketingRepository.findTicketByOrderId(internal.id);if(existing) return NextResponse.json({redirectPath:`/biglietto/${existing.qrToken}`});
    let providerResult:Record<string,unknown>;
    try{providerResult=await capturePayPalOrder(orderId);}catch{providerResult=await getPayPalOrder(orderId);}
    const capture=completedCapture(providerResult,internal.amount.toFixed(2),internal.currency);
    const confirmation=await ticketingRepository.finalizePaidOrder(orderId,capture.captureId,capture.amount,capture.currency);
    return NextResponse.json({redirectPath:`/biglietto/${confirmation.ticket.qrToken}`});
  }catch(error){if(error instanceof TicketingConflictError) return NextResponse.json({message:error.message,code:error.code},{status:409});console.error("Ticketing capture-order failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Pagamento non confermato. Non ripetere l'addebito: aggiorna la pagina e riprova."},{status:500});}
}
