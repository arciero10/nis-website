import {NextResponse} from "next/server";
import {createPayPalOrder} from "@/lib/ticketing/paypal/client";
import {TicketingConflictError,ticketingRepository} from "@/lib/ticketing/repository";

export const runtime="nodejs";
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean=(v:unknown,n:number)=>typeof v==="string"?v.replace(/[\u0000-\u001f\u007f]+/g," ").replace(/\s+/g," ").trim().slice(0,n):"";

export async function POST(request:Request){
  try{
    const p=await request.json() as Record<string,unknown>;const accessToken=clean(p.accessToken,160);const requestId=clean(p.requestId,50);const firstName=clean(p.firstName,80);const lastName=clean(p.lastName,80);const email=clean(p.email,160).toLowerCase();
    if(!/^[0-9a-f-]{36}$/i.test(requestId)||!accessToken||!firstName||!lastName||!emailPattern.test(email)||p.privacyAccepted!==true) return NextResponse.json({message:"Controlla i dati obbligatori."},{status:400});
    const checkout=await ticketingRepository.createPendingCheckout("nis-gala-2026",accessToken,requestId,{firstName,lastName,email,phone:clean(p.phone,40)||undefined,company:clean(p.company,140)||undefined});
    if(checkout.order.providerOrderId) return NextResponse.json({orderId:checkout.order.providerOrderId});
    try{const providerOrderId=await createPayPalOrder({internalOrderId:checkout.order.id,amount:checkout.order.amount.toFixed(2),currency:checkout.order.currency,description:checkout.event.title});await ticketingRepository.attachProviderOrder(checkout.order.id,providerOrderId);return NextResponse.json({orderId:providerOrderId});}
    catch(error){await ticketingRepository.markOrderFailed(checkout.order.id);throw error;}
  }catch(error){if(error instanceof TicketingConflictError) return NextResponse.json({message:error.message,code:error.code},{status:409});console.error("Ticketing create-order failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Non è stato possibile inizializzare il pagamento."},{status:500});}
}
