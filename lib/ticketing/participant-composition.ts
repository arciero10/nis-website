import type {InvitationType,TicketIssuanceSource} from "@/types/ticketing";

export type OperationalParticipantBucket="PAID"|"TO_COLLECT"|"COMPLIMENTARY"|"COMPANY";

export type OperationalParticipantEvidence={
  source:TicketIssuanceSource;
  invitationType:InvitationType;
  partnerAllocationId:string|null;
  orderPaymentStatus:string|null;
  manualPaymentStatus:string|null;
  cashCollectionStatus:string|null;
};

const complimentaryTypes=new Set<InvitationType>(["STAMPA","MEDIA","PRESS","OMAGGIO_NIS"]);

export function classifyOperationalParticipant(evidence:OperationalParticipantEvidence):OperationalParticipantBucket{
  if(evidence.partnerAllocationId||evidence.source==="COMPANY")return "COMPANY";
  if(evidence.source==="ADMIN"||complimentaryTypes.has(evidence.invitationType))return "COMPLIMENTARY";
  if(evidence.orderPaymentStatus==="PAID")return "PAID";
  if(evidence.manualPaymentStatus==="VERIFIED_MANUAL"&&(evidence.source!=="CASH"||evidence.cashCollectionStatus==="INCASSATO"))return "PAID";
  return "TO_COLLECT";
}

export function summarizeOperationalParticipants(rows:OperationalParticipantEvidence[]){
  const summary={paid:0,toCollect:0,complimentary:0,company:0};
  for(const row of rows){
    const bucket=classifyOperationalParticipant(row);
    if(bucket==="PAID")summary.paid++;
    else if(bucket==="TO_COLLECT")summary.toCollect++;
    else if(bucket==="COMPLIMENTARY")summary.complimentary++;
    else summary.company++;
  }
  return summary;
}
