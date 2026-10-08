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
