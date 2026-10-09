import {randomUUID} from "node:crypto";
import type {PoolClient,QueryResultRow} from "pg";
import {query,withTransaction} from "@/lib/ticketing/db";
import {hashInvitationAccessToken} from "@/lib/ticketing/invitations";
import {availableTicketCapacity,checkInEligibility,hasTicketCapacity,invitationBlockReason,orderAmountForQuantity,ticketsToIssue} from "@/lib/ticketing/rules";
import {generateQrToken,generateTicketCode} from "@/lib/ticketing/security";
import type {Attendee,CheckIn,Event,Invitation,Order,OrderParticipant,PartnerAllocation,Ticket,TicketLookup} from "@/types/ticketing";

type EventRow=QueryResultRow&{id:string;slug:string;title:string;description:string;location:string|null;event_date:Date|null;doors_open_at:Date|null;price:string;currency:"EUR";capacity:number|null;status:Event["status"];created_at:Date;updated_at:Date};
type InvitationRow=QueryResultRow&{id:string;event_id:string;access_token_hash:string;public_slug:string|null;label:string;max_uses:number;used_count:number;expires_at:Date|null;status:Invitation["status"];created_at:Date;updated_at:Date};
type AttendeeRow=QueryResultRow&{id:string;event_id:string;first_name:string;last_name:string;email:string;phone:string|null;company:string|null;source:"STANDARD"|"PARTNER";partner_allocation_id:string|null;created_at:Date;updated_at:Date};
type OrderRow=QueryResultRow&{id:string;event_id:string;attendee_id:string|null;invitation_id:string;request_id:string;provider:"PAYPAL";provider_environment:"SANDBOX"|"LIVE";provider_order_id:string|null;provider_capture_id:string|null;amount:string;currency:"EUR";payment_status:Order["paymentStatus"];created_at:Date;updated_at:Date;paid_at:Date|null};
type ParticipantRow=QueryResultRow&{id:string;order_id:string;attendee_id:string|null;position:number;first_name:string;last_name:string;email:string;phone:string|null;company:string|null;created_at:Date};
type TicketRow=QueryResultRow&{id:string;event_id:string;attendee_id:string;order_id:string|null;partner_allocation_id:string|null;ticket_code:string;qr_token:string;category:Ticket["category"];access_mode:Ticket["accessMode"];status:Ticket["status"];created_at:Date;updated_at:Date;first_check_in_at:Date|null;last_check_in_at:Date|null};
type CheckInTicketRow=TicketRow&{first_name:string;last_name:string;event_status:Event["status"];payment_status:Order["paymentStatus"]|null;company_name:string|null};
type PartnerAllocationRow=QueryResultRow&{id:string;event_id:string;company_name:string;package_name:string|null;partnership_amount_cents:string|null;allocated_quantity:number;status:PartnerAllocation["status"];notes:string|null;created_at:Date;updated_at:Date};

export type AttendeeInput={firstName:string;lastName:string;email:string;phone?:string;company?:string};
export type InvitationCredential={accessToken:string;publicSlug?:never}|{accessToken?:never;publicSlug:string};
export type CheckoutRecord={event:Event;invitation:Invitation;participants:OrderParticipant[];order:Order};
export type TicketConfirmation={event:Event;attendees:Attendee[];order:Order;tickets:Ticket[]};
export type StaffCheckInResponse={status:"AUTHORIZED"|"ALREADY_USED";firstName:string;lastName:string;ticketCode:string;category:Ticket["category"];companyName:string|null;checkedInAt:string}|{status:"INVALID"};
export type StaffTicketSearchResult={firstName:string;lastName:string;ticketCode:string;category:Ticket["category"];source:"STANDARD"|"PARTNER";companyName:string|null;status:"VALID"|"USED";checkedInAt:string|null};
export type StaffIngressEntry={firstName:string;lastName:string;ticketCode:string;category:Ticket["category"];companyName:string|null;checkedInAt:string};
export type StaffIngressDashboard={totalIssued:number;totalCheckedIn:number;totalPending:number;entries:StaffIngressEntry[]};
export type EventAvailability={capacity:number|null;issued:number;reserved:number;available:number|null};
export type StaffParticipant={firstName:string;lastName:string;ticketCode:string;category:Ticket["category"];source:"STANDARD"|"PARTNER";companyName:string|null;status:"PENDING"|"ENTERED";checkedInAt:string|null};
export type StaffParticipantsDashboard={capacity:number|null;participants:number;entered:number;pending:number;available:number|null;standardTickets:number;partnerReserved:number;partnerIssued:number;partnerUnassigned:number;results:StaffParticipant[]};
export type TicketEmailPayload={ticketId:string;firstName:string;lastName:string;email:string;ticketCode:string;qrToken:string;category:Ticket["category"];amount:number|null;currency:string;source:"STANDARD"|"PARTNER";companyName:string|null};
export type PartnerAllocationSummary=PartnerAllocation&{ticketCount:number;unassignedCount:number};
export type PartnerNominee={attendeeId:string;firstName:string;lastName:string;email:string;phone:string|null;ticketCode:string;ticketStatus:Ticket["status"];emailSentAt:string|null};
export type PartnerAllocationDetail=PartnerAllocationSummary&{nominees:PartnerNominee[]};
export type DigitalTicketRecord={event:Event;attendee:Attendee;ticket:Ticket;companyName:string|null};
export type CreatePartnerAllocationInput={companyName:string;packageName?:string;partnershipAmountCents?:number;allocatedQuantity:number;notes?:string};
export type PartnerNomineeInput={firstName:string;lastName:string;email:string;phone?:string};

