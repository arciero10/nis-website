import {randomUUID} from "node:crypto";
import type {PoolClient,QueryResultRow} from "pg";
import {query,withTransaction} from "@/lib/ticketing/db";
import {hashInvitationAccessToken} from "@/lib/ticketing/invitations";
import {checkInEligibility,invitationBlockReason,orderAmountForQuantity,ticketsToIssue} from "@/lib/ticketing/rules";
import {generateQrToken,generateTicketCode} from "@/lib/ticketing/security";
import type {Attendee,CheckIn,Event,Invitation,Order,OrderParticipant,Ticket,TicketLookup} from "@/types/ticketing";

type EventRow=QueryResultRow&{id:string;slug:string;title:string;description:string;location:string|null;event_date:Date|null;doors_open_at:Date|null;price:string;currency:"EUR";capacity:number|null;status:Event["status"];created_at:Date;updated_at:Date};
type InvitationRow=QueryResultRow&{id:string;event_id:string;access_token_hash:string;public_slug:string|null;label:string;max_uses:number;used_count:number;expires_at:Date|null;status:Invitation["status"];created_at:Date;updated_at:Date};
type AttendeeRow=QueryResultRow&{id:string;event_id:string;first_name:string;last_name:string;email:string;phone:string|null;company:string|null;created_at:Date;updated_at:Date};
type OrderRow=QueryResultRow&{id:string;event_id:string;attendee_id:string|null;invitation_id:string;request_id:string;provider:"PAYPAL";provider_order_id:string|null;provider_capture_id:string|null;amount:string;currency:"EUR";payment_status:Order["paymentStatus"];created_at:Date;updated_at:Date;paid_at:Date|null};
type ParticipantRow=QueryResultRow&{id:string;order_id:string;attendee_id:string|null;position:number;first_name:string;last_name:string;email:string;phone:string|null;company:string|null;created_at:Date};
type TicketRow=QueryResultRow&{id:string;event_id:string;attendee_id:string;order_id:string;ticket_code:string;qr_token:string;category:Ticket["category"];access_mode:Ticket["accessMode"];status:Ticket["status"];created_at:Date;updated_at:Date;first_check_in_at:Date|null;last_check_in_at:Date|null};
type CheckInTicketRow=TicketRow&{first_name:string;last_name:string;event_status:Event["status"];payment_status:Order["paymentStatus"]};

export type AttendeeInput={firstName:string;lastName:string;email:string;phone?:string;company?:string};
export type InvitationCredential={accessToken:string;publicSlug?:never}|{accessToken?:never;publicSlug:string};
export type CheckoutRecord={event:Event;invitation:Invitation;participants:OrderParticipant[];order:Order};
export type TicketConfirmation={event:Event;attendees:Attendee[];order:Order;tickets:Ticket[]};
export type StaffCheckInResponse={status:"AUTHORIZED"|"ALREADY_USED";firstName:string;lastName:string;ticketCode:string;category:Ticket["category"];checkedInAt:string}|{status:"INVALID"};
export type StaffTicketSearchResult={firstName:string;lastName:string;ticketCode:string;category:Ticket["category"];status:"VALID"|"USED";checkedInAt:string|null};
export type StaffIngressEntry={firstName:string;lastName:string;ticketCode:string;category:Ticket["category"];checkedInAt:string};
export type StaffIngressDashboard={totalIssued:number;totalCheckedIn:number;totalPending:number;entries:StaffIngressEntry[]};

export class TicketingConflictError extends Error{
  constructor(public code:"INVITATION_UNAVAILABLE"|"SOLD_OUT"|"PAYMENT_MISMATCH"|"INVALID_QUANTITY",message:string){super(message);this.name="TicketingConflictError";}
}

