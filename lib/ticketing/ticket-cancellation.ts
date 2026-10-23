export const TICKET_CANCELLATION_REASON_MIN_LENGTH=3;
export const TICKET_CANCELLATION_REASON_MAX_LENGTH=500;

export function normalizeTicketCancellationReason(value:unknown):string|null{
  if(typeof value!=="string")return null;
  const reason=value.replace(/\r\n?/g,"\n").trim();
  return reason.length>=TICKET_CANCELLATION_REASON_MIN_LENGTH&&reason.length<=TICKET_CANCELLATION_REASON_MAX_LENGTH?reason:null;
}

export function isValidTicketCancellationReason(value:unknown):boolean{
  return normalizeTicketCancellationReason(value)!==null;
}
