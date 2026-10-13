import {randomBytes,randomUUID} from "node:crypto";
import type {PoolClient} from "pg";
import type {CharityParticipationInput} from "@/lib/ticketing/charity-request-input";
import {query,withTransaction} from "@/lib/ticketing/db";
import {createManualIssuance,type ManualIssuanceResult} from "@/lib/ticketing/manual-repository";
import {hasTicketCapacity} from "@/lib/ticketing/rules";
import type {StaffSession} from "@/lib/ticketing/staff-auth";

export type CharityRequestStatus="PENDING_DONATION"|"VERIFIED"|"TICKETS_ISSUED"|"CANCELLED";
export type CharityRequestParticipant={firstName:string;lastName:string;position:number};
export type CharityRequest={id:string;requestCode:string;firstName:string;lastName:string;email:string;phone:string|null;quantity:number;expectedAmount:number;currency:"EUR";status:CharityRequestStatus;participants:CharityRequestParticipant[];createdAt:string;verifiedAt:string|null;verifiedBy:string|null};
type CharityRow={id:string;event_id:string;invitation_id:string;request_code:string;first_name:string;last_name:string;email:string;phone:string|null;quantity:number;expected_amount:string;currency:"EUR";status:CharityRequestStatus;created_at:Date;verified_at:Date|null;verified_by_display_name:string|null;manual_issuance_id:string|null};
type ParticipantRow={first_name:string;last_name:string;position:number};

const mapParticipants=(rows:ParticipantRow[])=>rows.map(row=>({firstName:row.first_name,lastName:row.last_name,position:row.position}));
const mapRequest=(row:CharityRow,participants:CharityRequestParticipant[]):CharityRequest=>({id:row.id,requestCode:row.request_code,firstName:row.first_name,lastName:row.last_name,email:row.email,phone:row.phone,quantity:row.quantity,expectedAmount:Number(row.expected_amount),currency:row.currency,status:row.status,participants,createdAt:row.created_at.toISOString(),verifiedAt:row.verified_at?.toISOString()??null,verifiedBy:row.verified_by_display_name});
const generateRequestCode=()=>`NIS-REQ-${randomBytes(4).toString("hex").toUpperCase()}`;
const participantsSql="SELECT first_name,last_name,position FROM ticketing_charity_request_participants WHERE request_id=$1 ORDER BY position";
async function participantsForRequestClient(client:PoolClient,requestId:string){const result=await client.query<ParticipantRow>(participantsSql,[requestId]);return mapParticipants(result.rows);}
async function participantsForRequest(requestId:string){const result=await query<ParticipantRow>(participantsSql,[requestId]);return mapParticipants(result.rows);}
async function committedSeatCount(client:PoolClient,eventId:string){const result=await client.query<{count:string}>(`SELECT ((SELECT COUNT(*) FROM ticketing_tickets WHERE event_id=$1 AND (order_id IS NOT NULL OR manual_issuance_id IS NOT NULL) AND status IN ('ACTIVE','USED')) + COALESCE((SELECT SUM(CASE WHEN allocation.status='ACTIVE' THEN allocation.allocated_quantity ELSE (SELECT COUNT(*) FROM ticketing_tickets ticket WHERE ticket.partner_allocation_id=allocation.id AND ticket.status IN ('ACTIVE','USED')) END) FROM ticketing_partner_allocations allocation WHERE allocation.event_id=$1),0))::text AS count`,[eventId]);return Number(result.rows[0].count);}
async function reservedSeatCount(client:PoolClient,eventId:string){const result=await client.query<{count:string}>("SELECT COUNT(*)::text AS count FROM ticketing_order_participants participant JOIN ticketing_orders orders ON orders.id=participant.order_id WHERE orders.event_id=$1 AND orders.payment_status='PENDING' AND orders.created_at>=NOW()-INTERVAL '30 minutes'",[eventId]);return Number(result.rows[0].count);}

