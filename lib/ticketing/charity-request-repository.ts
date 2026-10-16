import {randomBytes,randomUUID} from "node:crypto";
import type {PoolClient} from "pg";
import type {CharityParticipationInput} from "@/lib/ticketing/charity-request-input";
import {query,withTransaction} from "@/lib/ticketing/db";
import {createManualIssuance,type ManualIssuanceResult} from "@/lib/ticketing/manual-repository";
import {
  normalizeDonationReference,
  normalizeIdentityEmail,
  normalizeIdentityPhone,
  participantsOverlap,
  requestDedupeKeys,
  sameParticipants,
  strongContactMatch,
  type ParticipantIdentity,
} from "@/lib/ticketing/participant-identity";
import {hasTicketCapacity} from "@/lib/ticketing/rules";
import {formatPersonNamePart} from "@/lib/ticketing/name-format";
import type {StaffSession} from "@/lib/ticketing/staff-auth";

export type CharityRequestStatus="PENDING_DONATION"|"VERIFIED"|"TICKETS_ISSUED"|"CANCELLED";
export type CharityRequestParticipant={firstName:string;lastName:string;position:number};
export type CharityRequest={
  id:string;
  requestCode:string;
  firstName:string;
  lastName:string;
  email:string;
  phone:string|null;
  quantity:number;
  expectedAmount:number;
  currency:"EUR";
  status:CharityRequestStatus;
  participants:CharityRequestParticipant[];
  createdAt:string;
  verifiedAt:string|null;
  verifiedBy:string|null;
  possibleDuplicate:boolean;
  duplicateReason:string|null;
};

type CharityRow={
  id:string;
  event_id:string;
  invitation_id:string;
  request_code:string;
  first_name:string;
  last_name:string;
  email:string;
  phone:string|null;
  quantity:number;
  expected_amount:string;
  currency:"EUR";
  status:CharityRequestStatus;
  created_at:Date;
  verified_at:Date|null;
  verified_by_display_name:string|null;
  manual_issuance_id:string|null;
  duplicate_review_required:boolean;
  duplicate_review_reason:string|null;
  verified_paypal_reference:string|null;
};
type ParticipantRow={first_name:string;last_name:string;position:number};
type TicketIdentityRow={first_name:string;last_name:string;email:string;phone:string|null};

export class DuplicateCharityRequestError extends Error{
  constructor(){super("Risulta già una richiesta di partecipazione per questi dati. Non è necessario ripetere la procedura.");this.name="DuplicateCharityRequestError";}
}

const mapParticipants=(rows:ParticipantRow[])=>rows.map(row=>({firstName:row.first_name,lastName:row.last_name,position:row.position}));
const mapRequest=(row:CharityRow,participants:CharityRequestParticipant[]):CharityRequest=>({
  id:row.id,
  requestCode:row.request_code,
  firstName:row.first_name,
  lastName:row.last_name,
  email:row.email,
  phone:row.phone,
  quantity:row.quantity,
  expectedAmount:Number(row.expected_amount),
  currency:row.currency,
  status:row.status,
  participants,
  createdAt:row.created_at.toISOString(),
  verifiedAt:row.verified_at?.toISOString()??null,
  verifiedBy:row.verified_by_display_name,
  possibleDuplicate:Boolean(row.duplicate_review_required),
  duplicateReason:row.duplicate_review_reason??null,
});
const generateRequestCode=()=>`NIS-REQ-${randomBytes(4).toString("hex").toUpperCase()}`;
const participantsSql="SELECT first_name,last_name,position FROM ticketing_charity_request_participants WHERE request_id=$1 ORDER BY position";
async function participantsForRequestClient(client:PoolClient,requestId:string){const result=await client.query<ParticipantRow>(participantsSql,[requestId]);return mapParticipants(result.rows);}
async function participantsForRequest(requestId:string){const result=await query<ParticipantRow>(participantsSql,[requestId]);return mapParticipants(result.rows);}
async function committedSeatCount(client:PoolClient,eventId:string){const result=await client.query<{count:string}>(`SELECT ((SELECT COUNT(*) FROM ticketing_tickets WHERE event_id=$1 AND (order_id IS NOT NULL OR manual_issuance_id IS NOT NULL) AND status IN ('ACTIVE','USED')) + COALESCE((SELECT SUM(CASE WHEN allocation.status='ACTIVE' THEN allocation.allocated_quantity ELSE (SELECT COUNT(*) FROM ticketing_tickets ticket WHERE ticket.partner_allocation_id=allocation.id AND ticket.status IN ('ACTIVE','USED')) END) FROM ticketing_partner_allocations allocation WHERE allocation.event_id=$1),0))::text AS count`,[eventId]);return Number(result.rows[0].count);}
async function reservedSeatCount(client:PoolClient,eventId:string){const result=await client.query<{count:string}>("SELECT COUNT(*)::text AS count FROM ticketing_order_participants participant JOIN ticketing_orders orders ON orders.id=participant.order_id WHERE orders.event_id=$1 AND orders.payment_status='PENDING' AND orders.created_at>=NOW()-INTERVAL '30 minutes'",[eventId]);return Number(result.rows[0].count);}