export class TicketingConflictError extends Error{
  constructor(public code:"INVITATION_UNAVAILABLE"|"ALLOCATION_UNAVAILABLE"|"SOLD_OUT"|"PAYMENT_MISMATCH"|"INVALID_QUANTITY",message:string){super(message);this.name="TicketingConflictError";}
}

const iso=(value:Date|null)=>value?.toISOString()??null;
const mapEvent=(r:EventRow):Event=>({id:r.id,slug:r.slug,title:r.title,description:r.description,location:r.location,eventDate:iso(r.event_date),doorsOpenAt:iso(r.doors_open_at),price:Number(r.price),currency:r.currency,capacity:r.capacity,status:r.status,createdAt:r.created_at.toISOString(),updatedAt:r.updated_at.toISOString()});
const mapInvitation=(r:InvitationRow):Invitation=>({id:r.id,eventId:r.event_id,accessTokenHash:r.access_token_hash,publicSlug:r.public_slug,label:r.label,maxUses:r.max_uses,usedCount:r.used_count,expiresAt:iso(r.expires_at),status:r.status,createdAt:r.created_at.toISOString(),updatedAt:r.updated_at.toISOString()});
const mapAttendee=(r:AttendeeRow):Attendee=>({id:r.id,eventId:r.event_id,firstName:r.first_name,lastName:r.last_name,email:r.email,phone:r.phone??undefined,company:r.company??undefined,source:r.source,partnerAllocationId:r.partner_allocation_id,createdAt:r.created_at.toISOString(),updatedAt:r.updated_at.toISOString()});
const mapOrder=(r:OrderRow):Order=>({id:r.id,eventId:r.event_id,attendeeId:r.attendee_id,invitationId:r.invitation_id,requestId:r.request_id,provider:r.provider,providerEnvironment:r.provider_environment,providerOrderId:r.provider_order_id,providerCaptureId:r.provider_capture_id,amount:Number(r.amount),currency:r.currency,paymentStatus:r.payment_status,createdAt:r.created_at.toISOString(),updatedAt:r.updated_at.toISOString(),paidAt:iso(r.paid_at)});
const mapParticipant=(r:ParticipantRow):OrderParticipant=>({id:r.id,orderId:r.order_id,attendeeId:r.attendee_id,position:r.position,firstName:r.first_name,lastName:r.last_name,email:r.email,phone:r.phone??undefined,company:r.company??undefined,createdAt:r.created_at.toISOString()});
const mapTicket=(r:TicketRow):Ticket=>({id:r.id,eventId:r.event_id,attendeeId:r.attendee_id,orderId:r.order_id,partnerAllocationId:r.partner_allocation_id,ticketCode:r.ticket_code,qrToken:r.qr_token,category:r.category,accessMode:r.access_mode,status:r.status,createdAt:r.created_at.toISOString(),updatedAt:r.updated_at.toISOString(),firstCheckInAt:iso(r.first_check_in_at),lastCheckInAt:iso(r.last_check_in_at)});
const mapPartnerAllocation=(r:PartnerAllocationRow):PartnerAllocation=>({id:r.id,eventId:r.event_id,companyName:r.company_name,packageName:r.package_name,partnershipAmountCents:r.partnership_amount_cents===null?null:Number(r.partnership_amount_cents),allocatedQuantity:r.allocated_quantity,status:r.status,notes:r.notes,createdAt:r.created_at.toISOString(),updatedAt:r.updated_at.toISOString()});

async function getEvent(client:PoolClient,id:string,lock=false){const result=await client.query<EventRow>(`SELECT * FROM ticketing_events WHERE id=$1${lock?" FOR UPDATE":""}`,[id]);return result.rows[0]?mapEvent(result.rows[0]):null;}
async function getInvitation(client:PoolClient,id:string,lock=false){const result=await client.query<InvitationRow>(`SELECT * FROM ticketing_invitations WHERE id=$1${lock?" FOR UPDATE":""}`,[id]);return result.rows[0]?mapInvitation(result.rows[0]):null;}
async function getParticipants(client:PoolClient,orderId:string,lock=false){const result=await client.query<ParticipantRow>(`SELECT * FROM ticketing_order_participants WHERE order_id=$1 ORDER BY position${lock?" FOR UPDATE":""}`,[orderId]);return result.rows.map(mapParticipant);}
async function getTicketsByOrder(client:PoolClient,orderId:string){const result=await client.query<TicketRow>("SELECT t.* FROM ticketing_order_participants p JOIN ticketing_tickets t ON t.attendee_id=p.attendee_id AND t.order_id=p.order_id WHERE p.order_id=$1 ORDER BY p.position",[orderId]);return result.rows.map(mapTicket);}
async function getAttendeesByOrder(client:PoolClient,orderId:string){const result=await client.query<AttendeeRow>("SELECT a.* FROM ticketing_order_participants p JOIN ticketing_attendees a ON a.id=p.attendee_id WHERE p.order_id=$1 ORDER BY p.position",[orderId]);return result.rows.map(mapAttendee);}
async function committedSeatCount(client:PoolClient,eventId:string){const result=await client.query<{count:string}>(`SELECT (
  (SELECT COUNT(*) FROM ticketing_tickets WHERE event_id=$1 AND order_id IS NOT NULL AND status IN ('ACTIVE','USED'))
  + COALESCE((SELECT SUM(CASE WHEN allocation.status='ACTIVE' THEN allocation.allocated_quantity ELSE (
    SELECT COUNT(*) FROM ticketing_tickets ticket WHERE ticket.partner_allocation_id=allocation.id AND ticket.status IN ('ACTIVE','USED')
  ) END) FROM ticketing_partner_allocations allocation WHERE allocation.event_id=$1),0)
)::text AS count`,[eventId]);return Number(result.rows[0].count);}
async function reservedTicketCount(client:PoolClient,eventId:string){const result=await client.query<{count:string}>("SELECT COUNT(*)::text AS count FROM ticketing_order_participants participant JOIN ticketing_orders orders ON orders.id=participant.order_id WHERE orders.event_id=$1 AND orders.payment_status='PENDING' AND orders.created_at>=NOW()-INTERVAL '30 minutes'",[eventId]);return Number(result.rows[0].count);}