export async function createCharityParticipationRequest(eventSlug:string,publicSlug:string,input:CharityParticipationInput){
  return withTransaction(async client=>{
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))",[input.requestId]);
    const existing=await client.query<CharityRow>("SELECT * FROM ticketing_charity_requests WHERE request_id=$1",[input.requestId]);if(existing.rows[0])return {request:mapRequest(existing.rows[0],await participantsForRequestClient(client,existing.rows[0].id)),created:false};
    const eventResult=await client.query<{id:string;price:string;currency:"EUR";capacity:number|null;status:string}>("SELECT id,price,currency,capacity,status FROM ticketing_events WHERE slug=$1 FOR UPDATE",[eventSlug]);const event=eventResult.rows[0];if(!event||["CANCELLED","COMPLETED","SOLD_OUT"].includes(event.status))throw new Error("Evento non disponibile.");
    const invitationResult=await client.query<{id:string}>("SELECT id FROM ticketing_invitations WHERE event_id=$1 AND public_slug=$2 AND status='ACTIVE' AND (expires_at IS NULL OR expires_at>NOW()) AND used_count<max_uses",[event.id,publicSlug]);const invitation=invitationResult.rows[0];if(!invitation)throw new Error("Invito non disponibile.");
    const [committed,reserved]=await Promise.all([committedSeatCount(client,event.id),reservedSeatCount(client,event.id)]);if(!hasTicketCapacity(event.capacity,committed,input.quantity,reserved))throw new Error("Posti insufficienti.");
    const id=randomUUID();const expectedAmount=Number(event.price)*input.quantity;const requestCode=generateRequestCode();
    const inserted=await client.query<CharityRow>("INSERT INTO ticketing_charity_requests(id,event_id,invitation_id,request_id,request_code,first_name,last_name,email,phone,quantity,expected_amount,currency,status,privacy_accepted_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'PENDING_DONATION',NOW()) RETURNING *",[id,event.id,invitation.id,input.requestId,requestCode,input.firstName,input.lastName,input.email,input.phone,input.quantity,expectedAmount.toFixed(2),event.currency]);
    for(const [index,participant] of input.participants.entries())await client.query("INSERT INTO ticketing_charity_request_participants(id,request_id,position,first_name,last_name) VALUES($1,$2,$3,$4,$5)",[randomUUID(),id,index+1,participant.firstName,participant.lastName]);
    return {request:mapRequest(inserted.rows[0],input.participants.map((participant,index)=>({...participant,position:index+1}))),created:true};
  });
}

export async function listPendingCharityRequests(eventSlug:string){const result=await query<CharityRow>("SELECT request.* FROM ticketing_charity_requests request JOIN ticketing_events event ON event.id=request.event_id WHERE event.slug=$1 AND request.status IN ('PENDING_DONATION','VERIFIED') ORDER BY request.created_at ASC",[eventSlug]);return Promise.all(result.rows.map(async row=>mapRequest(row,await participantsForRequest(row.id))));}

export async function markCharityAdminEmailSent(id:string){await query("UPDATE ticketing_charity_requests SET admin_email_attempted_at=NOW(),admin_email_sent_at=NOW(),admin_email_last_error=NULL,updated_at=NOW() WHERE id=$1",[id]);}
export async function markCharityAdminEmailFailed(id:string,error:string){await query("UPDATE ticketing_charity_requests SET admin_email_attempted_at=NOW(),admin_email_last_error=$2,updated_at=NOW() WHERE id=$1",[id,error.slice(0,500)]);}

async function claimCharityRequest(id:string,session:StaffSession){return withTransaction(async client=>{const result=await client.query<CharityRow>("SELECT * FROM ticketing_charity_requests WHERE id=$1 FOR UPDATE",[id]);const row=result.rows[0];if(!row)throw new Error("Richiesta non trovata.");if(row.status==="CANCELLED")throw new Error("Richiesta annullata.");if(row.status==="TICKETS_ISSUED")return row;if(row.status==="PENDING_DONATION"){const claimed=await client.query<CharityRow>("UPDATE ticketing_charity_requests SET status='VERIFIED',verified_at=NOW(),verified_by_staff_id=$2,verified_by_display_name=$3,verified_session_id=$4,updated_at=NOW() WHERE id=$1 RETURNING *",[id,session.operatorId,session.displayName,session.sessionId]);return claimed.rows[0];}return row;});}

export async function issueCharityRequest(id:string,session:StaffSession):Promise<ManualIssuanceResult>{
  const request=await claimCharityRequest(id,session);
  try{
    const participants=await participantsForRequest(request.id);if(participants.length!==request.quantity)throw new Error("Nominativi della richiesta incompleti.");
    const result=await createManualIssuance("nis-gala-2026",`charity-request-${request.id}`,{source:"PAYPAL_CHARITY",firstName:request.first_name,lastName:request.last_name,email:request.email,phone:request.phone??undefined,quantity:request.quantity,participants:participants.map(participant=>({firstName:participant.firstName,lastName:participant.lastName})),declaredAmount:Number(request.expected_amount),donationDate:null,paypalReference:request.request_code,notes:`Richiesta pubblica PayPal Charity ${request.request_code} verificata.`},session);
    await query("UPDATE ticketing_charity_requests SET status='TICKETS_ISSUED',manual_issuance_id=$2,issued_at=NOW(),updated_at=NOW() WHERE id=$1 AND status='VERIFIED'",[id,result.issuanceId]);return result;
  }catch(error){await query("UPDATE ticketing_charity_requests SET status='PENDING_DONATION',updated_at=NOW() WHERE id=$1 AND status='VERIFIED' AND manual_issuance_id IS NULL",[id]);throw error;}
}

export async function cancelCharityRequest(id:string,session:StaffSession){const result=await query("UPDATE ticketing_charity_requests SET status='CANCELLED',cancelled_at=NOW(),cancelled_by_staff_id=$2,cancelled_by_display_name=$3,cancelled_session_id=$4,updated_at=NOW() WHERE id=$1 AND status='PENDING_DONATION' RETURNING id",[id,session.operatorId,session.displayName,session.sessionId]);if(!result.rows[0])throw new Error("Richiesta non annullabile.");}
