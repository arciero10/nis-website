import {NextResponse} from "next/server";
import {allowNissettoneCheckout} from "@/lib/nissettone/rate-limit";
import {checkoutConfigured} from "@/lib/nissettone/rules";
import {parseNissettoneOrderInput} from "@/lib/nissettone/validation";
import {attachNissettoneProviderOrder,createNissettoneReservation,failNissettoneOrder,NissettoneConflictError} from "@/lib/nissettone/repository";
import {deliverNissettoneEmail} from "@/lib/nissettone/email";
import {createPayPalOrder,payPalEnvironment} from "@/lib/ticketing/paypal/client";

export const runtime="nodejs";
export async function POST(request:Request){
  try{
    if(!checkoutConfigured())return NextResponse.json({message:"I preordini online non sono ancora attivi."},{status:503});
    const ip=request.headers.get("x-forwarded-for")?.split(",")[0].trim()||"unknown";if(!allowNissettoneCheckout(ip))return NextResponse.json({message:"Troppi tentativi. Riprova tra qualche minuto."},{status:429});
    const input=parseNissettoneOrderInput(await request.json().catch(()=>null));if(!input)return NextResponse.json({message:"Controlla i dati, la modalità di ricezione e i consensi."},{status:400});
    const order=await createNissettoneReservation(input,payPalEnvironment());if(order.providerOrderId)return NextResponse.json({orderId:order.providerOrderId});
    try{const providerOrderId=await createPayPalOrder({internalOrderId:order.id,amount:(order.totalCents/100).toFixed(2),unitAmount:(order.unitPriceCents/100).toFixed(2),quantity:order.quantity,currency:order.currency,description:"NISSETTONE 2026"});await attachNissettoneProviderOrder(order.id,providerOrderId);await deliverNissettoneEmail({...order,providerOrderId},"PREORDER");return NextResponse.json({orderId:providerOrderId});}catch(error){await failNissettoneOrder(order.id);throw error;}
  }catch(error){if(error instanceof NissettoneConflictError)return NextResponse.json({message:error.message,code:error.code},{status:409});console.error("Nissettone create order failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Non è stato possibile inizializzare il pagamento."},{status:500});}
}
