import {randomUUID} from "node:crypto";
import type {QueryResultRow} from "pg";
import {query,withTransaction} from "@/lib/ticketing/db";
import type {StaffSession} from "@/lib/ticketing/staff-auth";
import type {EventStatus,EventType,EventVisibility} from "@/types/ticketing";

export type ManagedEventSummary={
  id:string;slug:string;title:string;eventDate:string|null;endsAt:string|null;location:string|null;
  status:EventStatus;eventType:EventType;visibility:EventVisibility;capacity:number|null;
  registered:number;operational:number;entered:number;noShow:number;cancelled:number;revenue:number;currency:string;
};

export type CreateManagedEventInput={
  title:string;slug:string;description:string;eventDate:string;endsAt:string;location:string;address:string;
  capacity:number|null;eventType:EventType;isFree:boolean;price:number|null;currency:string;visibility:EventVisibility;
  allowsCompanions:boolean;maxCompanions:number|null;coverImage:string;registrationOpensAt:string;registrationClosesAt:string;
  checkinOpensAt:string;checkinClosesAt:string;
};

type EventSummaryRow=QueryResultRow&{id:string;slug:string;title:string;event_date:Date|null;ends_at:Date|null;location:string|null;status:EventStatus;event_type:EventType;visibility:EventVisibility;capacity:number|null;registered:string;operational:string;entered:string;no_show:string;cancelled:string;revenue:string;currency:string};

const iso=(value:Date|null)=>value?.toISOString()??null;
const summary=(row:EventSummaryRow):ManagedEventSummary=>({id:row.id,slug:row.slug,title:row.title,eventDate:iso(row.event_date),endsAt:iso(row.ends_at),location:row.location,status:row.status,eventType:row.event_type,visibility:row.visibility,capacity:row.capacity,registered:Number(row.registered),operational:Number(row.operational),entered:Number(row.entered),noShow:Number(row.no_show),cancelled:Number(row.cancelled),revenue:Number(row.revenue),currency:row.currency});

const summarySql=`SELECT event.id,event.slug,event.title,event.event_date,event.ends_at,event.location,event.status,event.event_type,event.visibility,event.capacity,event.currency,
  (SELECT COUNT(*) FROM ticketing_registrations registration WHERE registration.event_id=event.id AND registration.rsvp_status IN ('CONFIRMED','PENDING','WAITLIST'))::text AS registered,
  (SELECT COUNT(*) FROM ticketing_tickets ticket LEFT JOIN ticketing_orders orders ON orders.id=ticket.order_id WHERE ticket.event_id=event.id AND ticket.status IN ('ACTIVE','USED') AND (orders.payment_status='PAID' OR ticket.partner_allocation_id IS NOT NULL OR ticket.manual_issuance_id IS NOT NULL))::text AS operational,
  (SELECT COUNT(*) FROM ticketing_tickets ticket WHERE ticket.event_id=event.id AND ticket.status='USED')::text AS entered,
  (SELECT COUNT(*) FROM ticketing_tickets ticket WHERE ticket.event_id=event.id AND ticket.status='ACTIVE')::text AS no_show,
  (SELECT COUNT(*) FROM ticketing_tickets ticket WHERE ticket.event_id=event.id AND ticket.status='CANCELLED')::text AS cancelled,
  COALESCE((SELECT SUM(orders.amount) FROM ticketing_orders orders WHERE orders.event_id=event.id AND orders.payment_status='PAID'),0)::text AS revenue
  FROM ticketing_events event`;

function nullable(value:string){return value.trim()||null;}

export async function listManagedEvents(){
  const result=await query<EventSummaryRow>(`${summarySql} ORDER BY event.event_date DESC NULLS LAST,event.created_at DESC`);
  return result.rows.map(summary);
}

export async function getManagedEventById(id:string){
  const result=await query<EventSummaryRow>(`${summarySql} WHERE event.id=$1`,[id]);
  return result.rows[0]?summary(result.rows[0]):null;
}

