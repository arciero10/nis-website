export type InvitationRuleInput={
  status:"ACTIVE"|"DISABLED"|"EXPIRED";
  maxUses:number;
  usedCount:number;
  expiresAt:string|null;
};

export type PaymentRuleInput={
  status:string;
  amount:string;
  currency:string;
};

export const MIN_TICKETS_PER_ORDER=1;
export const MAX_TICKETS_PER_ORDER=10;

export function validTicketQuantity(quantity:number){
  return Number.isInteger(quantity)&&quantity>=MIN_TICKETS_PER_ORDER&&quantity<=MAX_TICKETS_PER_ORDER;
}

export function orderAmountForQuantity(unitPrice:number,quantity:number){
  if(!validTicketQuantity(quantity)) return null;
  return Number((unitPrice*quantity).toFixed(2));
}

export function ticketsToIssue(participantCount:number,existingTicketCount:number){
  if(!validTicketQuantity(participantCount)) return null;
  return existingTicketCount>0?0:participantCount;
}

export function invitationUsesAfterOrder(currentUses:number){
  return currentUses+1;
}

export function checkInEligibility(input:{ticketStatus:string;firstCheckInAt:string|null;paymentStatus:string;eventStatus:string}){
  if(input.paymentStatus!=="PAID"||input.eventStatus==="CANCELLED"||input.ticketStatus==="CANCELLED"||input.ticketStatus==="REFUNDED")return "INVALID" as const;
  if(input.ticketStatus==="USED"||input.firstCheckInAt)return "ALREADY_USED" as const;
  return "AUTHORIZED" as const;
}

export function invitationBlockReason(invitation:InvitationRuleInput,now=new Date()){
  if(invitation.status!=="ACTIVE") return invitation.status==="EXPIRED"?"EXPIRED":"DISABLED";
  if(invitation.expiresAt&&new Date(invitation.expiresAt).getTime()<=now.getTime()) return "EXPIRED";
  if(invitation.usedCount>=invitation.maxUses) return "MAX_USES_REACHED";
  return null;
}

export function validateCompletedPayment(payment:PaymentRuleInput,expectedAmount:string,expectedCurrency="EUR"){
  if(payment.status!=="COMPLETED") return false;
  if(payment.currency!==expectedCurrency) return false;
  return Number(payment.amount).toFixed(2)===Number(expectedAmount).toFixed(2);
}

export function statusAfterCaptureEvent(eventType:string){
  if(eventType==="PAYMENT.CAPTURE.REFUNDED") return {paymentStatus:"REFUNDED" as const,ticketStatus:"REFUNDED" as const};
  if(eventType==="PAYMENT.CAPTURE.REVERSED") return {paymentStatus:"REFUNDED" as const,ticketStatus:"CANCELLED" as const};
  if(eventType==="PAYMENT.CAPTURE.DENIED") return {paymentStatus:"FAILED" as const,ticketStatus:"CANCELLED" as const};
  return null;
}
