import {randomUUID} from "node:crypto";
import type {PoolClient} from "pg";
import {query,withTransaction} from "@/lib/ticketing/db";
import type {AdminIssuanceInput,BankTransferIssuanceInput,PayPalCharityIssuanceInput} from "@/lib/ticketing/manual-input";
import {normalizeDonationReference,sameParticipants,strongContactMatch,type ParticipantIdentity} from "@/lib/ticketing/participant-identity";
import type {TicketEmailPayload} from "@/lib/ticketing/repository";
import {hasTicketCapacity} from "@/lib/ticketing/rules";
import {generateQrToken,generateTicketCode} from "@/lib/ticketing/security";
import {formatPersonNamePart} from "@/lib/ticketing/name-format";
import type {StaffSession} from "@/lib/ticketing/staff-auth";
import type {InvitationType,StaffRole,TicketIssuanceSource} from "@/types/ticketing";

export type ManualIssuanceResult={issuanceId:string;source:"PAYPAL_CHARITY"|"BANK_TRANSFER"|"ADMIN";created:boolean;tickets:{ticketCode:string;qrToken:string}[];emailPayloads:TicketEmailPayload[]};
export type StaffTicketDetail={ticketCode:string;ticketStatus:"ACTIVE"|"USED"|"CANCELLED"|"REFUNDED";firstName:string;lastName:string;email:string;issuanceSource:TicketIssuanceSource;invitationType:InvitationType;paymentStatus:string;emailStatus:"PENDING"|"SENT"|"FAILED";emailSentAt:string|null;emailSendAttempts:number;emailLastError:string|null;createdAt:string;createdBy:string|null;createdByRole:StaffRole|null;declaredAmount:number|null;transferDate:string|null;transferReference:string|null;organization:string|null;reason:string|null;notes:string|null};

type ManualInput=PayPalCharityIssuanceInput|BankTransferIssuanceInput|AdminIssuanceInput;
type ExistingRow={id:string;source:"PAYPAL_CHARITY"|"BANK_TRANSFER"|"ADMIN";invitation_type:InvitationType;ticket_id:string;ticket_code:string;qr_token:string;first_name:string;last_name:string;email:string;category:TicketEmailPayload["category"];price:string;currency:string};

async function existingResult(client:PoolClient,key:string):Promise<ManualIssuanceResult|null>{
  const result=await client.query<ExistingRow>("SELECT issuance.id,issuance.source,issuance.invitation_type,ticket.id AS ticket_id,ticket.ticket_code,ticket.qr_token,attendee.first_name,attendee.last_name,attendee.email,ticket.category,event.price,event.currency FROM ticketing_manual_issuances issuance JOIN ticketing_tickets ticket ON ticket.manual_issuance_id=issuance.id JOIN ticketing_attendees attendee ON attendee.id=ticket.attendee_id JOIN ticketing_events event ON event.id=ticket.event_id WHERE issuance.idempotency_key=$1 ORDER BY ticket.sequence_number",[key]);
  if(!result.rows[0])return null;
  return {issuanceId:result.rows[0].id,source:result.rows[0].source,created:false,tickets:result.rows.map(row=>({ticketCode:row.ticket_code,qrToken:row.qr_token})),emailPayloads:result.rows.map(row=>({ticketId:row.ticket_id,firstName:row.first_name,lastName:row.last_name,email:row.email,ticketCode:row.ticket_code,qrToken:row.qr_token,category:row.category,amount:row.source==="ADMIN"?null:Number(row.price),currency:row.currency,source:"STANDARD",companyName:null,allocationType:null,issuanceSource:row.source,invitationType:row.invitation_type}))};
}

async function committedSeatCount(client:PoolClient,eventId:string){const result=await client.query<{count:string}>(`SELECT ((SELECT COUNT(*) FROM ticketing_tickets WHERE event_id=$1 AND (order_id IS NOT NULL OR manual_issuance_id IS NOT NULL) AND status IN ('ACTIVE','USED')) + COALESCE((SELECT SUM(CASE WHEN allocation.status='ACTIVE' THEN allocation.allocated_quantity ELSE (SELECT COUNT(*) FROM ticketing_tickets ticket WHERE ticket.partner_allocation_id=allocation.id AND ticket.status IN ('ACTIVE','USED')) END) FROM ticketing_partner_allocations allocation WHERE allocation.event_id=$1),0))::text AS count`,[eventId]);return Number(result.rows[0].count);}
async function reservedSeatCount(client:PoolClient,eventId:string){const result=await client.query<{count:string}>("SELECT COUNT(*)::text AS count FROM ticketing_order_participants participant JOIN ticketing_orders orders ON orders.id=participant.order_id WHERE orders.event_id=$1 AND orders.payment_status='PENDING' AND orders.created_at>=NOW()-INTERVAL '30 minutes'",[eventId]);return Number(result.rows[0].count);}