const iso=(value:Date|null)=>value?.toISOString()??null;
const mapEvent=(r:EventRow):Event=>({id:r.id,slug:r.slug,title:r.title,description:r.description,location:r.location,eventDate:iso(r.event_date),doorsOpenAt:iso(r.doors_open_at),price:Number(r.price),currency:r.currency,capacity:r.capacity,status:r.status,createdAt:r.created_at.toISOString(),updatedAt:r.updated_at.toISOString()});
const mapInvitation=(r:InvitationRow):Invitation=>({id:r.id,eventId:r.event_id,accessTokenHash:r.access_token_hash,publicSlug:r.public_slug,label:r.label,maxUses:r.max_uses,usedCount:r.used_count,expiresAt:iso(r.expires_at),status:r.status,createdAt:r.created_at.toISOString(),updatedAt:r.updated_at.toISOString()});
const mapAttendee=(r:AttendeeRow):Attendee=>({id:r.id,eventId:r.event_id,firstName:r.first_name,lastName:r.last_name,email:r.email,phone:r.phone??undefined,company:r.company??undefined,createdAt:r.created_at.toISOString(),updatedAt:r.updated_at.toISOString()});
const mapOrder=(r:OrderRow):Order=>({id:r.id,eventId:r.event_id,attendeeId:r.attendee_id,invitationId:r.invitation_id,requestId:r.request_id,provider:r.provider,providerOrderId:r.provider_order_id,providerCaptureId:r.provider_capture_id,amount:Number(r.amount),currency:r.currency,paymentStatus:r.payment_status,createdAt:r.created_at.toISOString(),updatedAt:r.updated_at.toISOString(),paidAt:iso(r.paid_at)});
const mapParticipant=(r:ParticipantRow):OrderParticipant=>({id:r.id,orderId:r.order_id,attendeeId:r.attendee_id,position:r.position,firstName:r.first_name,lastName:r.last_name,email:r.email,phone:r.phone??undefined,company:r.company??undefined,createdAt:r.created_at.toISOString()});
const mapTicket=(r:TicketRow):Ticket=>({id:r.id,eventId:r.event_id,attendeeId:r.attendee_id,orderId:r.order_id,ticketCode:r.ticket_code,qrToken:r.qr_token,category:r.category,accessMode:r.access_mode,status:r.status,createdAt:r.created_at.toISOString(),updatedAt:r.updated_at.toISOString(),firstCheckInAt:iso(r.first_check_in_at),lastCheckInAt:iso(r.last_check_in_at)});

async function getEvent(client:PoolClient,id:string,lock=false){const result=await client.query<EventRow>(`SELECT * FROM ticketing_events WHERE id=$1${lock?" FOR UPDATE":""}`,[id]);return result.rows[0]?mapEvent(result.rows[0]):null;}
async function getInvitation(client:PoolClient,id:string,lock=false){const result=await client.query<InvitationRow>(`SELECT * FROM ticketing_invitations WHERE id=$1${lock?" FOR UPDATE":""}`,[id]);return result.rows[0]?mapInvitation(result.rows[0]):null;}
async function getParticipants(client:PoolClient,orderId:string,lock=false){const result=await client.query<ParticipantRow>(`SELECT * FROM ticketing_order_participants WHERE order_id=$1 ORDER BY position${lock?" FOR UPDATE":""}`,[orderId]);return result.rows.map(mapParticipant);}
async function getTicketsByOrder(client:PoolClient,orderId:string){const result=await client.query<TicketRow>("SELECT t.* FROM ticketing_order_participants p JOIN ticketing_tickets t ON t.attendee_id=p.attendee_id AND t.order_id=p.order_id WHERE p.order_id=$1 ORDER BY p.position",[orderId]);return result.rows.map(mapTicket);}
async function getAttendeesByOrder(client:PoolClient,orderId:string){const result=await client.query<AttendeeRow>("SELECT a.* FROM ticketing_order_participants p JOIN ticketing_attendees a ON a.id=p.attendee_id WHERE p.order_id=$1 ORDER BY p.position",[orderId]);return result.rows.map(mapAttendee);}
async function activeTicketCount(client:PoolClient,eventId:string){const result=await client.query<{count:string}>("SELECT COUNT(*)::text AS count FROM ticketing_tickets WHERE event_id=$1 AND status IN ('ACTIVE','USED')",[eventId]);return Number(result.rows[0].count);}

async function loadConfirmation(client:PoolClient,order:Order):Promise<TicketConfirmation>{
  const [event,attendees,tickets]=await Promise.all([getEvent(client,order.eventId),getAttendeesByOrder(client,order.id),getTicketsByOrder(client,order.id)]);
  if(!event||attendees.length!==tickets.length||tickets.length===0) throw new Error("Conferma ordine incompleta nel database.");
  return {event,attendees,order,tickets};
}

