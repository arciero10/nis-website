import {randomUUID} from "node:crypto";
import type {PoolClient,QueryResultRow} from "pg";
import {query,withTransaction} from "@/lib/ticketing/db";
import {eventAcceptsPublicRsvp,isDirectlyAccessibleEvent,safeEventVisibility} from "@/lib/ticketing/event-visibility";
import {formatPersonNamePart} from "@/lib/ticketing/name-format";
import type {Event,EventTicketType} from "@/types/ticketing";

type PublicEventRow=QueryResultRow&{id:string;slug:string;title:string;description:string;long_description:string|null;location:string|null;address:string|null;event_date:Date|null;ends_at:Date|null;doors_open_at:Date|null;registration_opens_at:Date|null;registration_closes_at:Date|null;checkin_opens_at:Date|null;checkin_closes_at:Date|null;price:string|null;currency:string;capacity:number|null;status:Event["status"];event_type:Event["eventType"];visibility:string;is_free:boolean;is_charity:boolean;allows_companions:boolean;max_companions:number|null;cover_image:string|null;organizational_notes:string|null;contact_email:string|null;public_url:string|null;completed_at:Date|null;archived_at:Date|null;created_at:Date;updated_at:Date};
type TicketTypeRow=QueryResultRow&{id:string;event_id:string;code:string;label:string;price:string|null;currency:string;is_free:boolean;max_quantity:number|null;is_public:boolean;is_active:boolean;display_order:number;notes:string|null};
const iso=(value:Date|null)=>value?.toISOString()??null;
const mapEvent=(r:PublicEventRow):Event=>({id:r.id,slug:r.slug,title:r.title,description:r.description,longDescription:r.long_description,location:r.location,address:r.address,eventDate:iso(r.event_date),endsAt:iso(r.ends_at),doorsOpenAt:iso(r.doors_open_at),registrationOpensAt:iso(r.registration_opens_at),registrationClosesAt:iso(r.registration_closes_at),checkinOpensAt:iso(r.checkin_opens_at),checkinClosesAt:iso(r.checkin_closes_at),price:r.price===null?null:Number(r.price),currency:r.currency,capacity:r.capacity,status:r.status,eventType:r.event_type,visibility:safeEventVisibility(r.visibility),isFree:r.is_free,isCharity:r.is_charity,allowsCompanions:r.allows_companions,maxCompanions:r.max_companions,coverImage:r.cover_image,organizationalNotes:r.organizational_notes,contactEmail:r.contact_email,publicUrl:r.public_url,completedAt:iso(r.completed_at),archivedAt:iso(r.archived_at),createdAt:r.created_at.toISOString(),updatedAt:r.updated_at.toISOString()});
const mapTicketType=(r:TicketTypeRow):EventTicketType=>({id:r.id,eventId:r.event_id,code:r.code,label:r.label,price:r.price===null?null:Number(r.price),currency:r.currency,isFree:r.is_free,maxQuantity:r.max_quantity,isPublic:r.is_public,isActive:r.is_active,displayOrder:r.display_order,notes:r.notes});

export async function listPublicEvents(){const result=await query<PublicEventRow>("SELECT * FROM ticketing_events WHERE visibility='PUBLIC' AND status IN ('PUBLISHED','OPEN','CLOSED','COMPLETED','ARCHIVED','ANNOUNCED','SOLD_OUT') ORDER BY event_date DESC NULLS LAST,created_at DESC");return result.rows.map(mapEvent);}
export async function findPublicEvent(slug:string){const result=await query<PublicEventRow>("SELECT * FROM ticketing_events WHERE slug=$1",[slug]);if(!result.rows[0]||!isDirectlyAccessibleEvent({status:result.rows[0].status,visibility:result.rows[0].visibility}))return null;return mapEvent(result.rows[0]);}
export async function listPublicTicketTypes(eventId:string){const result=await query<TicketTypeRow>("SELECT * FROM ticketing_event_ticket_types WHERE event_id=$1 AND is_active=TRUE AND is_public=TRUE ORDER BY display_order,label",[eventId]);return result.rows.map(mapTicketType);}

type RsvpPerson={firstName:string;lastName:string;email?:string;phone?:string};
export async function createEventRsvp(slug:string,input:{primary:RsvpPerson;companions:RsvpPerson[];ticketTypeId?:string;notes?:string}){
  return withTransaction(async(client:PoolClient)=>{
    const eventResult=await client.query<PublicEventRow>("SELECT * FROM ticketing_events WHERE slug=$1 FOR UPDATE",[slug]);const row=eventResult.rows[0];if(!row||!eventAcceptsPublicRsvp({status:row.status,visibility:row.visibility}))throw new Error("REGISTRATION_CLOSED");
    const now=Date.now();if(row.registration_opens_at&&row.registration_opens_at.getTime()>now||row.registration_closes_at&&row.registration_closes_at.getTime()<=now)throw new Error("REGISTRATION_CLOSED");
    if(input.companions.length&&!row.allows_companions)throw new Error("COMPANIONS_DISABLED");if(row.max_companions!==null&&input.companions.length>row.max_companions)throw new Error("TOO_MANY_COMPANIONS");
    if(input.ticketTypeId){const ticketType=await client.query<{id:string}>("SELECT id FROM ticketing_event_ticket_types WHERE id=$1 AND event_id=$2 AND is_active=TRUE AND is_public=TRUE",[input.ticketTypeId,row.id]);if(!ticketType.rows[0])throw new Error("TICKET_TYPE_INVALID");}
    const primaryId=randomUUID();const paymentStatus=row.is_free?"NOT_REQUIRED":"PENDING";
    await client.query("INSERT INTO ticketing_registrations(id,event_id,ticket_type_id,participant_role,first_name,last_name,email,phone,rsvp_status,payment_status,notes) VALUES($1,$2,$3,'PRIMARY',$4,$5,$6,$7,'CONFIRMED',$8,$9)",[primaryId,row.id,input.ticketTypeId||null,formatPersonNamePart(input.primary.firstName),formatPersonNamePart(input.primary.lastName),input.primary.email||null,input.primary.phone||null,paymentStatus,input.notes||null]);
    for(const companion of input.companions)await client.query("INSERT INTO ticketing_registrations(id,event_id,ticket_type_id,primary_registration_id,participant_role,first_name,last_name,email,phone,rsvp_status,payment_status) VALUES($1,$2,$3,$4,'COMPANION',$5,$6,$7,$8,'CONFIRMED',$9)",[randomUUID(),row.id,input.ticketTypeId||null,primaryId,formatPersonNamePart(companion.firstName),formatPersonNamePart(companion.lastName),companion.email||null,companion.phone||null,paymentStatus]);
    return primaryId;
  });
}