async function protectPayPalCharityIssuance(client:PoolClient,eventId:string,idempotencyKey:string,input:PayPalCharityIssuanceInput){
  const reference=normalizeDonationReference(input.paypalReference);
  await client.query("SELECT pg_advisory_xact_lock(hashtext($1))",[`paypal-charity:${reference}`]);
  const usedReference=await client.query<{id:string}>(`SELECT id FROM ticketing_verified_paypal_donations WHERE reference_normalized=$1
    UNION ALL
    SELECT id FROM ticketing_manual_issuances WHERE source='PAYPAL_CHARITY' AND UPPER(REGEXP_REPLACE(BTRIM(transfer_reference),'\\s+','','g'))=$1
    UNION ALL
    SELECT id FROM ticketing_charity_requests WHERE verified_paypal_reference IS NOT NULL AND UPPER(REGEXP_REPLACE(BTRIM(verified_paypal_reference),'\\s+','','g'))=$1 AND ('charity-request-'||id::text)<>$2
    LIMIT 1`,[reference,idempotencyKey]);
  if(usedReference.rows[0])throw new Error("Questo riferimento PayPal risulta già utilizzato per un'altra emissione.");

  const activeTickets=await client.query<{first_name:string;last_name:string;email:string;phone:string|null}>("SELECT attendee.first_name,attendee.last_name,attendee.email,attendee.phone FROM ticketing_tickets ticket JOIN ticketing_attendees attendee ON attendee.id=ticket.attendee_id WHERE ticket.event_id=$1 AND ticket.status IN ('ACTIVE','USED')",[eventId]);
  const participants:ParticipantIdentity[]=input.participants?.length?input.participants:[{firstName:input.firstName,lastName:input.lastName}];
  for(const participant of participants){
    const duplicate=activeTickets.rows.some(ticket=>sameParticipants([participant],[{firstName:ticket.first_name,lastName:ticket.last_name}])&&strongContactMatch(input,ticket));
    if(duplicate)throw new Error("Esiste già un biglietto attivo per uno dei partecipanti indicati.");
  }
  return reference;
}

export async function createManualIssuance(eventSlug:string,idempotencyKey:string,input:ManualInput,session:StaffSession):Promise<ManualIssuanceResult>{
  const normalizedFirstName=formatPersonNamePart(input.firstName);
  const normalizedLastName=formatPersonNamePart(input.lastName);
  const normalizedParticipants=input.source==="PAYPAL_CHARITY"?input.participants?.map(participant=>({firstName:formatPersonNamePart(participant.firstName),lastName:formatPersonNamePart(participant.lastName)})):undefined;
  return withTransaction(async client=>{
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))",[idempotencyKey]);const existing=await existingResult(client,idempotencyKey);if(existing)return existing;
    const eventResult=await client.query<{id:string;capacity:number|null;price:string;currency:string;status:string}>("SELECT id,capacity,price,currency,status FROM ticketing_events WHERE slug=$1 FOR UPDATE",[eventSlug]);const event=eventResult.rows[0];if(!event||["CANCELLED","COMPLETED"].includes(event.status))throw new Error("Evento non disponibile.");
    const [committed,reserved]=await Promise.all([committedSeatCount(client,event.id),reservedSeatCount(client,event.id)]);if(!hasTicketCapacity(event.capacity,committed,input.quantity,reserved))throw new Error("Posti insufficienti per questa emissione.");
    const verifiedPayPalReference=input.source==="PAYPAL_CHARITY"?await protectPayPalCharityIssuance(client,event.id,idempotencyKey,input):null;
    const issuanceId=randomUUID();const admin=input.source==="ADMIN";const charity=input.source==="PAYPAL_CHARITY";const invitationType:InvitationType=admin?input.invitationType:"STANDARD";const paymentDate=admin?null:charity?input.donationDate:input.transferDate;const paymentReference=admin?null:charity?input.paypalReference:input.transferReference;
    await client.query(`INSERT INTO ticketing_manual_issuances(id,event_id,idempotency_key,source,invitation_type,first_name,last_name,email,phone,quantity,payment_status,declared_amount,transfer_date,transfer_reference,complimentary_reason,complimentary_reason_other,organization,notes,created_by_staff_id,created_by_display_name,created_by_role,session_id)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)`,[issuanceId,event.id,idempotencyKey,input.source,invitationType,normalizedFirstName,normalizedLastName,input.email,"phone" in input?(input.phone??null):null,input.quantity,admin?"NOT_REQUIRED":"VERIFIED_MANUAL",admin?null:input.declaredAmount,paymentDate,paymentReference,admin?"OTHER":null,admin?input.reason:null,admin?input.organization:null,input.notes,session.operatorId,session.displayName,session.role,session.sessionId]);
    if(charity&&verifiedPayPalReference)await client.query("INSERT INTO ticketing_verified_paypal_donations(id,event_id,manual_issuance_id,reference_normalized,verified_by_staff_id,verified_by_display_name) VALUES($1,$2,$3,$4,$5,$6)",[randomUUID(),event.id,issuanceId,verifiedPayPalReference,session.operatorId,session.displayName]);
    const tickets:ManualIssuanceResult["tickets"]=[];const emailPayloads:TicketEmailPayload[]=[];
    for(let position=1;position<=input.quantity;position++){
      const attendeeId=randomUUID();const ticketId=randomUUID();const ticketCode=generateTicketCode();const qrToken=generateQrToken();const namedParticipant=normalizedParticipants?.[position-1];const attendeeFirstName=namedParticipant?.firstName??normalizedFirstName;const attendeeLastName=namedParticipant?.lastName??normalizedLastName;
      await client.query("INSERT INTO ticketing_attendees(id,event_id,first_name,last_name,email,phone,company,source) VALUES($1,$2,$3,$4,$5,$6,$7,'STANDARD')",[attendeeId,event.id,attendeeFirstName,attendeeLastName,input.email,"phone" in input&&position===1?(input.phone??null):null,admin?input.organization:null]);
      await client.query("INSERT INTO ticketing_tickets(id,event_id,attendee_id,order_id,partner_allocation_id,manual_issuance_id,issuance_source,invitation_type,ticket_code,qr_token,category,access_mode,status,sequence_number,total_quantity) VALUES($1,$2,$3,NULL,NULL,$4,$5,$6,$7,$8,$9,'ONE_SHOT','ACTIVE',$10,$11)",[ticketId,event.id,attendeeId,issuanceId,input.source,invitationType,ticketCode,qrToken,admin?"COMPLIMENTARY":"STANDARD",position,input.quantity]);
      tickets.push({ticketCode,qrToken});emailPayloads.push({ticketId,firstName:attendeeFirstName,lastName:attendeeLastName,email:input.email,ticketCode,qrToken,category:"STANDARD",amount:admin?null:Number(event.price),currency:event.currency,source:"STANDARD",companyName:null,allocationType:null,issuanceSource:input.source,invitationType});
    }
    if(event.capacity!==null&&committed+reserved+input.quantity>=event.capacity)await client.query("UPDATE ticketing_events SET status='SOLD_OUT',updated_at=NOW() WHERE id=$1 AND status NOT IN ('CANCELLED','COMPLETED')",[event.id]);
    return {issuanceId,source:input.source,created:true,tickets,emailPayloads};
  });
}

