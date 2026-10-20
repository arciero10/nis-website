import type {InvitationType,TicketIssuanceSource,TicketStatus} from "@/types/ticketing";

export type ParticipantExportScope="FILTERED"|"ALL";
export type ParticipantExportStatus="ALL"|"VALID"|"USED"|"CANCELLED"|"NOT_USED";
export type ParticipantExportSource="ALL"|TicketIssuanceSource;
export type ParticipantExportType="ALL"|"OMAGGIO"|InvitationType;

export type ParticipantExportFilters={scope:ParticipantExportScope;query:string;status:ParticipantExportStatus;source:ParticipantExportSource;type:ParticipantExportType;from:string|null;to:string|null};
export type ParticipantExportRow={
  firstName:string;lastName:string;email:string;phone:string|null;ticketCode:string;invitationType:InvitationType;source:TicketIssuanceSource;
  organization:string|null;companyContact:string|null;ticketStatus:TicketStatus;paymentStatus:string;amount:number|null;paymentBucket:"COLLECTED"|"PENDING"|"PARTNERSHIP"|"NONE";
  paymentGroupKey:string|null;checkInStatus:"ENTRATO"|"DA ARRIVARE"|"ANNULLATO";checkedInAt:string|null;issuedAt:string;
  allocationId:string|null;allocationType:string|null;allocationQuantity:number|null;allocationIssued:number|null;allocationUsed:number|null;allocationAmount:number|null;
};
export type CompanyExportSummary={company:string;type:string;contact:string;assigned:number;issued:number;used:number;remaining:number;amount:number|null};
export type ParticipantExportDataset={rows:ParticipantExportRow[];generatedAt:string;filters:ParticipantExportFilters;summary:{total:number;valid:number;used:number;cancelled:number;notUsed:number;bySource:Record<string,number>;byType:Record<string,number>;collected:number;pending:number;partnership:number};companies:CompanyExportSummary[]};

export function sanitizeSpreadsheetText(value:string){
  const clean=value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,"");
  return /^[=+\-@]/.test(clean)?`'${clean}`:clean;
}

export function sourceLabel(value:TicketIssuanceSource){
  return ({PAYPAL:"PayPal Checkout",PAYPAL_CHARITY:"PayPal Charity",CASH:"Contanti",BANK_TRANSFER:"Bonifico",COMPANY:"Azienda",ADMIN:"Admin"} as const)[value];
}

export function typeLabel(value:InvitationType){
  return ({STANDARD:"Standard",SPONSOR:"Sponsor",DONATORE:"Donatore",AZIENDA:"Azienda",OSPITE:"Ospite",STAMPA:"Stampa",MEDIA:"Media",PRESS:"Press",OMAGGIO_NIS:"Omaggio NIS"} as const)[value];
}

export function buildParticipantExportDataset(rows:ParticipantExportRow[],filters:ParticipantExportFilters,generatedAt=new Date().toISOString()):ParticipantExportDataset{
  const sorted=[...rows].sort((a,b)=>a.lastName.localeCompare(b.lastName,"it",{sensitivity:"base"})||a.firstName.localeCompare(b.firstName,"it",{sensitivity:"base"})||a.ticketCode.localeCompare(b.ticketCode));
  const bySource:Record<string,number>={};const byType:Record<string,number>={};const seenPayments=new Set<string>();
  let collected=0,pending=0,partnership=0;
  for(const row of sorted){
    bySource[sourceLabel(row.source)]=(bySource[sourceLabel(row.source)]??0)+1;byType[typeLabel(row.invitationType)]=(byType[typeLabel(row.invitationType)]??0)+1;
    if(row.paymentGroupKey&&!seenPayments.has(row.paymentGroupKey)&&row.amount!==null){seenPayments.add(row.paymentGroupKey);if(row.paymentBucket==="COLLECTED")collected+=row.amount;else if(row.paymentBucket==="PENDING")pending+=row.amount;else if(row.paymentBucket==="PARTNERSHIP")partnership+=row.amount;}
  }
  const allocations=new Map<string,CompanyExportSummary>();
  for(const row of sorted){if(!row.allocationId||allocations.has(row.allocationId))continue;allocations.set(row.allocationId,{company:row.organization??"-",type:row.allocationType??"Azienda",contact:row.companyContact??"-",assigned:row.allocationQuantity??0,issued:row.allocationIssued??0,used:row.allocationUsed??0,remaining:Math.max(0,(row.allocationQuantity??0)-(row.allocationIssued??0)),amount:row.allocationAmount});}
  return {rows:sorted,generatedAt,filters,summary:{total:sorted.length,valid:sorted.filter(row=>row.ticketStatus==="ACTIVE"||row.ticketStatus==="USED").length,used:sorted.filter(row=>row.ticketStatus==="USED").length,cancelled:sorted.filter(row=>row.ticketStatus==="CANCELLED"||row.ticketStatus==="REFUNDED").length,notUsed:sorted.filter(row=>row.ticketStatus==="ACTIVE").length,bySource,byType,collected,pending,partnership},companies:[...allocations.values()].sort((a,b)=>a.company.localeCompare(b.company,"it",{sensitivity:"base"}))};
}
