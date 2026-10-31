import {EVENT_VISIBILITIES,type EventStatus,type EventVisibility} from "@/types/ticketing";

const publicStatuses=new Set<EventStatus>(["PUBLISHED","OPEN","CLOSED","COMPLETED","ARCHIVED","ANNOUNCED","SOLD_OUT"]);
const directStatuses=new Set<EventStatus>(["PUBLISHED","OPEN","CLOSED","COMPLETED","ARCHIVED","ANNOUNCED","SOLD_OUT"]);

export function isKnownEventVisibility(value:unknown):value is EventVisibility{
  return typeof value==="string"&&EVENT_VISIBILITIES.includes(value as EventVisibility);
}

export function safeEventVisibility(value:unknown):EventVisibility{
  return isKnownEventVisibility(value)?value:"INTERNAL";
}

export function isPubliclyDiscoverableEvent(event:{status:EventStatus;visibility:unknown}){
  return event.visibility==="PUBLIC"&&publicStatuses.has(event.status);
}

export function isDirectlyAccessibleEvent(event:{status:EventStatus;visibility:unknown}){
  return isKnownEventVisibility(event.visibility)&&directStatuses.has(event.status);
}

export function eventAcceptsPublicRsvp(event:{status:EventStatus;visibility:unknown}){
  return isKnownEventVisibility(event.visibility)&&event.status==="OPEN";
}
