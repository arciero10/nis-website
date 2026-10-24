export const TICKET_CANCELLATION_REASON_MIN_LENGTH=3;
export const TICKET_CANCELLATION_REASON_MAX_LENGTH=500;
const PERMANENTLY_DELETABLE_SOURCES=new Set(["PAYPAL","PAYPAL_CHARITY","CASH","BANK_TRANSFER","COMPANY","ADMIN"]);

export type PermanentDeletionInputResult={ok:true;reason:string}|{ok:false;error:"INVALID_CONFIRMATION"|"INVALID_REASON"};
export type PermanentDeletionRecordError="INVALID_STATE"|"ORIGIN_NOT_ALLOWED";

export function normalizeTicketCancellationReason(value:unknown):string|null{
  if(typeof value!=="string")return null;
  const reason=value.replace(/\r\n?/g,"\n").trim();
  return reason.length>=TICKET_CANCELLATION_REASON_MIN_LENGTH&&reason.length<=TICKET_CANCELLATION_REASON_MAX_LENGTH?reason:null;
}

export function isValidTicketCancellationReason(value:unknown):boolean{
  return normalizeTicketCancellationReason(value)!==null;
}

export function validatePermanentDeletionInput(ticketCode:string,confirmationCode:string,reason:unknown):PermanentDeletionInputResult{
  if(confirmationCode!==ticketCode)return {ok:false,error:"INVALID_CONFIRMATION"};
  const normalizedReason=normalizeTicketCancellationReason(reason);
  return normalizedReason?{ok:true,reason:normalizedReason}:{ok:false,error:"INVALID_REASON"};
}

export function validatePermanentDeletionRecord(status:string,source:string):PermanentDeletionRecordError|null{
  if(status!=="CANCELLED")return "INVALID_STATE";
  return PERMANENTLY_DELETABLE_SOURCES.has(source)?null:"ORIGIN_NOT_ALLOWED";
}