function contactsSimilar(first:{email:string;phone?:string|null},second:{email:string;phone?:string|null}){
  const sameEmail=normalizeIdentityEmail(first.email)===normalizeIdentityEmail(second.email);
  const firstPhone=normalizeIdentityPhone(first.phone);
  const secondPhone=normalizeIdentityPhone(second.phone);
  return sameEmail||Boolean(firstPhone&&secondPhone&&firstPhone===secondPhone);
}

async function duplicateAnalysis(client:PoolClient,eventId:string,input:CharityParticipationInput){
  let possibleDuplicate=false;
  const activeRequests=await client.query<CharityRow>("SELECT * FROM ticketing_charity_requests WHERE event_id=$1 AND status IN ('PENDING_DONATION','VERIFIED') ORDER BY created_at DESC",[eventId]);
  for(const existing of activeRequests.rows){
    const existingParticipants=await participantsForRequestClient(client,existing.id);
    if(sameParticipants(input.participants,existingParticipants)&&strongContactMatch(input,existing))throw new DuplicateCharityRequestError();
    if(sameParticipants(input.participants,existingParticipants)||participantsOverlap(input.participants,existingParticipants)||contactsSimilar(input,existing))possibleDuplicate=true;
  }

  const tickets=await client.query<TicketIdentityRow>("SELECT attendee.first_name,attendee.last_name,attendee.email,attendee.phone FROM ticketing_tickets ticket JOIN ticketing_attendees attendee ON attendee.id=ticket.attendee_id WHERE ticket.event_id=$1 AND ticket.status IN ('ACTIVE','USED')",[eventId]);
  for(const participant of input.participants){
    for(const ticket of tickets.rows){
      const ticketParticipant:ParticipantIdentity={firstName:ticket.first_name,lastName:ticket.last_name};
      if(sameParticipants([participant],[ticketParticipant])&&strongContactMatch(input,ticket))throw new DuplicateCharityRequestError();
      if(sameParticipants([participant],[ticketParticipant]))possibleDuplicate=true;
    }
  }
  return possibleDuplicate;
}

function isDedupeUniqueViolation(error:unknown){
  if(!error||typeof error!=="object")return false;
  const value=error as {code?:unknown;constraint?:unknown};
  return value.code==="23505"&&typeof value.constraint==="string"&&value.constraint.includes("dedupe");
}