export async function createManagedEvent(input:CreateManagedEventInput,session:StaffSession){
  if(session.role!=="SUPERADMIN")throw new Error("FORBIDDEN");
  return withTransaction(async client=>{
    const id=randomUUID();
    const result=await client.query<{id:string}>(`INSERT INTO ticketing_events(
      id,slug,title,description,location,address,event_date,ends_at,price,currency,capacity,status,event_type,visibility,is_free,is_charity,allows_companions,max_companions,cover_image,registration_opens_at,registration_closes_at,checkin_opens_at,checkin_closes_at
    ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'DRAFT',$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22) RETURNING id`,[
      id,input.slug,input.title,input.description,nullable(input.location),nullable(input.address),input.eventDate,input.endsAt,input.isFree?null:input.price,input.currency,input.capacity,input.eventType,input.visibility,input.isFree,input.eventType==="CHARITY",input.allowsCompanions,input.allowsCompanions?input.maxCompanions:null,nullable(input.coverImage),nullable(input.registrationOpensAt),nullable(input.registrationClosesAt),nullable(input.checkinOpensAt),nullable(input.checkinClosesAt),
    ]);
    await client.query(`INSERT INTO ticketing_event_audit(id,event_id,action,performed_by_staff_id,performed_by_display_name,session_id,details) VALUES($1,$2,'CREATED',$3,$4,$5,$6::jsonb)`,[randomUUID(),id,session.operatorId,session.displayName,session.sessionId,JSON.stringify({slug:input.slug})]);
    return result.rows[0].id;
  });
}

export async function duplicateManagedEvent(sourceId:string,input:Pick<CreateManagedEventInput,"title"|"slug"|"eventDate"|"endsAt">,session:StaffSession){
  if(session.role!=="SUPERADMIN")throw new Error("FORBIDDEN");
  return withTransaction(async client=>{
    const sourceResult=await client.query<QueryResultRow&{id:string}>("SELECT * FROM ticketing_events WHERE id=$1 FOR SHARE",[sourceId]);const source=sourceResult.rows[0];if(!source)throw new Error("EVENT_NOT_FOUND");
    const id=randomUUID();
    await client.query(`INSERT INTO ticketing_events(id,slug,title,description,long_description,location,address,event_date,ends_at,doors_open_at,price,currency,capacity,status,event_type,visibility,is_free,is_charity,allows_companions,max_companions,cover_image,registration_opens_at,registration_closes_at,checkin_opens_at,checkin_closes_at,organizational_notes,contact_email,public_url)
      SELECT $2,$3,$4,description,long_description,location,address,$5,$6,NULL,price,currency,capacity,'DRAFT',event_type,visibility,is_free,is_charity,allows_companions,max_companions,cover_image,NULL,NULL,NULL,NULL,organizational_notes,contact_email,NULL FROM ticketing_events WHERE id=$1`,[sourceId,id,input.slug,input.title,input.eventDate,input.endsAt]);
    await client.query(`INSERT INTO ticketing_event_ticket_types(id,event_id,code,label,price,currency,is_free,max_quantity,is_public,is_active,display_order,notes)
      SELECT gen_random_uuid(),$2,code,label,price,currency,is_free,max_quantity,is_public,is_active,display_order,notes FROM ticketing_event_ticket_types WHERE event_id=$1`,[sourceId,id]);
    await client.query(`INSERT INTO ticketing_event_audit(id,event_id,action,performed_by_staff_id,performed_by_display_name,session_id,details) VALUES($1,$2,'DUPLICATED',$3,$4,$5,$6::jsonb)`,[randomUUID(),id,session.operatorId,session.displayName,session.sessionId,JSON.stringify({sourceEventId:sourceId})]);
    return id;
  });
}

export async function selectManagedEvent(eventId:string,session:StaffSession){
  if(session.role!=="SUPERADMIN")throw new Error("FORBIDDEN");
  await withTransaction(async client=>{
    const event=await client.query<{id:string}>("SELECT id FROM ticketing_events WHERE id=$1",[eventId]);if(!event.rows[0])throw new Error("EVENT_NOT_FOUND");
    await client.query("UPDATE ticketing_staff_sessions SET selected_event_id=$2,last_used_at=NOW() WHERE id=$1",[session.sessionId,eventId]);
    await client.query(`INSERT INTO ticketing_event_audit(id,event_id,action,performed_by_staff_id,performed_by_display_name,session_id) VALUES($1,$2,'SELECTED',$3,$4,$5)`,[randomUUID(),eventId,session.operatorId,session.displayName,session.sessionId]);
  });
}
