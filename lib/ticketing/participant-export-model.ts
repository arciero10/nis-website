import type {InvitationType,TicketIssuanceSource,TicketStatus} from "@/types/ticketing";

export type ParticipantExportScope="FILTERED"|"ALL";
export type ParticipantExportStatus="ALL"|"VALID"|"USED"|"CANCELLED"|"NOT_USED";
export type ParticipantExportSource="ALL"|TicketIssuanceSource;
export type ParticipantExportType="ALL"|"OMAGGIO"|InvitationType;
export type ParticipantPaymentMethod="PayPal"|"Bonifico"|"Contanti"|"Omaggio"|"Assegnazione aziendale"|"NON DETERMINABILE";
export type ParticipantPaymentState="PAGATO"|"DA INCASSARE"|"DA VERIFICARE"|"NON DOVUTO"|"RIMBORSATO"|"NON DETERMINABILE";

export type ParticipantExportFilters={scope:ParticipantExportScope;query:string;status:ParticipantExportStatus;source:ParticipantExportSource;type:ParticipantExportType;from:string|null;to:string|null};
export type ParticipantExportRow={
  firstName:string;lastName:string;email:string;phone:string|null;ticketCode:string;invitationType:InvitationType;source:TicketIssuanceSource;
  organization:string|null;companyContact:string|null;ticketStatus:TicketStatus;paymentStatus:string;amount:number|null;paymentBucket:"COLLECTED"|"PENDING"|"PARTNERSHIP"|"NONE";
  paymentMethod:ParticipantPaymentMethod;paymentState:ParticipantPaymentState;collectedAmount:number|null;outstandingAmount:number|null;
  paymentGroupKey:string|null;checkInStatus:"ENTRATO"|"DA ARRIVARE"|"ANNULLATO";checkedInAt:string|null;issuedAt:string;
  allocationId:string|null;allocationType:string|null;allocationQuantity:number|null;allocationIssued:number|null;allocationUsed:number|null;allocationAmount:number|null;
};
export type CompanyExportSummary={company:string;type:string;contact:string;assigned:number;issued:number;used:number;remaining:number;amount:number|null};
export type ParticipantExportDataset={rows:ParticipantExportRow[];cancelledRows:ParticipantExportRow[];generatedAt:string;filters:ParticipantExportFilters;summary:{total:number;valid:number;complimentary:number;used:number;cancelled:number;notUsed:number;paid:number;toCollect:number;toVerify:number;notDue:number;refunded:number;undetermined:number;bySource:Record<string,number>;byPaymentMethod:Record<string,number>;byType:Record<string,number>;collected:number;pending:number;partnership:number};companies:CompanyExportSummary[]};

export type ParticipantPaymentEvidence={source:TicketIssuanceSource;orderPaymentStatus:string|null;manualPaymentStatus:string|null;manualPaymentMethod:string|null;cashCollectionStatus:string|null;amount:number|null;ticketCount:number|null};

const attributableAmount=(amount:number|null,ticketCount:number|null)=>amount!==null&&ticketCount===1?amount:null;

export function classifyParticipantPayment(evidence:ParticipantPaymentEvidence):Pick<ParticipantExportRow,"paymentMethod"|"paymentState"|"collectedAmount"|"outstandingAmount"|"paymentBucket">{
  const {source,amount,ticketCount}=evidence;
  if(source==="PAYPAL"){
    if(evidence.orderPaymentStatus==="PAID")return {paymentMethod:"PayPal",paymentState:"PAGATO",collectedAmount:attributableAmount(amount,ticketCount),outstandingAmount:null,paymentBucket:"COLLECTED"};
    if(evidence.orderPaymentStatus==="REFUNDED")return {paymentMethod:"PayPal",paymentState:"RIMBORSATO",collectedAmount:0,outstandingAmount:null,paymentBucket:"NONE"};
    if(evidence.orderPaymentStatus==="PENDING")return {paymentMethod:"PayPal",paymentState:"DA VERIFICARE",collectedAmount:null,outstandingAmount:null,paymentBucket:"NONE"};
    return {paymentMethod:"PayPal",paymentState:"NON DETERMINABILE",collectedAmount:null,outstandingAmount:null,paymentBucket:"NONE"};
  }
  if(source==="PAYPAL_CHARITY"){
    if(evidence.manualPaymentStatus==="VERIFIED_MANUAL")return {paymentMethod:"PayPal",paymentState:"PAGATO",collectedAmount:attributableAmount(amount,ticketCount),outstandingAmount:null,paymentBucket:"COLLECTED"};
    return {paymentMethod:"PayPal",paymentState:"DA VERIFICARE",collectedAmount:null,outstandingAmount:null,paymentBucket:"NONE"};
  }
  if(source==="BANK_TRANSFER"){
    if(evidence.manualPaymentStatus==="VERIFIED_MANUAL")return {paymentMethod:"Bonifico",paymentState:"PAGATO",collectedAmount:attributableAmount(amount,ticketCount),outstandingAmount:null,paymentBucket:"COLLECTED"};
    return {paymentMethod:"Bonifico",paymentState:"DA VERIFICARE",collectedAmount:null,outstandingAmount:null,paymentBucket:"NONE"};
  }
  if(source==="CASH"){
    if(evidence.manualPaymentStatus==="VERIFIED_MANUAL"&&evidence.cashCollectionStatus==="INCASSATO")return {paymentMethod:"Contanti",paymentState:"PAGATO",collectedAmount:attributableAmount(amount,ticketCount),outstandingAmount:null,paymentBucket:"COLLECTED"};
    if(evidence.manualPaymentStatus==="PENDING_COLLECTION"&&evidence.cashCollectionStatus==="DA_INCASSARE")return {paymentMethod:"Contanti",paymentState:"DA INCASSARE",collectedAmount:0,outstandingAmount:amount,paymentBucket:"PENDING"};
    return {paymentMethod:"Contanti",paymentState:"NON DETERMINABILE",collectedAmount:null,outstandingAmount:null,paymentBucket:"NONE"};
  }
  if(source==="ADMIN")return {paymentMethod:"Omaggio",paymentState:"NON DOVUTO",collectedAmount:0,outstandingAmount:0,paymentBucket:"NONE"};
  if(source==="COMPANY")return {paymentMethod:"Assegnazione aziendale",paymentState:"NON DETERMINABILE",collectedAmount:null,outstandingAmount:null,paymentBucket:"PARTNERSHIP"};
  return {paymentMethod:"NON DETERMINABILE",paymentState:"NON DETERMINABILE",collectedAmount:null,outstandingAmount:null,paymentBucket:"NONE"};
}