async function loadConfirmation(client:PoolClient,order:Order):Promise<TicketConfirmation>{
  const [event,attendees,tickets]=await Promise.all([getEvent(client,order.eventId),getAttendeesByOrder(client,order.id),getTicketsByOrder(client,order.id)]);
  if(!event||attendees.length!==tickets.length||tickets.length===0) throw new Error("Conferma ordine incompleta nel database.");
  return {event,attendees,order,tickets};
}

async function performTicketCheckIn(column:"qr_token"|"ticket_code",value:string):Promise<StaffCheckInResponse>{
  return withTransaction(async client=>{
    const result=await client.query<CheckInTicketRow>(`SELECT ticket.*,attendee.first_name,attendee.last_name,event.status AS event_status,orders.payment_status,allocation.company_name FROM ticketing_tickets ticket JOIN ticketing_attendees attendee ON attendee.id=ticket.attendee_id JOIN ticketing_events event ON event.id=ticket.event_id LEFT JOIN ticketing_orders orders ON orders.id=ticket.order_id LEFT JOIN ticketing_partner_allocations allocation ON allocation.id=ticket.partner_allocation_id WHERE ticket.${column}=$1 FOR UPDATE OF ticket`,[value]);
    const row=result.rows[0];if(!row)return {status:"INVALID"};
    const ticket=mapTicket(row);const eligibility=checkInEligibility({ticketStatus:ticket.status,firstCheckInAt:ticket.firstCheckInAt,paymentStatus:ticket.partnerAllocationId?"PAID":row.payment_status??"PENDING",eventStatus:row.event_status});
    if(eligibility==="INVALID")return {status:"INVALID"};
    if(eligibility==="ALREADY_USED")return {status:"ALREADY_USED",firstName:row.first_name,lastName:row.last_name,ticketCode:ticket.ticketCode,category:ticket.category,companyName:row.company_name,checkedInAt:ticket.firstCheckInAt??ticket.lastCheckInAt??ticket.updatedAt};

    const update=await client.query<{first_check_in_at:Date}>("UPDATE ticketing_tickets SET status='USED',first_check_in_at=NOW(),last_check_in_at=NOW(),updated_at=NOW() WHERE id=$1 RETURNING first_check_in_at",[ticket.id]);const checkedInAt=update.rows[0].first_check_in_at;
    await client.query("INSERT INTO ticketing_check_ins(id,ticket_id,checked_in_at,result) VALUES($1,$2,$3,'ALLOWED')",[randomUUID(),ticket.id,checkedInAt]);
    return {status:"AUTHORIZED",firstName:row.first_name,lastName:row.last_name,ticketCode:ticket.ticketCode,category:ticket.category,companyName:row.company_name,checkedInAt:checkedInAt.toISOString()};
  });
}

const staffSearchPattern=(value:string)=>`%${value.replace(/[\\%_]/g,"\\$&")}%`;

