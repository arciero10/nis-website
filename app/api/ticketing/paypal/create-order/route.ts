import {NextResponse} from "next/server";
import {createPayPalOrder} from "@/lib/ticketing/paypal/client";
import {TicketingConflictError,ticketingRepository} from "@/lib/ticketing/repository";
import {orderAmountForQuantity,validTicketQuantity} from "@/lib/ticketing/rules";

export const runtime="nodejs";
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean=(v:unknown,n:number)=>typeof v==="string"?v.replace(/[\u0000-\u001f\u007f]+/g," ").replace(/\s+/g," ").trim().slice(0,n):"";

export async function POST(request:Request){
  try{
    const p=await request.json() as Record<string,unknown>;const accessToken=clean(p.accessToken,160);const requestId=clean(p.requestId,50);const quantity=Number(p.quantity);const rawParticipants=Array.isArray(p.participants)?p.participants:[];
    if(!/^[0-9a-f-]{36}$/i.test(requestId)||!accessToken||!validTicketQuantity(quantity)||rawParticipants.length!==quantity||p.privacyAccepted!==true)return NextResponse.json({message:"Controlla quantità, partecipanti e consenso privacy."},{status:400});
    const participants=rawParticipants.map(item=>{const value=(item&&typeof item==="object"?item:{}) as Record<string,unknown>;return {firstName:clean(value.firstName,80),lastName:clean(value.lastName,80),email:clean(value.email,160).toLowerCase(),phone:clean(value.phone,40)||undefined,company:clean(value.company,140)||undefined};});
    if(participants.some(person=>!person.firstName||!person.lastName||!emailPattern.test(person.email)))return NextResponse.json({message:"Controlla i dati obbligatori di ogni partecipante."},{status:400});
    const event=await ticketingRepository.findEventBySlug("nis-gala-2026");if(!event)return NextResponse.json({message:"Evento non trovato."},{status:404});
    const expectedAmount=orderAmountForQuantity(event.price,quantity);const clientTotal=Number(p.total);
    if(expectedAmount===null||!Number.isFinite(clientTotal)||clientTotal.toFixed(2)!==expectedAmount.toFixed(2))return NextResponse.json({message:"Il totale dell'ordine non è valido."},{status:400});
    const checkout=await ticketingRepository.createPendingCheckout("nis-gala-2026",accessToken,requestId,participants);
    if(checkout.order.providerOrderId) return NextResponse.json({orderId:checkout.order.providerOrderId});
    try{const providerOrderId=await createPayPalOrder({internalOrderId:checkout.order.id,amount:checkout.order.amount.toFixed(2),currency:checkout.order.currency,description:checkout.event.title});await ticketingRepository.attachProviderOrder(checkout.order.id,providerOrderId);return NextResponse.json({orderId:providerOrderId});}
    catch(error){await ticketingRepository.markOrderFailed(checkout.order.id);throw error;}
  }catch(error){if(error instanceof TicketingConflictError) return NextResponse.json({message:error.message,code:error.code},{status:409});console.error("Ticketing create-order failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Non è stato possibile inizializzare il pagamento."},{status:500});}
}