export async function findManualIssuanceByIdempotencyKey(key:string){return withTransaction(client=>existingResult(client,key));}

export async function getStaffTicketDetail(ticketCode:string):Promise<StaffTicketDetail|null>{
  const result=await query<{ticket_code:string;ticket_status:"ACTIVE"|"USED"|"CANCELLED"|"REFUNDED";first_name:string;last_name:string;email:string;issuance_source:TicketIssuanceSource;invitation_type:InvitationType;order_payment_status:string|null;manual_payment_status:string|null;ticket_created_at:Date;email_sent_at:Date|null;email_send_attempts:number;email_last_error:string|null;created_by_display_name:string|null;created_by_role:StaffRole|null;declared_amount:string|null;transfer_date:string|null;transfer_reference:string|null;organization:string|null;reason:string|null;notes:string|null}>(`SELECT ticket.ticket_code,ticket.status AS ticket_status,attendee.first_name,attendee.last_name,attendee.email,ticket.issuance_source,ticket.invitation_type,orders.payment_status AS order_payment_status,manual.payment_status AS manual_payment_status,ticket.created_at AS ticket_created_at,ticket.email_sent_at,ticket.email_send_attempts,ticket.email_last_error,manual.created_by_display_name,manual.created_by_role,manual.declared_amount,manual.transfer_date::text,manual.transfer_reference,manual.organization,manual.complimentary_reason_other AS reason,manual.notes FROM ticketing_tickets ticket JOIN ticketing_attendees attendee ON attendee.id=ticket.attendee_id LEFT JOIN ticketing_orders orders ON orders.id=ticket.order_id LEFT JOIN ticketing_manual_issuances manual ON manual.id=ticket.manual_issuance_id WHERE ticket.ticket_code=$1`,[ticketCode]);
  const row=result.rows[0];if(!row)return null;
  return {ticketCode:row.ticket_code,ticketStatus:row.ticket_status,firstName:row.first_name,lastName:row.last_name,email:row.email,issuanceSource:row.issuance_source,invitationType:row.invitation_type,paymentStatus:row.manual_payment_status??row.order_payment_status??(row.issuance_source==="COMPANY"?"NON RICHIESTO":"—"),emailStatus:row.email_sent_at?"SENT":row.email_last_error?"FAILED":"PENDING",emailSentAt:row.email_sent_at?.toISOString()??null,emailSendAttempts:row.email_send_attempts,emailLastError:row.email_last_error,createdAt:row.ticket_created_at.toISOString(),createdBy:row.created_by_display_name,createdByRole:row.created_by_role,declaredAmount:row.declared_amount===null?null:Number(row.declared_amount),transferDate:row.transfer_date,transferReference:row.transfer_reference,organization:row.organization,reason:row.reason,notes:row.notes};
}
