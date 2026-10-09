import {validateCompletedPayment} from "@/lib/ticketing/rules";

const bases={sandbox:"https://api-m.sandbox.paypal.com",live:"https://api-m.paypal.com"} as const;
let cachedToken:{value:string;expiresAt:number}|null=null;

export function payPalEnvironment():"SANDBOX"{
  const environment=process.env.PAYPAL_ENV?.trim()||"sandbox";
  if(environment!=="sandbox") throw new Error("NIS Ticketing consente solo PAYPAL_ENV=sandbox in questo blocco.");
  return "SANDBOX";
}

function config(){
  payPalEnvironment();
  const clientId=process.env.PAYPAL_CLIENT_ID?.trim();const secret=process.env.PAYPAL_CLIENT_SECRET?.trim();
  if(!clientId||!secret) throw new Error("Credenziali PayPal Sandbox non configurate.");
  return {base:bases.sandbox,clientId,secret};
}

async function accessToken(){
  if(cachedToken&&cachedToken.expiresAt>Date.now()+30_000) return cachedToken.value;
  const {base,clientId,secret}=config();
  const response=await fetch(`${base}/v1/oauth2/token`,{method:"POST",headers:{Authorization:`Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=client_credentials",cache:"no-store"});
  if(!response.ok) throw new Error(`Autenticazione PayPal non riuscita (${response.status}).`);
  const body=await response.json() as {access_token:string;expires_in:number};cachedToken={value:body.access_token,expiresAt:Date.now()+body.expires_in*1000};return body.access_token;
}

async function paypalFetch(path:string,init:RequestInit={}){
  const token=await accessToken();const {base}=config();
  return fetch(`${base}${path}`,{...init,headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json",...(init.headers??{})},cache:"no-store"});
}

async function paypalJson(path:string,init:RequestInit={}){
  const response=await paypalFetch(path,init);const body=await response.json().catch(()=>({})) as Record<string,unknown>;
  if(!response.ok) throw new Error(`PayPal API ${response.status}: ${String(body.name??"errore remoto")}`);
  return body;
}

export async function createPayPalOrder(input:{internalOrderId:string;amount:string;currency:string;description:string}){
  const body=await paypalJson("/v2/checkout/orders",{method:"POST",headers:{"PayPal-Request-Id":input.internalOrderId},body:JSON.stringify({intent:"CAPTURE",purchase_units:[{reference_id:input.internalOrderId,custom_id:input.internalOrderId,description:input.description,amount:{currency_code:input.currency,value:input.amount}}]})});
  if(typeof body.id!=="string") throw new Error("PayPal non ha restituito l'identificativo ordine.");return body.id;
}

export async function capturePayPalOrder(providerOrderId:string){return paypalJson(`/v2/checkout/orders/${encodeURIComponent(providerOrderId)}/capture`,{method:"POST",headers:{"PayPal-Request-Id":`capture-${providerOrderId}`}});}
export async function getPayPalOrder(providerOrderId:string){return paypalJson(`/v2/checkout/orders/${encodeURIComponent(providerOrderId)}`);}

export function completedCapture(body:Record<string,unknown>,expectedAmount:string,expectedCurrency:string){
  const units=Array.isArray(body.purchase_units)?body.purchase_units:[];const unit=units[0] as Record<string,unknown>|undefined;
  const payments=unit?.payments as Record<string,unknown>|undefined;const captures=Array.isArray(payments?.captures)?payments.captures:[];const capture=captures[0] as Record<string,unknown>|undefined;
  const amount=capture?.amount as Record<string,unknown>|undefined;
  const parsed={status:String(capture?.status??""),amount:String(amount?.value??""),currency:String(amount?.currency_code??""),captureId:String(capture?.id??"")};
  if(!parsed.captureId||!validateCompletedPayment(parsed,expectedAmount,expectedCurrency)) throw new Error("La cattura PayPal non risulta completata con l'importo atteso.");
  return parsed;
}

export async function verifyPayPalWebhook(headers:Headers,event:unknown){
  const webhookId=process.env.PAYPAL_WEBHOOK_ID?.trim();if(!webhookId) throw new Error("PAYPAL_WEBHOOK_ID non configurato.");
  const body=await paypalJson("/v1/notifications/verify-webhook-signature",{method:"POST",body:JSON.stringify({auth_algo:headers.get("paypal-auth-algo"),cert_url:headers.get("paypal-cert-url"),transmission_id:headers.get("paypal-transmission-id"),transmission_sig:headers.get("paypal-transmission-sig"),transmission_time:headers.get("paypal-transmission-time"),webhook_id:webhookId,webhook_event:event})});
  return body.verification_status==="SUCCESS";
}
