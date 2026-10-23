import {randomUUID} from "node:crypto";
import type {PoolClient} from "pg";
import {withTransaction} from "@/lib/ticketing/db";
import type {StaffSession} from "@/lib/ticketing/staff-auth";
import {normalizeTicketCancellationReason} from "@/lib/ticketing/ticket-cancellation";

type TicketAdminRow={id:string;event_id:string;attendee_id:string;order_id:string|null;partner_allocation_id:string|null;manual_issuance_id:string|null;ticket_code:string;issuance_source:string;status:"ACTIVE"|"USED"|"CANCELLED"|"REFUNDED";first_name:string;last_name:string};
export type TicketAdminResult="CANCELLED"|"DELETED"|"NOT_FOUND"|"ALREADY_CANCELLED"|"CHECKIN_ACTIVE"|"NOT_ALLOWED"|"FORBIDDEN";

const validReason=(reason:string)=>reason.trim().length>=3&&reason.trim().length<=500;
async function lockedTicket(client:PoolClient,ticketCode:string){const result=await client.query<TicketAdminRow>("SELECT ticket.id,ticket.event_id,ticket.attendee_id,ticket.order_id,ticket.partner_allocation_id,ticket.manual_issuance_id,ticket.ticket_code,ticket.issuance_source,ticket.status,attendee.first_name,attendee.last_name FROM ticketing_tickets ticket JOIN ticketing_attendees attendee ON attendee.id=ticket.attendee_id WHERE ticket.ticket_code=$1 FOR UPDATE OF ticket",[ticketCode]);return result.rows[0]??null;}
async function hasActiveCheckIn(client:PoolClient,ticketId:string){const result=await client.query("SELECT 1 FROM ticketing_check_ins WHERE ticket_id=$1 AND result='ALLOWED' AND status='ACTIVE' LIMIT 1",[ticketId]);return Boolean(result.rows[0]);}
async function reopenSoldOutEvent(client:PoolClient,eventId:string){await client.query("UPDATE ticketing_events SET status='ANNOUNCED',updated_at=NOW() WHERE id=$1 AND status='SOLD_OUT'",[eventId]);}

export async function cancelTicket(ticketCode:string,reason:string,session:StaffSession):Promise<TicketAdminResult>{
  if(session.role!=="SUPERADMIN")return "FORBIDDEN";const normalizedReason=normalizeTicketCancellationReason(reason);if(!normalizedReason)return "NOT_ALLOWED";
  return withTransaction(async client=>{const ticket=await lockedTicket(client,ticketCode);if(!ticket)return "NOT_FOUND";if(ticket.status==="CANCELLED")return "ALREADY_CANCELLED";if(ticket.status!=="ACTIVE"||await hasActiveCheckIn(client,ticket.id))return "CHECKIN_ACTIVE";
    await client.query("INSERT INTO ticketing_ticket_cancellation_audit(id,event_id,ticket_id,ticket_code,holder_name,source,previous_status,cancelled_by_staff_id,cancelled_by_display_name,cancelled_by_role,session_id,cancellation_reason) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)",[randomUUID(),ticket.event_id,ticket.id,ticket.ticket_code,`${ticket.first_name} ${ticket.last_name}`,ticket.issuance_source,ticket.status,session.operatorId,session.displayName,session.role,session.sessionId,normalizedReason]);
    await client.query("UPDATE ticketing_tickets SET status='CANCELLED',updated_at=NOW() WHERE id=$1",[ticket.id]);if(!ticket.partner_allocation_id)await reopenSoldOutEvent(client,ticket.event_id);return "CANCELLED";});
}

export async function deleteTicketPermanently(ticketCode:string,confirmationCode:string,reason:string,session:StaffSession):Promise<TicketAdminResult>{
  if(session.role!=="SUPERADMIN")return "FORBIDDEN";if(ticketCode!==confirmationCode||!validReason(reason))return "NOT_ALLOWED";
  return withTransaction(async client=>{const ticket=await lockedTicket(client,ticketCode);if(!ticket)return "NOT_FOUND";if(ticket.partner_allocation_id)return "NOT_ALLOWED";if(ticket.status==="USED"||await hasActiveCheckIn(client,ticket.id))return "CHECKIN_ACTIVE";
    await client.query("INSERT INTO ticketing_ticket_deletion_audit(id,event_id,ticket_id,ticket_code,holder_name,source,previous_status,deleted_by_staff_id,deleted_by_display_name,deleted_by_role,session_id,deletion_reason) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)",[randomUUID(),ticket.event_id,ticket.id,ticket.ticket_code,`${ticket.first_name} ${ticket.last_name}`,ticket.issuance_source,ticket.status,session.operatorId,session.displayName,session.role,session.sessionId,reason.trim()]);
    await client.query("DELETE FROM ticketing_check_ins WHERE ticket_id=$1",[ticket.id]);await client.query("DELETE FROM ticketing_tickets WHERE id=$1",[ticket.id]);
    if(ticket.manual_issuance_id){const remaining=await client.query("SELECT 1 FROM ticketing_tickets WHERE manual_issuance_id=$1 LIMIT 1",[ticket.manual_issuance_id]);if(!remaining.rows[0]){await client.query("UPDATE ticketing_charity_requests SET status='CANCELLED',manual_issuance_id=NULL,cancelled_at=COALESCE(cancelled_at,NOW()),cancelled_by_staff_id=COALESCE(cancelled_by_staff_id,$2),cancelled_by_display_name=COALESCE(cancelled_by_display_name,$3),cancelled_session_id=COALESCE(cancelled_session_id,$4),updated_at=NOW() WHERE manual_issuance_id=$1",[ticket.manual_issuance_id,session.operatorId,session.displayName,session.sessionId]);await client.query("DELETE FROM ticketing_manual_issuances WHERE id=$1",[ticket.manual_issuance_id]);}}
    if(ticket.order_id){const remaining=await client.query("SELECT 1 FROM ticketing_tickets WHERE order_id=$1 LIMIT 1",[ticket.order_id]);if(!remaining.rows[0]){const order=await client.query<{invitation_id:string}>("SELECT invitation_id FROM ticketing_orders WHERE id=$1 FOR UPDATE",[ticket.order_id]);await client.query("DELETE FROM ticketing_order_participants WHERE order_id=$1",[ticket.order_id]);await client.query("DELETE FROM ticketing_orders WHERE id=$1",[ticket.order_id]);if(order.rows[0])await client.query("UPDATE ticketing_invitations SET used_count=GREATEST(0,used_count-1),updated_at=NOW() WHERE id=$1",[order.rows[0].invitation_id]);}}
    await client.query("DELETE FROM ticketing_attendees attendee WHERE attendee.id=$1 AND NOT EXISTS (SELECT 1 FROM ticketing_tickets WHERE attendee_id=attendee.id) AND NOT EXISTS (SELECT 1 FROM ticketing_orders WHERE attendee_id=attendee.id) AND NOT EXISTS (SELECT 1 FROM ticketing_order_participants WHERE attendee_id=attendee.id)",[ticket.attendee_id]);await reopenSoldOutEvent(client,ticket.event_id);return "DELETED";});
}

export const ticketAdminValidation={validReason};
