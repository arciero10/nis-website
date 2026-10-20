import type {QueryResultRow} from "pg";
import {query} from "@/lib/ticketing/db";
import {formatPersonNamePart} from "@/lib/ticketing/name-format";
import type {ParticipantExportFilters,ParticipantExportRow} from "@/lib/ticketing/participant-export-model";
import type {InvitationType,TicketIssuanceSource,TicketStatus} from "@/types/ticketing";

type ExportRow=QueryResultRow&{first_name:string;last_name:string;email:string;phone:string|null;ticket_code:string;invitation_type:InvitationType;issuance_source:TicketIssuanceSource;company_name:string|null;company_contact:string|null;ticket_status:TicketStatus;order_payment_status:string|null;manual_payment_status:string|null;order_amount:string|null;manual_amount:string|null;allocation_amount_cents:string|null;order_id:string|null;manual_issuance_id:string|null;allocation_id:string|null;checked_in_at:Date|null;issued_at:Date;allocation_type:string|null;allocated_quantity:number|null;allocation_issued:string|null;allocation_used:string|null};

export async function loadParticipantExportRows(eventSlug:string,filters:ParticipantExportFilters):Promise<ParticipantExportRow[]>{
  const active=filters.scope==="FILTERED";const values:unknown[]=[eventSlug,active?filters.query:"",active?filters.status:"ALL",active?filters.source:"ALL",active?filters.type:"ALL",active?filters.from:null,active?filters.to:null];
  const result=await query<ExportRow>(`SELECT attendee.first_name,attendee.last_name,attendee.email,attendee.phone,ticket.ticket_code,ticket.invitation_type,ticket.issuance_source,
    COALESCE(allocation.company_name,manual.organization,attendee.company) AS company_name,allocation.contact_email AS company_contact,ticket.status AS ticket_status,
    orders.payment_status AS order_payment_status,manual.payment_status AS manual_payment_status,orders.amount AS order_amount,manual.declared_amount AS manual_amount,
    allocation.partnership_amount_cents AS allocation_amount_cents,orders.id AS order_id,manual.id AS manual_issuance_id,allocation.id AS allocation_id,
    checkin.checked_in_at,ticket.created_at AS issued_at,allocation.allocation_type,allocation.allocated_quantity,
    CASE WHEN allocation.id IS NULL THEN NULL ELSE (SELECT COUNT(*)::text FROM ticketing_tickets issued WHERE issued.partner_allocation_id=allocation.id) END AS allocation_issued,
    CASE WHEN allocation.id IS NULL THEN NULL ELSE (SELECT COUNT(*)::text FROM ticketing_tickets used WHERE used.partner_allocation_id=allocation.id AND used.status='USED') END AS allocation_used
  FROM ticketing_tickets ticket
  JOIN ticketing_events event ON event.id=ticket.event_id
  JOIN ticketing_attendees attendee ON attendee.id=ticket.attendee_id
  LEFT JOIN ticketing_orders orders ON orders.id=ticket.order_id
  LEFT JOIN ticketing_manual_issuances manual ON manual.id=ticket.manual_issuance_id
  LEFT JOIN ticketing_partner_allocations allocation ON allocation.id=ticket.partner_allocation_id
  LEFT JOIN LATERAL (SELECT checked_in_at FROM ticketing_check_ins ci WHERE ci.ticket_id=ticket.id AND ci.result='ALLOWED' AND ci.status='ACTIVE' ORDER BY checked_in_at DESC LIMIT 1) checkin ON TRUE
  WHERE event.slug=$1
    AND ($2='' OR CONCAT_WS(' ',attendee.first_name,attendee.last_name,attendee.email,ticket.ticket_code) ILIKE '%'||$2||'%')
    AND ($3='ALL' OR ($3='VALID' AND ticket.status IN ('ACTIVE','USED')) OR ($3='USED' AND ticket.status='USED') OR ($3='CANCELLED' AND ticket.status IN ('CANCELLED','REFUNDED')) OR ($3='NOT_USED' AND ticket.status='ACTIVE'))
    AND ($4='ALL' OR ticket.issuance_source=$4)
    AND ($5='ALL' OR ticket.invitation_type=$5 OR ($5='OMAGGIO' AND ticket.issuance_source='ADMIN' AND ticket.invitation_type IN ('STAMPA','MEDIA','PRESS','OMAGGIO_NIS')))
    AND ($6::date IS NULL OR ticket.created_at>=($6::date AT TIME ZONE 'Europe/Rome'))
    AND ($7::date IS NULL OR ticket.created_at<(($7::date+1) AT TIME ZONE 'Europe/Rome'))
  ORDER BY attendee.last_name,attendee.first_name,ticket.ticket_code LIMIT 5001`,values);
  if(result.rows.length>5000)throw new Error("EXPORT_ROW_LIMIT");
  return result.rows.map(row=>{
    const amount=row.order_amount!==null?Number(row.order_amount):row.manual_amount!==null?Number(row.manual_amount):row.allocation_amount_cents!==null?Number(row.allocation_amount_cents)/100:null;
    const bucket=row.order_id?row.order_payment_status==="PAID"?"COLLECTED":"PENDING":row.allocation_id?"PARTNERSHIP":row.manual_issuance_id?row.manual_payment_status==="PENDING_COLLECTION"?"PENDING":row.manual_payment_status==="VERIFIED_MANUAL"?"COLLECTED":"NONE":"NONE";
    return {firstName:formatPersonNamePart(row.first_name),lastName:formatPersonNamePart(row.last_name),email:row.email,phone:row.phone,ticketCode:row.ticket_code,invitationType:row.invitation_type,source:row.issuance_source,organization:row.company_name,companyContact:row.company_contact,ticketStatus:row.ticket_status,paymentStatus:row.order_payment_status??row.manual_payment_status??(row.allocation_id?"ASSEGNAZIONE":"-"),amount,paymentBucket:bucket,paymentGroupKey:row.order_id?`order:${row.order_id}`:row.manual_issuance_id?`manual:${row.manual_issuance_id}`:row.allocation_id?`allocation:${row.allocation_id}`:null,checkInStatus:row.ticket_status==="USED"?"ENTRATO":row.ticket_status==="ACTIVE"?"DA ARRIVARE":"ANNULLATO",checkedInAt:row.checked_in_at?.toISOString()??null,issuedAt:row.issued_at.toISOString(),allocationId:row.allocation_id,allocationType:row.allocation_type,allocationQuantity:row.allocated_quantity,allocationIssued:row.allocation_issued===null?null:Number(row.allocation_issued),allocationUsed:row.allocation_used===null?null:Number(row.allocation_used),allocationAmount:row.allocation_amount_cents===null?null:Number(row.allocation_amount_cents)/100} satisfies ParticipantExportRow;
  });
}