export async function createCharityParticipationRequest(eventSlug:string,publicSlug:string,input:CharityParticipationInput){
  input={...input,firstName:formatPersonNamePart(input.firstName),lastName:formatPersonNamePart(input.lastName),participants:input.participants.map(participant=>({firstName:formatPersonNamePart(participant.firstName),lastName:formatPersonNamePart(participant.lastName)}))};
  try{
    return await withTransaction(async client=>{
      await client.query("SELECT pg_advisory_xact_lock(hashtext($1))",[input.requestId]);
      const existing=await client.query<CharityRow>("SELECT * FROM ticketing_charity_requests WHERE request_id=$1",[input.requestId]);
      if(existing.rows[0])return {request:mapRequest(existing.rows[0],await participantsForRequestClient(client,existing.rows[0].id)),created:false};

      const eventResult=await client.query<{id:string;price:string;currency:"EUR";capacity:number|null;status:string}>("SELECT id,price,currency,capacity,status FROM ticketing_events WHERE slug=$1 FOR UPDATE",[eventSlug]);
      const event=eventResult.rows[0];
      if(!event||["CANCELLED","COMPLETED","SOLD_OUT"].includes(event.status))throw new Error("Evento non disponibile.");
      const invitationResult=await client.query<{id:string}>("SELECT id FROM ticketing_invitations WHERE event_id=$1 AND public_slug=$2 AND status='ACTIVE' AND (expires_at IS NULL OR expires_at>NOW()) AND used_count<max_uses",[event.id,publicSlug]);
      const invitation=invitationResult.rows[0];
      if(!invitation)throw new Error("Invito non disponibile.");

      const dedupeKeys=requestDedupeKeys(event.id,input.participants,input.email,input.phone);
      for(const key of [dedupeKeys.emailKey,dedupeKeys.phoneKey].filter((value):value is string=>Boolean(value)).sort())await client.query("SELECT pg_advisory_xact_lock(hashtext($1))",[key]);
      const possibleDuplicate=await duplicateAnalysis(client,event.id,input);
      const [committed,reserved]=await Promise.all([committedSeatCount(client,event.id),reservedSeatCount(client,event.id)]);
      if(!hasTicketCapacity(event.capacity,committed,input.quantity,reserved))throw new Error("Posti insufficienti.");

      const id=randomUUID();
      const expectedAmount=Number(event.price)*input.quantity;
      const requestCode=generateRequestCode();
      const duplicateReason=possibleDuplicate?"Contatti o nominativi simili a richieste o biglietti già presenti.":null;
      const inserted=await client.query<CharityRow>("INSERT INTO ticketing_charity_requests(id,event_id,invitation_id,request_id,request_code,first_name,last_name,email,phone,quantity,expected_amount,currency,status,privacy_accepted_at,dedupe_email_key,dedupe_phone_key,duplicate_review_required,duplicate_review_reason) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'PENDING_DONATION',NOW(),$13,$14,$15,$16) RETURNING *",[id,event.id,invitation.id,input.requestId,requestCode,input.firstName,input.lastName,input.email,input.phone,input.quantity,expectedAmount.toFixed(2),event.currency,dedupeKeys.emailKey,dedupeKeys.phoneKey,possibleDuplicate,duplicateReason]);
      for(const [index,participant] of input.participants.entries())await client.query("INSERT INTO ticketing_charity_request_participants(id,request_id,position,first_name,last_name) VALUES($1,$2,$3,$4,$5)",[randomUUID(),id,index+1,participant.firstName,participant.lastName]);
      return {request:mapRequest(inserted.rows[0],input.participants.map((participant,index)=>({...participant,position:index+1}))),created:true};
    });
  }catch(error){
    if(error instanceof DuplicateCharityRequestError||isDedupeUniqueViolation(error))throw new DuplicateCharityRequestError();
    throw error;
  }
}

export async function listPendingCharityRequests(eventSlug:string){const result=await query<CharityRow>("SELECT request.* FROM ticketing_charity_requests request JOIN ticketing_events event ON event.id=request.event_id WHERE event.slug=$1 AND request.status IN ('PENDING_DONATION','VERIFIED') ORDER BY request.created_at ASC",[eventSlug]);return Promise.all(result.rows.map(async row=>mapRequest(row,await participantsForRequest(row.id))));}

export async function markCharityAdminEmailSent(id:string){await query("UPDATE ticketing_charity_requests SET admin_email_attempted_at=NOW(),admin_email_sent_at=NOW(),admin_email_last_error=NULL,updated_at=NOW() WHERE id=$1",[id]);}
export async function markCharityAdminEmailFailed(id:string,error:string){await query("UPDATE ticketing_charity_requests SET admin_email_attempted_at=NOW(),admin_email_last_error=$2,updated_at=NOW() WHERE id=$1",[id,error.slice(0,500)]);}
export async function claimCharityRequesterEmail(id:string){const result=await query<{id:string}>("UPDATE ticketing_charity_requests SET requester_email_attempted_at=NOW(),requester_email_send_attempts=requester_email_send_attempts+1,requester_email_last_error=NULL,updated_at=NOW() WHERE id=$1 AND requester_email_attempted_at IS NULL AND requester_email_sent_at IS NULL RETURNING id",[id]);return Boolean(result.rowCount);}
export async function markCharityRequesterEmailSent(id:string){await query("UPDATE ticketing_charity_requests SET requester_email_sent_at=NOW(),requester_email_last_error=NULL,updated_at=NOW() WHERE id=$1",[id]);}
export async function markCharityRequesterEmailFailed(id:string,error:string){await query("UPDATE ticketing_charity_requests SET requester_email_last_error=$2,updated_at=NOW() WHERE id=$1",[id,error.replace(/[\u0000-\u001f\u007f]+/g," ").slice(0,1000)]);}

