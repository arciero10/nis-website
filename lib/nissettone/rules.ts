export const NISSETTONE_UNIT_PRICE_CENTS=5000;
export const NISSETTONE_INITIAL_STOCK=250;
export const NISSETTONE_MAX_QUANTITY=250;
export const NISSETTONE_RESERVATION_MINUTES=20;
export const NISSETTONE_PICKUP_ADDRESS="Pasticceria Sabotino, Via Sabotino 23/25, 00195 Roma";

export type NissettoneDeliveryMethod="PICKUP"|"DELIVERY";
export type NissettonePaymentStatus="PENDING"|"PAID"|"FAILED"|"REFUNDED"|"CANCELLED";
export type NissettoneFulfillmentStatus="TO_PREPARE"|"PREPARING"|"READY_FOR_PICKUP"|"OUT_FOR_DELIVERY"|"COMPLETED"|"CANCELLED";

export function validNissettoneQuantity(value:number,available:number){return Number.isInteger(value)&&value>=1&&value<=NISSETTONE_MAX_QUANTITY&&value<=available;}
export function nissettoneTotalCents(quantity:number){if(!Number.isInteger(quantity)||quantity<1)throw new Error("Quantità non valida.");return quantity*NISSETTONE_UNIT_PRICE_CENTS;}
export function isDeclaredRomeMunicipality(value:string){return value.trim().toLocaleLowerCase("it-IT")==="roma";}
export function addressVerificationFor(method:NissettoneDeliveryMethod){return method==="PICKUP"?"NOT_REQUIRED" as const:"PENDING" as const;}
export function checkoutConfigured(environment:NodeJS.ProcessEnv=process.env){return environment.NISSETTONE_PAYPAL_ENABLED==="true"&&Boolean(environment.PAYPAL_CLIENT_ID?.trim()&&environment.PAYPAL_CLIENT_SECRET?.trim()&&environment.NISSETTONE_PAYPAL_WEBHOOK_ID?.trim()&&(environment.PAYPAL_ENV==="sandbox"||environment.PAYPAL_ENV==="live"));}
export function availableStock(stockTotal:number,stockCommitted:number,reserved:number){return Math.max(0,stockTotal-stockCommitted-reserved);}
