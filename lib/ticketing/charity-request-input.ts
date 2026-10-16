import {validTicketQuantity} from "@/lib/ticketing/rules";
import {normalizeIdentityEmail,normalizeIdentityPhone} from "@/lib/ticketing/participant-identity";
import {formatPersonNamePart} from "@/lib/ticketing/name-format";

const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean=(value:unknown,max:number)=>typeof value==="string"?value.normalize("NFKC").replace(/[\u0000-\u001f\u007f]+/g," ").replace(/\s+/g," ").trim().slice(0,max):"";

export type CharityParticipantInput={firstName:string;lastName:string};
export type CharityParticipationInput={requestId:string;firstName:string;lastName:string;email:string;phone:string|null;quantity:number;participants:CharityParticipantInput[];privacyAccepted:true};

export function parseCharityParticipationInput(payload:unknown):CharityParticipationInput|null{
  const value=payload&&typeof payload==="object"?payload as Record<string,unknown>:{};const requestId=clean(value.requestId,36);const firstName=formatPersonNamePart(clean(value.firstName,80));const lastName=formatPersonNamePart(clean(value.lastName,80));const email=normalizeIdentityEmail(clean(value.email,254));const phone=normalizeIdentityPhone(clean(value.phone,40));const quantity=Number(value.quantity);
  const participants=Array.isArray(value.participants)?value.participants.map(item=>{const participant=item&&typeof item==="object"?item as Record<string,unknown>:{};return {firstName:formatPersonNamePart(clean(participant.firstName,80)),lastName:formatPersonNamePart(clean(participant.lastName,80))};}):[];
  if(!/^[0-9a-f-]{36}$/i.test(requestId)||!firstName||!lastName||!emailPattern.test(email)||!validTicketQuantity(quantity)||participants.length!==quantity||participants.some(participant=>!participant.firstName||!participant.lastName)||participants[0]?.firstName!==firstName||participants[0]?.lastName!==lastName||value.privacyAccepted!==true)return null;
  return {requestId,firstName,lastName,email,phone:phone||null,quantity,participants,privacyAccepted:true};
}
