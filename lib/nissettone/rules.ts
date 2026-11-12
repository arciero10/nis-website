export const NISSETTONE_UNIT_PRICE_CENTS=5500;
export const NISSETTONE_INITIAL_STOCK=250;
export const NISSETTONE_MAX_QUANTITY=250;
export const NISSETTONE_RESERVATION_MINUTES=20;
export const NISSETTONE_PICKUP_ADDRESS="Pasticceria Sabotino, Via Sabotino 23/25, 00195 Roma";

export type NissettoneDeliveryMethod="PICKUP"|"DELIVERY";
export type NissettoneBuyerType="PRIVATE"|"ORGANIZATION";
export type NissettonePaymentStatus="PENDING"|"PAID"|"FAILED"|"REFUNDED"|"CANCELLED";
export type NissettoneFulfillmentStatus="TO_PREPARE"|"PREPARING"|"READY_FOR_PICKUP"|"OUT_FOR_DELIVERY"|"COMPLETED"|"CANCELLED";
export type NissettoneDocumentStatus="NOT_REQUESTED"|"REQUESTED"|"TO_REVIEW"|"ISSUED"|"NOT_DUE"|"CANCELLED";

export function validNissettoneQuantity(value:number,available:number){return Number.isInteger(value)&&value>=1&&value<=NISSETTONE_MAX_QUANTITY&&value<=available;}
export function nissettoneTotalCents(quantity:number,unitPriceCents=NISSETTONE_UNIT_PRICE_CENTS){if(!Number.isInteger(quantity)||quantity<1||!Number.isInteger(unitPriceCents)||unitPriceCents<1)throw new Error("Quantità o prezzo non validi.");return quantity*unitPriceCents;}
export function isDeclaredRomeMunicipality(value:string){return value.trim().toLocaleLowerCase("it-IT")==="roma";}
export function addressVerificationFor(method:NissettoneDeliveryMethod){return method==="PICKUP"?"NOT_REQUIRED" as const:"PENDING" as const;}
export function checkoutConfigured(environment:NodeJS.ProcessEnv=process.env){return environment.NISSETTONE_PAYPAL_ENABLED==="true"&&Boolean(environment.PAYPAL_CLIENT_ID?.trim()&&environment.PAYPAL_CLIENT_SECRET?.trim()&&environment.NISSETTONE_PAYPAL_WEBHOOK_ID?.trim()&&(environment.PAYPAL_ENV==="sandbox"||environment.PAYPAL_ENV==="live"));}
export function availableStock(stockTotal:number,stockCommitted:number,reserved:number){return Math.max(0,stockTotal-stockCommitted-reserved);}
export function nissettonePaymentDispositionForEvent(eventType:string){
  if(eventType==="PAYMENT.CAPTURE.REFUNDED"||eventType==="PAYMENT.CAPTURE.REVERSED")return "REFUNDED" as const;
  if(eventType==="PAYMENT.CAPTURE.DENIED")return "FAILED" as const;
  if(eventType==="CHECKOUT.ORDER.CANCELLED")return "CANCELLED" as const;
  return null;
}
