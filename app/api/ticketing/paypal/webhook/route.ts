import {NextResponse} from "next/server";
import {completedCapture,getPayPalOrder,verifyPayPalWebhook} from "@/lib/ticketing/paypal/client";
import {statusAfterCaptureEvent} from "@/lib/ticketing/rules";
import {ticketingRepository} from "@/lib/ticketing/repository";
import {deliverConfirmationTicketEmails} from "@/lib/ticketing/ticket-email";

export const runtime="nodejs";
export async function POST(request:Request){
  try{
    const raw=await request.text();if(raw.length>1_000_000) return NextResponse.json({message:"Payload troppo grande."},{status:413});const event=JSON.parse(raw) as Record<string,unknown>;
    if(!await verifyPayPalWebhook(request.headers,event)) return NextResponse.json({message:"Firma webhook non valida."},{status:401});
    const type=String(event.event_type??"");const resource=(event.resource??{}) as Record<string,unknown>;const supplementary=(resource.supplementary_data??{}) as Record<string,unknown>;const related=(supplementary.related_ids??{}) as Record<string,unknown>;const orderId=String(related.order_id??"");
    if(type==="PAYMENT.CAPTURE.COMPLETED"&&orderId){const internal=await ticketingRepository.findOrderByProviderOrderId(orderId);if(internal){const details=await getPayPalOrder(orderId);const capture=completedCapture(details,internal.amount.toFixed(2),internal.currency);const confirmation=await ticketingRepository.finalizePaidOrder(orderId,capture.captureId,capture.amount,capture.currency);await deliverConfirmationTicketEmails(confirmation);}}
    const disposition=statusAfterCaptureEvent(type);if(disposition&&orderId) await ticketingRepository.applyPaymentDisposition(orderId,disposition.paymentStatus,disposition.ticketStatus);
    return NextResponse.json({received:true});
  }catch(error){console.error("Ticketing webhook failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Webhook non elaborato."},{status:500});}
}