async function claimCharityRequest(id:string,session:StaffSession,paypalReference:string){
  return withTransaction(async client=>{
    const result=await client.query<CharityRow>("SELECT * FROM ticketing_charity_requests WHERE id=$1 FOR UPDATE",[id]);
    const row=result.rows[0];
    if(!row)throw new Error("Richiesta non trovata.");
    if(row.status==="CANCELLED")throw new Error("Richiesta annullata.");
    const normalizedReference=normalizeDonationReference(paypalReference);
    if(row.verified_paypal_reference&&normalizeDonationReference(row.verified_paypal_reference)!==normalizedReference)throw new Error("La richiesta risulta associata a un altro riferimento PayPal.");
    if(row.status==="TICKETS_ISSUED")return row;
    const referenceOwner=await client.query<{id:string}>("SELECT id FROM ticketing_charity_requests WHERE id<>$1 AND verified_paypal_reference IS NOT NULL AND UPPER(REGEXP_REPLACE(BTRIM(verified_paypal_reference),'\\s+','','g'))=$2 LIMIT 1",[id,normalizedReference]);
    if(referenceOwner.rows[0])throw new Error("Questo riferimento PayPal è già associato a un'altra richiesta.");
    if(row.status==="PENDING_DONATION"){
      const claimed=await client.query<CharityRow>("UPDATE ticketing_charity_requests SET status='VERIFIED',verified_paypal_reference=$2,verified_at=NOW(),verified_by_staff_id=$3,verified_by_display_name=$4,verified_session_id=$5,updated_at=NOW() WHERE id=$1 RETURNING *",[id,normalizedReference,session.operatorId,session.displayName,session.sessionId]);
      return claimed.rows[0];
    }
    if(!row.verified_paypal_reference){const updated=await client.query<CharityRow>("UPDATE ticketing_charity_requests SET verified_paypal_reference=$2,updated_at=NOW() WHERE id=$1 RETURNING *",[id,normalizedReference]);return updated.rows[0];}
    return row;
  });
}

export async function issueCharityRequest(id:string,session:StaffSession,paypalReference:string):Promise<ManualIssuanceResult>{
  const normalizedReference=normalizeDonationReference(paypalReference);
  if(normalizedReference.length<4||normalizedReference.length>120)throw new Error("Inserisci un riferimento PayPal valido.");
  const request=await claimCharityRequest(id,session,normalizedReference);
  try{
    const participants=await participantsForRequest(request.id);
    if(participants.length!==request.quantity)throw new Error("Nominativi della richiesta incompleti.");
    const result=await createManualIssuance("nis-gala-2026",`charity-request-${request.id}`,{source:"PAYPAL_CHARITY",firstName:request.first_name,lastName:request.last_name,email:request.email,phone:request.phone??undefined,quantity:request.quantity,participants:participants.map(participant=>({firstName:participant.firstName,lastName:participant.lastName})),declaredAmount:Number(request.expected_amount),donationDate:null,paypalReference:normalizedReference,notes:`Richiesta pubblica PayPal Charity ${request.request_code} verificata.`},session);
    await query("UPDATE ticketing_charity_requests SET status='TICKETS_ISSUED',manual_issuance_id=$2,issued_at=NOW(),updated_at=NOW() WHERE id=$1 AND status='VERIFIED'",[id,result.issuanceId]);
    return result;
  }catch(error){
    await query("UPDATE ticketing_charity_requests SET status='PENDING_DONATION',verified_paypal_reference=NULL,updated_at=NOW() WHERE id=$1 AND status='VERIFIED' AND manual_issuance_id IS NULL",[id]);
    throw error;
  }
}

export async function cancelCharityRequest(id:string,session:StaffSession){const result=await query("UPDATE ticketing_charity_requests SET status='CANCELLED',cancelled_at=NOW(),cancelled_by_staff_id=$2,cancelled_by_display_name=$3,cancelled_session_id=$4,updated_at=NOW() WHERE id=$1 AND status='PENDING_DONATION' RETURNING id",[id,session.operatorId,session.displayName,session.sessionId]);if(!result.rows[0])throw new Error("Richiesta non annullabile.");}