async function performTicketCheckIn(column:"qr_token"|"ticket_code",value:string):Promise<StaffCheckInResponse>{
  return withTransaction(async client=>{
    const result=await client.query<CheckInTicketRow>(`SELECT ticket.*,attendee.first_name,attendee.last_name,event.status AS event_status,orders.payment_status FROM ticketing_tickets ticket JOIN ticketing_attendees attendee ON attendee.id=ticket.attendee_id JOIN ticketing_events event ON event.id=ticket.event_id JOIN ticketing_orders orders ON orders.id=ticket.order_id WHERE ticket.${column}=$1 FOR UPDATE OF ticket`,[value]);
    const row=result.rows[0];if(!row)return {status:"INVALID"};
    const ticket=mapTicket(row);const eligibility=checkInEligibility({ticketStatus:ticket.status,firstCheckInAt:ticket.firstCheckInAt,paymentStatus:row.payment_status,eventStatus:row.event_status});
    if(eligibility==="INVALID")return {status:"INVALID"};
    if(eligibility==="ALREADY_USED")return {status:"ALREADY_USED",firstName:row.first_name,lastName:row.last_name,ticketCode:ticket.ticketCode,category:ticket.category,checkedInAt:ticket.firstCheckInAt??ticket.lastCheckInAt??ticket.updatedAt};

    const update=await client.query<{first_check_in_at:Date}>("UPDATE ticketing_tickets SET status='USED',first_check_in_at=NOW(),last_check_in_at=NOW(),updated_at=NOW() WHERE id=$1 RETURNING first_check_in_at",[ticket.id]);const checkedInAt=update.rows[0].first_check_in_at;
    await client.query("INSERT INTO ticketing_check_ins(id,ticket_id,checked_in_at,result) VALUES($1,$2,$3,'ALLOWED')",[randomUUID(),ticket.id,checkedInAt]);
    return {status:"AUTHORIZED",firstName:row.first_name,lastName:row.last_name,ticketCode:ticket.ticketCode,category:ticket.category,checkedInAt:checkedInAt.toISOString()};
  });
}

const staffSearchPattern=(value:string)=>`%${value.replace(/[\\%_]/g,"\\$&")}%`;