export const ticketingRepository={
  async findEventBySlug(slug:string){const result=await query<EventRow>("SELECT * FROM ticketing_events WHERE slug=$1",[slug]);return result.rows[0]?mapEvent(result.rows[0]):null;},
  async getEventAvailability(slug:string):Promise<EventAvailability|null>{
    const result=await query<{capacity:number|null;issued:string;reserved:string}>(`SELECT event.capacity,(
      (SELECT COUNT(*) FROM ticketing_tickets ticket WHERE ticket.event_id=event.id AND ticket.order_id IS NOT NULL AND ticket.status IN ('ACTIVE','USED'))
      + COALESCE((SELECT SUM(CASE WHEN allocation.status='ACTIVE' THEN allocation.allocated_quantity ELSE (
        SELECT COUNT(*) FROM ticketing_tickets ticket WHERE ticket.partner_allocation_id=allocation.id AND ticket.status IN ('ACTIVE','USED')
      ) END) FROM ticketing_partner_allocations allocation WHERE allocation.event_id=event.id),0)
    )::text AS issued,(SELECT COUNT(*) FROM ticketing_order_participants participant JOIN ticketing_orders orders ON orders.id=participant.order_id WHERE orders.event_id=event.id AND orders.payment_status='PENDING' AND orders.created_at>=NOW()-INTERVAL '30 minutes')::text AS reserved FROM ticketing_events event WHERE event.slug=$1`,[slug]);
    const row=result.rows[0];if(!row)return null;const issued=Number(row.issued);const reserved=Number(row.reserved);return {capacity:row.capacity,issued,reserved,available:availableTicketCapacity(row.capacity,issued,reserved)};
  },
  async findInvitationByAccessToken(accessToken:string){const result=await query<InvitationRow>("SELECT * FROM ticketing_invitations WHERE access_token_hash=$1",[hashInvitationAccessToken(accessToken)]);if(!result.rows[0])return null;const invitation=mapInvitation(result.rows[0]);return invitationBlockReason(invitation)?null:invitation;},
  async findInvitationByPublicSlug(publicSlug:string){const result=await query<InvitationRow>("SELECT * FROM ticketing_invitations WHERE public_slug=$1",[publicSlug]);if(!result.rows[0])return null;const invitation=mapInvitation(result.rows[0]);return invitationBlockReason(invitation)?null:invitation;},

  async createPendingCheckout(eventSlug:string,credential:InvitationCredential,requestId:string,inputs:AttendeeInput[],providerEnvironment:"SANDBOX"|"LIVE"):Promise<CheckoutRecord>{
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
      const [issued,reserved]=await Promise.all([committedSeatCount(client,event.id),reservedTicketCount(client,event.id)]);
      if(!hasTicketCapacity(event.capacity,issued,inputs.length,reserved))throw new TicketingConflictError("SOLD_OUT","Non ci sono abbastanza posti disponibili.");

      const orderResult=await client.query<OrderRow>("INSERT INTO ticketing_orders(id,event_id,attendee_id,invitation_id,request_id,provider,provider_environment,amount,currency,payment_status) VALUES($1,$2,NULL,$3,$4,'PAYPAL',$5,$6,$7,'PENDING') RETURNING *",[randomUUID(),event.id,invitationRow.id,requestId,providerEnvironment,amount.toFixed(2),event.currency]);
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
  async claimTicketEmail(ticketId:string,force=false){const result=await query<{id:string}>("UPDATE ticketing_tickets SET email_claimed_at=NOW(),email_send_attempts=email_send_attempts+1,email_last_error=NULL WHERE id=$1 AND ($2::boolean OR email_sent_at IS NULL) AND (email_claimed_at IS NULL OR email_claimed_at<NOW()-INTERVAL '10 minutes') RETURNING id",[ticketId,force]);return Boolean(result.rowCount);},
  async markTicketEmailSent(ticketId:string){await query("UPDATE ticketing_tickets SET email_sent_at=NOW(),email_claimed_at=NULL,email_last_error=NULL,updated_at=NOW() WHERE id=$1",[ticketId]);},
  async markTicketEmailFailed(ticketId:string,error:string){await query("UPDATE ticketing_tickets SET email_claimed_at=NULL,email_last_error=$2,updated_at=NOW() WHERE id=$1",[ticketId,error.replace(/[\u0000-\u001f\u007f]+/g," ").slice(0,1000)]);},
  async findTicketEmailPayload(ticketCode:string):Promise<TicketEmailPayload|null>{const result=await query<{ticket_id:string;first_name:string;last_name:string;email:string;ticket_code:string;qr_token:string;category:Ticket["category"];amount:string;currency:string;source:"STANDARD"|"PARTNER";company_name:string|null}>("SELECT ticket.id AS ticket_id,attendee.first_name,attendee.last_name,attendee.email,ticket.ticket_code,ticket.qr_token,ticket.category,event.price AS amount,event.currency,attendee.source,allocation.company_name FROM ticketing_tickets ticket JOIN ticketing_attendees attendee ON attendee.id=ticket.attendee_id JOIN ticketing_events event ON event.id=ticket.event_id LEFT JOIN ticketing_orders orders ON orders.id=ticket.order_id LEFT JOIN ticketing_partner_allocations allocation ON allocation.id=ticket.partner_allocation_id WHERE ticket.ticket_code=$1 AND (orders.payment_status='PAID' OR ticket.partner_allocation_id IS NOT NULL) AND ticket.status IN ('ACTIVE','USED')",[ticketCode]);const row=result.rows[0];return row?{ticketId:row.ticket_id,firstName:row.first_name,lastName:row.last_name,email:row.email,ticketCode:row.ticket_code,qrToken:row.qr_token,category:row.category,amount:row.source==="PARTNER"?null:Number(row.amount),currency:row.currency,source:row.source,companyName:row.company_name}:null;},

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
      if(event.capacity!==null&&(await committedSeatCount(client,event.id))+participants.length>event.capacity)throw new TicketingConflictError("SOLD_OUT","Non ci sono abbastanza posti disponibili.");

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
      if(event.capacity!==null&&(await committedSeatCount(client,event.id))>=event.capacity)await client.query("UPDATE ticketing_events SET status='SOLD_OUT',updated_at=NOW() WHERE id=$1 AND status NOT IN ('CANCELLED','COMPLETED')",[event.id]);
      return loadConfirmation(client,order);
    });
  },

  async findConfirmationByQrToken(qrToken:string):Promise<TicketConfirmation|null>{
    return withTransaction(async client=>{const ticketResult=await client.query<TicketRow>("SELECT * FROM ticketing_tickets WHERE qr_token=$1",[qrToken]);if(!ticketResult.rows[0])return null;const orderResult=await client.query<OrderRow>("SELECT * FROM ticketing_orders WHERE id=$1",[ticketResult.rows[0].order_id]);if(!orderResult.rows[0])return null;return loadConfirmation(client,mapOrder(orderResult.rows[0]));});
  },
  async findDigitalTicketByQrToken(qrToken:string):Promise<DigitalTicketRecord|null>{
    const result=await query<TicketRow&AttendeeRow&{event_slug:string;event_title:string;event_description:string;event_location:string|null;event_date:Date|null;doors_open_at:Date|null;event_price:string;event_currency:"EUR";event_capacity:number|null;event_status:Event["status"];event_created_at:Date;event_updated_at:Date;attendee_partner_allocation_id:string|null;attendee_created_at:Date;attendee_updated_at:Date;company_name:string|null}>(`SELECT ticket.*,attendee.first_name,attendee.last_name,attendee.email,attendee.phone,attendee.company,attendee.source,attendee.partner_allocation_id AS attendee_partner_allocation_id,attendee.created_at AS attendee_created_at,attendee.updated_at AS attendee_updated_at,event.slug AS event_slug,event.title AS event_title,event.description AS event_description,event.location AS event_location,event.event_date,event.doors_open_at,event.price AS event_price,event.currency AS event_currency,event.capacity AS event_capacity,event.status AS event_status,event.created_at AS event_created_at,event.updated_at AS event_updated_at,allocation.company_name FROM ticketing_tickets ticket JOIN ticketing_attendees attendee ON attendee.id=ticket.attendee_id JOIN ticketing_events event ON event.id=ticket.event_id LEFT JOIN ticketing_partner_allocations allocation ON allocation.id=ticket.partner_allocation_id WHERE ticket.qr_token=$1`,[qrToken]);
    const row=result.rows[0];if(!row)return null;
    const attendee=mapAttendee({id:row.attendee_id,event_id:row.event_id,first_name:row.first_name,last_name:row.last_name,email:row.email,phone:row.phone,company:row.company,source:row.source,partner_allocation_id:row.attendee_partner_allocation_id,created_at:row.attendee_created_at,updated_at:row.attendee_updated_at});
    const event=mapEvent({id:row.event_id,slug:row.event_slug,title:row.event_title,description:row.event_description,location:row.event_location,event_date:row.event_date,doors_open_at:row.doors_open_at,price:row.event_price,currency:row.event_currency,capacity:row.event_capacity,status:row.event_status,created_at:row.event_created_at,updated_at:row.event_updated_at});
    return {event,attendee,ticket:mapTicket(row),companyName:row.company_name};
  },
  async checkInByQrToken(qrToken:string):Promise<StaffCheckInResponse>{
    return performTicketCheckIn("qr_token",qrToken);
  },
  async checkInByTicketCode(ticketCode:string):Promise<StaffCheckInResponse>{
    return performTicketCheckIn("ticket_code",ticketCode);
  },
  async searchStaffTickets(eventSlug:string,search:string):Promise<StaffTicketSearchResult[]>{
    const result=await query<{first_name:string;last_name:string;ticket_code:string;category:Ticket["category"];source:"STANDARD"|"PARTNER";company_name:string|null;status:Ticket["status"];first_check_in_at:Date|null}>("SELECT attendee.first_name,attendee.last_name,ticket.ticket_code,ticket.category,attendee.source,allocation.company_name,ticket.status,ticket.first_check_in_at FROM ticketing_tickets ticket JOIN ticketing_attendees attendee ON attendee.id=ticket.attendee_id JOIN ticketing_events event ON event.id=ticket.event_id LEFT JOIN ticketing_orders orders ON orders.id=ticket.order_id LEFT JOIN ticketing_partner_allocations allocation ON allocation.id=ticket.partner_allocation_id WHERE event.slug=$1 AND (orders.payment_status='PAID' OR ticket.partner_allocation_id IS NOT NULL) AND ticket.status IN ('ACTIVE','USED') AND (attendee.first_name ILIKE $2 ESCAPE '\\' OR attendee.last_name ILIKE $2 ESCAPE '\\' OR ticket.ticket_code ILIKE $2 ESCAPE '\\') ORDER BY attendee.last_name,attendee.first_name,ticket.ticket_code LIMIT 50",[eventSlug,staffSearchPattern(search)]);
    return result.rows.map(row=>({firstName:row.first_name,lastName:row.last_name,ticketCode:row.ticket_code,category:row.category,source:row.source,companyName:row.company_name,status:row.status==="USED"?"USED":"VALID",checkedInAt:iso(row.first_check_in_at)}));
  },
  async getStaffIngressDashboard(eventSlug:string):Promise<StaffIngressDashboard>{
    const [counts,entries]=await Promise.all([
      query<{total_issued:string;total_checked_in:string;total_pending:string}>("SELECT COUNT(*) FILTER (WHERE ticket.status IN ('ACTIVE','USED'))::text AS total_issued,COUNT(*) FILTER (WHERE ticket.status='USED')::text AS total_checked_in,COUNT(*) FILTER (WHERE ticket.status='ACTIVE')::text AS total_pending FROM ticketing_tickets ticket JOIN ticketing_events event ON event.id=ticket.event_id LEFT JOIN ticketing_orders orders ON orders.id=ticket.order_id WHERE event.slug=$1 AND (orders.payment_status='PAID' OR ticket.partner_allocation_id IS NOT NULL)",[eventSlug]),
      query<{first_name:string;last_name:string;ticket_code:string;category:Ticket["category"];company_name:string|null;first_check_in_at:Date}>("SELECT attendee.first_name,attendee.last_name,ticket.ticket_code,ticket.category,allocation.company_name,ticket.first_check_in_at FROM ticketing_tickets ticket JOIN ticketing_attendees attendee ON attendee.id=ticket.attendee_id JOIN ticketing_events event ON event.id=ticket.event_id LEFT JOIN ticketing_orders orders ON orders.id=ticket.order_id LEFT JOIN ticketing_partner_allocations allocation ON allocation.id=ticket.partner_allocation_id WHERE event.slug=$1 AND (orders.payment_status='PAID' OR ticket.partner_allocation_id IS NOT NULL) AND ticket.status='USED' AND ticket.first_check_in_at IS NOT NULL ORDER BY ticket.first_check_in_at DESC",[eventSlug]),
    ]);
    const total=counts.rows[0]??{total_issued:"0",total_checked_in:"0",total_pending:"0"};
    return {totalIssued:Number(total.total_issued),totalCheckedIn:Number(total.total_checked_in),totalPending:Number(total.total_pending),entries:entries.rows.map(row=>({firstName:row.first_name,lastName:row.last_name,ticketCode:row.ticket_code,category:row.category,companyName:row.company_name,checkedInAt:row.first_check_in_at.toISOString()}))};
  },
  async getStaffParticipants(eventSlug:string,search:string,filter:"ALL"|"PENDING"|"ENTERED",sourceFilter:"ALL"|"STANDARD"|"PARTNER"="ALL"):Promise<StaffParticipantsDashboard>{
    const pattern=staffSearchPattern(search);const statusClause=filter==="PENDING"?"AND ticket.status='ACTIVE'":filter==="ENTERED"?"AND ticket.status='USED'":"";const sourceClause="AND ($4='ALL' OR attendee.source=$4)";
    const [summary,participants]=await Promise.all([
      query<{capacity:number|null;participants:string;entered:string;pending:string;standard_tickets:string;partner_issued:string;partner_reserved:string;partner_unassigned:string;cancelled_partner_issued:string}>(`SELECT event.capacity,
        (SELECT COUNT(*) FROM ticketing_tickets ticket LEFT JOIN ticketing_orders orders ON orders.id=ticket.order_id WHERE ticket.event_id=event.id AND ticket.status IN ('ACTIVE','USED') AND (orders.payment_status='PAID' OR ticket.partner_allocation_id IS NOT NULL))::text AS participants,
        (SELECT COUNT(*) FROM ticketing_tickets ticket LEFT JOIN ticketing_orders orders ON orders.id=ticket.order_id WHERE ticket.event_id=event.id AND ticket.status='USED' AND (orders.payment_status='PAID' OR ticket.partner_allocation_id IS NOT NULL))::text AS entered,
        (SELECT COUNT(*) FROM ticketing_tickets ticket LEFT JOIN ticketing_orders orders ON orders.id=ticket.order_id WHERE ticket.event_id=event.id AND ticket.status='ACTIVE' AND (orders.payment_status='PAID' OR ticket.partner_allocation_id IS NOT NULL))::text AS pending,
        (SELECT COUNT(*) FROM ticketing_tickets ticket JOIN ticketing_orders orders ON orders.id=ticket.order_id WHERE ticket.event_id=event.id AND orders.payment_status='PAID' AND ticket.status IN ('ACTIVE','USED'))::text AS standard_tickets,
        (SELECT COUNT(*) FROM ticketing_tickets ticket WHERE ticket.event_id=event.id AND ticket.partner_allocation_id IS NOT NULL AND ticket.status IN ('ACTIVE','USED'))::text AS partner_issued,
        COALESCE((SELECT SUM(allocation.allocated_quantity) FROM ticketing_partner_allocations allocation WHERE allocation.event_id=event.id AND allocation.status='ACTIVE'),0)::text AS partner_reserved,
        COALESCE((SELECT SUM(GREATEST(allocation.allocated_quantity-(SELECT COUNT(*) FROM ticketing_tickets ticket WHERE ticket.partner_allocation_id=allocation.id),0)) FROM ticketing_partner_allocations allocation WHERE allocation.event_id=event.id AND allocation.status='ACTIVE'),0)::text AS partner_unassigned,
        (SELECT COUNT(*) FROM ticketing_tickets ticket JOIN ticketing_partner_allocations allocation ON allocation.id=ticket.partner_allocation_id WHERE ticket.event_id=event.id AND allocation.status='CANCELLED' AND ticket.status IN ('ACTIVE','USED'))::text AS cancelled_partner_issued
      FROM ticketing_events event WHERE event.slug=$1`,[eventSlug]),
      query<{first_name:string;last_name:string;ticket_code:string;category:Ticket["category"];source:"STANDARD"|"PARTNER";company_name:string|null;status:Ticket["status"];first_check_in_at:Date|null}>(`SELECT attendee.first_name,attendee.last_name,ticket.ticket_code,ticket.category,attendee.source,allocation.company_name,ticket.status,ticket.first_check_in_at FROM ticketing_tickets ticket JOIN ticketing_attendees attendee ON attendee.id=ticket.attendee_id JOIN ticketing_events event ON event.id=ticket.event_id LEFT JOIN ticketing_orders orders ON orders.id=ticket.order_id LEFT JOIN ticketing_partner_allocations allocation ON allocation.id=ticket.partner_allocation_id WHERE event.slug=$1 AND (orders.payment_status='PAID' OR ticket.partner_allocation_id IS NOT NULL) AND ticket.status IN ('ACTIVE','USED') ${statusClause} ${sourceClause} AND ($2='' OR attendee.first_name ILIKE $3 ESCAPE '\\' OR attendee.last_name ILIKE $3 ESCAPE '\\' OR CONCAT_WS(' ',attendee.first_name,attendee.last_name) ILIKE $3 ESCAPE '\\' OR ticket.ticket_code ILIKE $3 ESCAPE '\\' OR attendee.email ILIKE $3 ESCAPE '\\') ORDER BY CASE WHEN ticket.status='ACTIVE' THEN 0 ELSE 1 END,attendee.last_name,attendee.first_name LIMIT 500`,[eventSlug,search,pattern,sourceFilter]),
    ]);
    const row=summary.rows[0]??{capacity:null,participants:"0",entered:"0",pending:"0",standard_tickets:"0",partner_issued:"0",partner_reserved:"0",partner_unassigned:"0",cancelled_partner_issued:"0"};const total=Number(row.participants);const committed=Number(row.standard_tickets)+Number(row.partner_reserved)+Number(row.cancelled_partner_issued);
    return {capacity:row.capacity,participants:total,entered:Number(row.entered),pending:Number(row.pending),available:availableTicketCapacity(row.capacity,committed),standardTickets:Number(row.standard_tickets),partnerReserved:Number(row.partner_reserved),partnerIssued:Number(row.partner_issued),partnerUnassigned:Number(row.partner_unassigned),results:participants.rows.map(item=>({firstName:item.first_name,lastName:item.last_name,ticketCode:item.ticket_code,category:item.category,source:item.source,companyName:item.company_name,status:item.status==="USED"?"ENTERED":"PENDING",checkedInAt:iso(item.first_check_in_at)}))};
  },
  async listPartnerAllocations(eventSlug:string):Promise<PartnerAllocationSummary[]>{
    const result=await query<PartnerAllocationRow&{ticket_count:string}>(`SELECT allocation.*,
      COUNT(ticket.id)::text AS ticket_count
      FROM ticketing_partner_allocations allocation
      JOIN ticketing_events event ON event.id=allocation.event_id
      LEFT JOIN ticketing_tickets ticket ON ticket.partner_allocation_id=allocation.id
      WHERE event.slug=$1
      GROUP BY allocation.id
      ORDER BY CASE WHEN allocation.status='ACTIVE' THEN 0 ELSE 1 END,allocation.company_name`,[eventSlug]);
    return result.rows.map(row=>{const allocation=mapPartnerAllocation(row);const ticketCount=Number(row.ticket_count);return {...allocation,ticketCount,unassignedCount:allocation.status==="ACTIVE"?Math.max(0,allocation.allocatedQuantity-ticketCount):0};});
  },
  async getPartnerAllocation(id:string):Promise<PartnerAllocationDetail|null>{
    const allocationResult=await query<PartnerAllocationRow&{ticket_count:string}>(`SELECT allocation.*,COUNT(ticket.id)::text AS ticket_count FROM ticketing_partner_allocations allocation LEFT JOIN ticketing_tickets ticket ON ticket.partner_allocation_id=allocation.id WHERE allocation.id=$1 GROUP BY allocation.id`,[id]);
    const row=allocationResult.rows[0];if(!row)return null;const allocation=mapPartnerAllocation(row);const ticketCount=Number(row.ticket_count);
    const nominees=await query<{attendee_id:string;first_name:string;last_name:string;email:string;phone:string|null;ticket_code:string;ticket_status:Ticket["status"];email_sent_at:Date|null}>(`SELECT attendee.id AS attendee_id,attendee.first_name,attendee.last_name,attendee.email,attendee.phone,ticket.ticket_code,ticket.status AS ticket_status,ticket.email_sent_at FROM ticketing_attendees attendee JOIN ticketing_tickets ticket ON ticket.attendee_id=attendee.id AND ticket.partner_allocation_id=attendee.partner_allocation_id WHERE attendee.partner_allocation_id=$1 ORDER BY attendee.created_at,attendee.id`,[id]);
    return {...allocation,ticketCount,unassignedCount:allocation.status==="ACTIVE"?Math.max(0,allocation.allocatedQuantity-ticketCount):0,nominees:nominees.rows.map(item=>({attendeeId:item.attendee_id,firstName:item.first_name,lastName:item.last_name,email:item.email,phone:item.phone,ticketCode:item.ticket_code,ticketStatus:item.ticket_status,emailSentAt:iso(item.email_sent_at)}))};
  },
  async createPartnerAllocation(eventSlug:string,input:CreatePartnerAllocationInput):Promise<PartnerAllocation>{
    return withTransaction(async client=>{
      const eventResult=await client.query<EventRow>("SELECT * FROM ticketing_events WHERE slug=$1 FOR UPDATE",[eventSlug]);const eventRow=eventResult.rows[0];if(!eventRow)throw new TicketingConflictError("ALLOCATION_UNAVAILABLE","Evento non disponibile.");const event=mapEvent(eventRow);
      const [committed,reserved]=await Promise.all([committedSeatCount(client,event.id),reservedTicketCount(client,event.id)]);
      if(!hasTicketCapacity(event.capacity,committed,input.allocatedQuantity,reserved))throw new TicketingConflictError("SOLD_OUT","I posti richiesti superano la disponibilità dell'evento.");
      const result=await client.query<PartnerAllocationRow>(`INSERT INTO ticketing_partner_allocations(id,event_id,company_name,package_name,partnership_amount_cents,allocated_quantity,status,notes) VALUES($1,$2,$3,$4,$5,$6,'ACTIVE',$7) RETURNING *`,[randomUUID(),event.id,input.companyName,input.packageName||null,input.partnershipAmountCents??null,input.allocatedQuantity,input.notes||null]);
      if(event.capacity!==null&&committed+reserved+input.allocatedQuantity>=event.capacity)await client.query("UPDATE ticketing_events SET status='SOLD_OUT',updated_at=NOW() WHERE id=$1 AND status NOT IN ('CANCELLED','COMPLETED')",[event.id]);
      return mapPartnerAllocation(result.rows[0]);
    });
  },
  async addPartnerNominee(allocationId:string,input:PartnerNomineeInput):Promise<TicketEmailPayload>{
    return withTransaction(async client=>{
      const allocationResult=await client.query<PartnerAllocationRow>("SELECT * FROM ticketing_partner_allocations WHERE id=$1 FOR UPDATE",[allocationId]);const allocationRow=allocationResult.rows[0];if(!allocationRow||allocationRow.status!=="ACTIVE")throw new TicketingConflictError("ALLOCATION_UNAVAILABLE","Assegnazione partner non disponibile.");const allocation=mapPartnerAllocation(allocationRow);
      await client.query("SELECT id FROM ticketing_events WHERE id=$1 FOR UPDATE",[allocation.eventId]);
      const countResult=await client.query<{count:string}>("SELECT COUNT(*)::text AS count FROM ticketing_tickets WHERE partner_allocation_id=$1",[allocation.id]);if(Number(countResult.rows[0].count)>=allocation.allocatedQuantity)throw new TicketingConflictError("ALLOCATION_UNAVAILABLE","Tutti i posti partner sono già stati nominati.");
      const attendeeId=randomUUID();const ticketId=randomUUID();const ticketCode=generateTicketCode();const qrToken=generateQrToken();
      await client.query("INSERT INTO ticketing_attendees(id,event_id,first_name,last_name,email,phone,company,source,partner_allocation_id) VALUES($1,$2,$3,$4,$5,$6,$7,'PARTNER',$8)",[attendeeId,allocation.eventId,input.firstName,input.lastName,input.email,input.phone||null,allocation.companyName,allocation.id]);
      await client.query("INSERT INTO ticketing_tickets(id,event_id,attendee_id,order_id,partner_allocation_id,ticket_code,qr_token,category,access_mode,status) VALUES($1,$2,$3,NULL,$4,$5,$6,'PARTNER','ONE_SHOT','ACTIVE')",[ticketId,allocation.eventId,attendeeId,allocation.id,ticketCode,qrToken]);
      return {ticketId,firstName:input.firstName,lastName:input.lastName,email:input.email,ticketCode,qrToken,category:"PARTNER",amount:null,currency:"EUR",source:"PARTNER",companyName:allocation.companyName};
    });
  },
  async updatePartnerNominee(allocationId:string,attendeeId:string,input:PartnerNomineeInput):Promise<PartnerNominee|null>{
    return withTransaction(async client=>{
      const allocation=await client.query<PartnerAllocationRow>("SELECT * FROM ticketing_partner_allocations WHERE id=$1 FOR UPDATE",[allocationId]);if(!allocation.rows[0])return null;
      const result=await client.query<AttendeeRow>("UPDATE ticketing_attendees SET first_name=$3,last_name=$4,email=$5,phone=$6,updated_at=NOW() WHERE id=$1 AND partner_allocation_id=$2 AND source='PARTNER' RETURNING *",[attendeeId,allocationId,input.firstName,input.lastName,input.email,input.phone||null]);if(!result.rows[0])return null;
      const ticket=await client.query<TicketRow&{email_sent_at:Date|null}>("SELECT * FROM ticketing_tickets WHERE attendee_id=$1 AND partner_allocation_id=$2",[attendeeId,allocationId]);const row=ticket.rows[0];if(!row)return null;
      return {attendeeId,firstName:result.rows[0].first_name,lastName:result.rows[0].last_name,email:result.rows[0].email,phone:result.rows[0].phone,ticketCode:row.ticket_code,ticketStatus:row.status,emailSentAt:iso(row.email_sent_at)};
    });
  },
  async cancelPartnerAllocation(allocationId:string):Promise<boolean>{
    return withTransaction(async client=>{
      const allocationResult=await client.query<PartnerAllocationRow>("SELECT * FROM ticketing_partner_allocations WHERE id=$1 FOR UPDATE",[allocationId]);const row=allocationResult.rows[0];if(!row)return false;if(row.status==="CANCELLED")return true;
      await client.query("SELECT id FROM ticketing_events WHERE id=$1 FOR UPDATE",[row.event_id]);
      await client.query("UPDATE ticketing_partner_allocations SET status='CANCELLED',updated_at=NOW() WHERE id=$1",[allocationId]);
      await client.query("UPDATE ticketing_events SET status='ANNOUNCED',updated_at=NOW() WHERE id=$1 AND status='SOLD_OUT'",[row.event_id]);
      return true;
    });
  },
  async applyPaymentDisposition(providerOrderId:string,paymentStatus:"FAILED"|"REFUNDED",ticketStatus:"CANCELLED"|"REFUNDED"){await withTransaction(async client=>{const result=await client.query<OrderRow>("UPDATE ticketing_orders SET payment_status=$2,updated_at=NOW() WHERE provider_order_id=$1 AND payment_status<>'CANCELLED' RETURNING *",[providerOrderId,paymentStatus]);if(result.rows[0])await client.query("UPDATE ticketing_tickets SET status=$2,updated_at=NOW() WHERE order_id=$1",[result.rows[0].id,ticketStatus]);});},
  async findTicket(lookup:TicketLookup){const column=lookup.ticketCode?"ticket_code":"qr_token";const value=lookup.ticketCode??lookup.qrToken;if(!value)return null;const result=await query<TicketRow>(`SELECT * FROM ticketing_tickets WHERE ${column}=$1`,[value]);return result.rows[0]?mapTicket(result.rows[0]):null;},
  async recordCheckIn(ticket:Ticket,result:CheckIn["result"]){const record=await query<{id:string;ticket_id:string;checked_in_at:Date;result:CheckIn["result"]}>("INSERT INTO ticketing_check_ins(id,ticket_id,result) VALUES($1,$2,$3) RETURNING *",[randomUUID(),ticket.id,result]);return {id:record.rows[0].id,ticketId:record.rows[0].ticket_id,checkedInAt:record.rows[0].checked_in_at.toISOString(),result:record.rows[0].result};},
};
