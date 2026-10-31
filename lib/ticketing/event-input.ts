import {EVENT_TYPES,EVENT_VISIBILITIES,type EventType,type EventVisibility} from "@/types/ticketing";
import type {CreateManagedEventInput} from "@/lib/ticketing/event-management";

const text=(value:unknown,max:number)=>typeof value==="string"?value.trim().slice(0,max):"";
const dateTime=(value:unknown)=>{const valueText=text(value,40);return valueText&&!Number.isNaN(new Date(valueText).getTime())?new Date(valueText).toISOString():"";};

export function parseManagedEventInput(payload:Record<string,unknown>):CreateManagedEventInput|null{
  const title=text(payload.title,160);const slug=text(payload.slug,100).toLowerCase();const eventDate=dateTime(payload.eventDate);const endsAt=dateTime(payload.endsAt);
  const eventType=text(payload.eventType,20).toUpperCase() as EventType;const visibility=text(payload.visibility,20).toUpperCase() as EventVisibility;
  const isFree=payload.isFree===true;const allowsCompanions=payload.allowsCompanions===true;const price=payload.price===""||payload.price==null?null:Number(payload.price);const capacity=payload.capacity===""||payload.capacity==null?null:Number(payload.capacity);const maxCompanions=payload.maxCompanions===""||payload.maxCompanions==null?null:Number(payload.maxCompanions);
  if(!title||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||!eventDate||!endsAt||new Date(eventDate)>=new Date(endsAt)||!EVENT_TYPES.includes(eventType)||!EVENT_VISIBILITIES.includes(visibility))return null;
  if(capacity!==null&&(!Number.isInteger(capacity)||capacity<1))return null;if(!isFree&&(price===null||!Number.isFinite(price)||price<0))return null;if(isFree&&price!==null&&price!==0)return null;
  if(maxCompanions!==null&&(!Number.isInteger(maxCompanions)||maxCompanions<0||maxCompanions>20))return null;if(!allowsCompanions&&maxCompanions!==null&&maxCompanions!==0)return null;
  return {title,slug,description:text(payload.description,500),eventDate,endsAt,location:text(payload.location,200),address:text(payload.address,300),capacity,eventType,isFree,price:isFree?null:price,currency:text(payload.currency,3).toUpperCase()||"EUR",visibility,allowsCompanions,maxCompanions:allowsCompanions?maxCompanions:null,coverImage:text(payload.coverImage,500),registrationOpensAt:dateTime(payload.registrationOpensAt),registrationClosesAt:dateTime(payload.registrationClosesAt),checkinOpensAt:dateTime(payload.checkinOpensAt),checkinClosesAt:dateTime(payload.checkinClosesAt)};
}

export function parseDuplicateEventInput(payload:Record<string,unknown>){
  const title=text(payload.title,160);const slug=text(payload.slug,100).toLowerCase();const eventDate=dateTime(payload.eventDate);const endsAt=dateTime(payload.endsAt);
  return title&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)&&eventDate&&endsAt&&new Date(eventDate)<new Date(endsAt)?{title,slug,eventDate,endsAt}:null;
}