export const ticketingRepository={
  async findEventBySlug(slug:string){const result=await query<EventRow>("SELECT * FROM ticketing_events WHERE slug=$1",[slug]);return result.rows[0]?mapEvent(result.rows[0]):null;},
  async findInvitationByAccessToken(accessToken:string){const result=await query<InvitationRow>("SELECT * FROM ticketing_invitations WHERE access_token_hash=$1",[hashInvitationAccessToken(accessToken)]);if(!result.rows[0])return null;const invitation=mapInvitation(result.rows[0]);return invitationBlockReason(invitation)?null:invitation;},
  async findInvitationByPublicSlug(publicSlug:string){const result=await query<InvitationRow>("SELECT * FROM ticketing_invitations WHERE public_slug=$1",[publicSlug]);if(!result.rows[0])return null;const invitation=mapInvitation(result.rows[0]);return invitationBlockReason(invitation)?null:invitation;},

  async createPendingCheckout(eventSlug:string,credential:InvitationCredential,requestId:string,inputs:AttendeeInput[]):Promise<CheckoutRecord>{
    return withTransaction(async client=>{
      const prior=await client.query<OrderRow>("SELECT * FROM ticketing_orders WHERE request_id=$1 FOR UPDATE",[requestId]);
      if(prior.rows[0]){
        const order=mapOrder(prior.rows[0]);const [event,invitation,participants]=await Promise.all([getEvent(client,order.eventId),getInvitation(client,order.invitationId),getParticipants(client,order.id)]);
        if(!event||!invitation||participants.length===0)throw new Error("Checkout incompleto nel database.");
        return {event,invitation,participants,order};
      }

      const eventResult=await client.query<EventRow>("SELECT * FROM ticketing_events WHERE slug=$1 FOR UPDATE",[eventSlug]);const eventRow=eventResult.rows[0];
      if(!eventRow)throw new TicketingConflictError("INVITATION_UNAVAILABLE","Evento non disponibile.");
      const event=mapEvent(eventRow);const amount=orderAmountForQuantity(event.price,inputs.length);
      if(amount===null)throw new TicketingConflictError("INVALID_QUANTITY","Il numero di ingressi deve essere compreso tra 1 e 10.");

      const invitationResult="accessToken" in credential&&credential.accessToken
        ?await client.query<InvitationRow>("SELECT * FROM ticketing_invitations WHERE event_id=$1 AND access_token_hash=$2 FOR UPDATE",[event.id,hashInvitationAccessToken(credential.accessToken)])
        :await client.query<InvitationRow>("SELECT * FROM ticketing_invitations WHERE event_id=$1 AND public_slug=$2 FOR UPDATE",[event.id,credential.publicSlug]);
      const invitationRow=invitationResult.rows[0];
      if(!invitationRow||invitationBlockReason(mapInvitation(invitationRow)))throw new TicketingConflictError("INVITATION_UNAVAILABLE","Invito non valido o esaurito.");
      if(event.capacity!==null&&(await activeTicketCount(client,event.id))+inputs.length>event.capacity)throw new TicketingConflictError("SOLD_OUT","Non ci sono abbastanza posti disponibili.");

      const orderResult=await client.query<OrderRow>("INSERT INTO ticketing_orders(id,event_id,attendee_id,invitation_id,request_id,provider,amount,currency,payment_status) VALUES($1,$2,NULL,$3,$4,'PAYPAL',$5,$6,'PENDING') RETURNING *",[randomUUID(),event.id,invitationRow.id,requestId,amount.toFixed(2),event.currency]);
      const order=mapOrder(orderResult.rows[0]);const participants:OrderParticipant[]=[];
      for(const [index,input] of inputs.entries()){
        const result=await client.query<ParticipantRow>("INSERT INTO ticketing_order_participants(id,order_id,position,first_name,last_name,email,phone,company) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",[randomUUID(),order.id,index+1,input.firstName,input.lastName,input.email,input.phone||null,input.company||null]);
        participants.push(mapParticipant(result.rows[0]));
      }
      return {event,invitation:mapInvitation(invitationRow),participants,order};
    });
  },

  async attachProviderOrder(orderId:string,providerOrderId:string){const result=await query<OrderRow>("UPDATE ticketing_orders SET provider_order_id=$2,updated_at=NOW() WHERE id=$1 AND (provider_order_id IS NULL OR provider_order_id=$2) RETURNING *",[orderId,providerOrderId]);if(!result.rows[0])throw new Error("Ordine PayPal già associato a un identificativo differente.");return mapOrder(result.rows[0]);},
  async markOrderFailed(orderId:string){await query("UPDATE ticketing_orders SET payment_status='FAILED',updated_at=NOW() WHERE id=$1 AND payment_status='PENDING'",[orderId]);},
  async findOrderByProviderOrderId(providerOrderId:string){const result=await query<OrderRow>("SELECT * FROM ticketing_orders WHERE provider_order_id=$1",[providerOrderId]);return result.rows[0]?mapOrder(result.rows[0]):null;},
  async findTicketsByOrderId(orderId:string){const result=await query<TicketRow>("SELECT * FROM ticketing_tickets WHERE order_id=$1 ORDER BY created_at,id",[orderId]);return result.rows.map(mapTicket);},

  async finalizePaidOrder(providerOrderId:string,captureId:string,amount:string,currency:string):Promise<TicketConfirmation>{
    return withTransaction(async client=>{
      const orderResult=await client.query<OrderRow>("SELECT * FROM ticketing_orders WHERE provider_order_id=$1 FOR UPDATE",[providerOrderId]);
      if(!orderResult.rows[0])throw new Error("Ordine interno non trovato.");
      let order=mapOrder(orderResult.rows[0]);const existingTickets=await getTicketsByOrder(client,order.id);
      if(existingTickets.length>0)return loadConfirmation(client,order);

      const [event,invitation,participants]=await Promise.all([getEvent(client,order.eventId,true),getInvitation(client,order.invitationId,true),getParticipants(client,order.id,true)]);
      if(!event||!invitation||ticketsToIssue(participants.length,existingTickets.length)===null)throw new Error("Dati ordine incompleti.");
      const expectedAmount=orderAmountForQuantity(event.price,participants.length);
      if(expectedAmount===null||currency!==order.currency||Number(amount).toFixed(2)!==expectedAmount.toFixed(2)||order.amount.toFixed(2)!==expectedAmount.toFixed(2))throw new TicketingConflictError("PAYMENT_MISMATCH","Importo o valuta PayPal non corrispondenti.");
      if(invitationBlockReason(invitation))throw new TicketingConflictError("INVITATION_UNAVAILABLE","Invito non più disponibile.");
      if(event.capacity!==null&&(await activeTicketCount(client,event.id))+participants.length>event.capacity)throw new TicketingConflictError("SOLD_OUT","Non ci sono abbastanza posti disponibili.");

      const updated=await client.query<OrderRow>("UPDATE ticketing_orders SET provider_capture_id=$2,payment_status='PAID',paid_at=NOW(),updated_at=NOW() WHERE id=$1 RETURNING *",[order.id,captureId]);order=mapOrder(updated.rows[0]);
      await client.query("UPDATE ticketing_invitations SET used_count=used_count+1,updated_at=NOW() WHERE id=$1",[invitation.id]);

      for(const participant of participants){
        let attendeeId=participant.attendeeId;
        if(!attendeeId){
          attendeeId=randomUUID();
          await client.query("INSERT INTO ticketing_attendees(id,event_id,first_name,last_name,email,phone,company) VALUES($1,$2,$3,$4,$5,$6,$7)",[attendeeId,event.id,participant.firstName,participant.lastName,participant.email,participant.phone||null,participant.company||null]);
          await client.query("UPDATE ticketing_order_participants SET attendee_id=$2 WHERE id=$1",[participant.id,attendeeId]);
        }
        await client.query("INSERT INTO ticketing_tickets(id,event_id,attendee_id,order_id,ticket_code,qr_token,category,access_mode,status) VALUES($1,$2,$3,$4,$5,$6,'STANDARD','ONE_SHOT','ACTIVE')",[randomUUID(),event.id,attendeeId,order.id,generateTicketCode(),generateQrToken()]);
        if(!order.attendeeId){const primary=await client.query<OrderRow>("UPDATE ticketing_orders SET attendee_id=$2 WHERE id=$1 RETURNING *",[order.id,attendeeId]);order=mapOrder(primary.rows[0]);}
      }
      return loadConfirmation(client,order);
    });
  },

  async findConfirmationByQrToken(qrToken:string):Promise<TicketConfirmation|null>{
    return withTransaction(async client=>{const ticketResult=await client.query<TicketRow>("SELECT * FROM ticketing_tickets WHERE qr_token=$1",[qrToken]);if(!ticketResult.rows[0])return null;const orderResult=await client.query<OrderRow>("SELECT * FROM ticketing_orders WHERE id=$1",[ticketResult.rows[0].order_id]);if(!orderResult.rows[0])return null;return loadConfirmation(client,mapOrder(orderResult.rows[0]));});
  },
  async checkInByQrToken(qrToken:string):Promise<StaffCheckInResponse>{
    return performTicketCheckIn("qr_token",qrToken);
  },
  async checkInByTicketCode(ticketCode:string):Promise<StaffCheckInResponse>{
    return performTicketCheckIn("ticket_code",ticketCode);
  },
  async searchStaffTickets(eventSlug:string,search:string):Promise<StaffTicketSearchResult[]>{
    const result=await query<{first_name:string;last_name:string;ticket_code:string;category:Ticket["category"];status:Ticket["status"];first_check_in_at:Date|null}>("SELECT attendee.first_name,attendee.last_name,ticket.ticket_code,ticket.category,ticket.status,ticket.first_check_in_at FROM ticketing_tickets ticket JOIN ticketing_attendees attendee ON attendee.id=ticket.attendee_id JOIN ticketing_events event ON event.id=ticket.event_id JOIN ticketing_orders orders ON orders.id=ticket.order_id WHERE event.slug=$1 AND orders.payment_status='PAID' AND ticket.status IN ('ACTIVE','USED') AND (attendee.first_name ILIKE $2 ESCAPE '\\' OR attendee.last_name ILIKE $2 ESCAPE '\\' OR ticket.ticket_code ILIKE $2 ESCAPE '\\') ORDER BY attendee.last_name,attendee.first_name,ticket.ticket_code LIMIT 50",[eventSlug,staffSearchPattern(search)]);
    return result.rows.map(row=>({firstName:row.first_name,lastName:row.last_name,ticketCode:row.ticket_code,category:row.category,status:row.status==="USED"?"USED":"VALID",checkedInAt:iso(row.first_check_in_at)}));
  },
  async getStaffIngressDashboard(eventSlug:string):Promise<StaffIngressDashboard>{
    const [counts,entries]=await Promise.all([
      query<{total_issued:string;total_checked_in:string;total_pending:string}>("SELECT COUNT(*) FILTER (WHERE ticket.status IN ('ACTIVE','USED'))::text AS total_issued,COUNT(*) FILTER (WHERE ticket.status='USED')::text AS total_checked_in,COUNT(*) FILTER (WHERE ticket.status='ACTIVE')::text AS total_pending FROM ticketing_tickets ticket JOIN ticketing_events event ON event.id=ticket.event_id JOIN ticketing_orders orders ON orders.id=ticket.order_id WHERE event.slug=$1 AND orders.payment_status='PAID'",[eventSlug]),
      query<{first_name:string;last_name:string;ticket_code:string;category:Ticket["category"];first_check_in_at:Date}>("SELECT attendee.first_name,attendee.last_name,ticket.ticket_code,ticket.category,ticket.first_check_in_at FROM ticketing_tickets ticket JOIN ticketing_attendees attendee ON attendee.id=ticket.attendee_id JOIN ticketing_events event ON event.id=ticket.event_id JOIN ticketing_orders orders ON orders.id=ticket.order_id WHERE event.slug=$1 AND orders.payment_status='PAID' AND ticket.status='USED' AND ticket.first_check_in_at IS NOT NULL ORDER BY ticket.first_check_in_at DESC",[eventSlug]),
    ]);
    const total=counts.rows[0]??{total_issued:"0",total_checked_in:"0",total_pending:"0"};
    return {totalIssued:Number(total.total_issued),totalCheckedIn:Number(total.total_checked_in),totalPending:Number(total.total_pending),entries:entries.rows.map(row=>({firstName:row.first_name,lastName:row.last_name,ticketCode:row.ticket_code,category:row.category,checkedInAt:row.first_check_in_at.toISOString()}))};
  },
  async applyPaymentDisposition(providerOrderId:string,paymentStatus:"FAILED"|"REFUNDED",ticketStatus:"CANCELLED"|"REFUNDED"){await withTransaction(async client=>{const result=await client.query<OrderRow>("UPDATE ticketing_orders SET payment_status=$2,updated_at=NOW() WHERE provider_order_id=$1 AND payment_status<>'CANCELLED' RETURNING *",[providerOrderId,paymentStatus]);if(result.rows[0])await client.query("UPDATE ticketing_tickets SET status=$2,updated_at=NOW() WHERE order_id=$1",[result.rows[0].id,ticketStatus]);});},
  async findTicket(lookup:TicketLookup){const column=lookup.ticketCode?"ticket_code":"qr_token";const value=lookup.ticketCode??lookup.qrToken;if(!value)return null;const result=await query<TicketRow>(`SELECT * FROM ticketing_tickets WHERE ${column}=$1`,[value]);return result.rows[0]?mapTicket(result.rows[0]):null;},
  async recordCheckIn(ticket:Ticket,result:CheckIn["result"]){const record=await query<{id:string;ticket_id:string;checked_in_at:Date;result:CheckIn["result"]}>("INSERT INTO ticketing_check_ins(id,ticket_id,result) VALUES($1,$2,$3) RETURNING *",[randomUUID(),ticket.id,result]);return {id:record.rows[0].id,ticketId:record.rows[0].ticket_id,checkedInAt:record.rows[0].checked_in_at.toISOString(),result:record.rows[0].result};},
};