export function sanitizeSpreadsheetText(value:string){
  const clean=value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,"");
  return clean!=="-"&&/^[=+\-@]/.test(clean)?`'${clean}`:clean;
}

export function sourceLabel(value:TicketIssuanceSource){
  return ({PAYPAL:"PayPal Checkout",PAYPAL_CHARITY:"PayPal Charity",CASH:"Contanti",BANK_TRANSFER:"Bonifico",COMPANY:"Azienda",ADMIN:"Admin"} as const)[value];
}

export function typeLabel(value:InvitationType){
  return ({STANDARD:"Standard",SPONSOR:"Sponsor",DONATORE:"Donatore",AZIENDA:"Azienda",OSPITE:"Ospite",STAMPA:"Stampa",MEDIA:"Media",PRESS:"Press",OMAGGIO_NIS:"Omaggio NIS"} as const)[value];
}

// Temporary operational exclusion until this known test ticket is removed through the audited admin flow.
export const PARTICIPANT_EXPORT_EXCLUDED_TICKET_CODES=new Set(["NIS26-J89R4AL3"]);

export function buildParticipantExportDataset(rows:ParticipantExportRow[],filters:ParticipantExportFilters,generatedAt=new Date().toISOString()):ParticipantExportDataset{
  const operational=rows.filter(row=>!PARTICIPANT_EXPORT_EXCLUDED_TICKET_CODES.has(row.ticketCode));
  const sorted=[...operational].sort((a,b)=>a.lastName.localeCompare(b.lastName,"it",{sensitivity:"base"})||a.firstName.localeCompare(b.firstName,"it",{sensitivity:"base"})||a.ticketCode.localeCompare(b.ticketCode));
  const validRows=sorted.filter(row=>row.ticketStatus==="ACTIVE"||row.ticketStatus==="USED");
  const cancelledRows=sorted.filter(row=>row.ticketStatus==="CANCELLED"||row.ticketStatus==="REFUNDED");
  const bySource:Record<string,number>={};const byPaymentMethod:Record<string,number>={};const byType:Record<string,number>={};const seenPayments=new Set<string>();
  let collected=0,pending=0,partnership=0;
  for(const row of validRows){
    bySource[sourceLabel(row.source)]=(bySource[sourceLabel(row.source)]??0)+1;byPaymentMethod[row.paymentMethod]=(byPaymentMethod[row.paymentMethod]??0)+1;byType[typeLabel(row.invitationType)]=(byType[typeLabel(row.invitationType)]??0)+1;
    if(row.paymentGroupKey&&!seenPayments.has(row.paymentGroupKey)&&row.amount!==null){seenPayments.add(row.paymentGroupKey);if(row.paymentBucket==="COLLECTED")collected+=row.amount;else if(row.paymentBucket==="PENDING")pending+=row.amount;else if(row.paymentBucket==="PARTNERSHIP")partnership+=row.amount;}
  }
  const allocations=new Map<string,CompanyExportSummary>();
  for(const row of sorted){if(!row.allocationId||allocations.has(row.allocationId))continue;allocations.set(row.allocationId,{company:row.organization??"-",type:row.allocationType??"Azienda",contact:row.companyContact??"-",assigned:row.allocationQuantity??0,issued:row.allocationIssued??0,used:row.allocationUsed??0,remaining:Math.max(0,(row.allocationQuantity??0)-(row.allocationIssued??0)),amount:row.allocationAmount});}
  const count=(state:ParticipantPaymentState)=>validRows.filter(row=>row.paymentState===state).length;
  const complimentary=validRows.filter(row=>row.source==="ADMIN"&&["STAMPA","MEDIA","PRESS","OMAGGIO_NIS","SPONSOR"].includes(row.invitationType)).length;
  return {rows:validRows,cancelledRows,generatedAt,filters,summary:{total:validRows.length,valid:validRows.length,complimentary,used:validRows.filter(row=>row.ticketStatus==="USED").length,cancelled:cancelledRows.length,notUsed:validRows.filter(row=>row.ticketStatus==="ACTIVE").length,paid:count("PAGATO"),toCollect:count("DA INCASSARE"),toVerify:count("DA VERIFICARE"),notDue:count("NON DOVUTO"),refunded:cancelledRows.filter(row=>row.ticketStatus==="REFUNDED").length,undetermined:count("NON DETERMINABILE"),bySource,byPaymentMethod,byType,collected,pending,partnership},companies:[...allocations.values()].sort((a,b)=>a.company.localeCompare(b.company,"it",{sensitivity:"base"}))};
}
