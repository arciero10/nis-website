import {createHash} from "node:crypto";

export type ParticipantIdentity={firstName:string;lastName:string};

export function normalizeIdentityName(value:string){
  return value.normalize("NFKD").replace(/\p{M}+/gu,"").toLocaleLowerCase("it-IT").replace(/[^\p{L}\p{N}]+/gu," ").trim().replace(/\s+/g," ");
}

export function normalizeIdentityEmail(value:string){
  return value.normalize("NFKC").trim().toLowerCase();
}

export function normalizeIdentityPhone(value:string|null|undefined){
  const digits=(value??"").replace(/\D+/g,"");
  return digits.startsWith("00")?digits.slice(2):digits;
}

export function normalizeDonationReference(value:string){
  return value.normalize("NFKC").trim().toUpperCase().replace(/\s+/g,"");
}

export function normalizedParticipantKeys(participants:ParticipantIdentity[]){
  return participants.map(participant=>`${normalizeIdentityName(participant.firstName)}|${normalizeIdentityName(participant.lastName)}`).sort();
}

export function participantSignature(participants:ParticipantIdentity[]){
  return normalizedParticipantKeys(participants).join("::");
}

export function sameParticipants(first:ParticipantIdentity[],second:ParticipantIdentity[]){
  return participantSignature(first)===participantSignature(second);
}

export function participantsOverlap(first:ParticipantIdentity[],second:ParticipantIdentity[]){
  const firstKeys=new Set(normalizedParticipantKeys(first));
  return normalizedParticipantKeys(second).some(key=>firstKeys.has(key));
}

export function strongContactMatch(first:{email:string;phone?:string|null},second:{email:string;phone?:string|null}){
  const sameEmail=normalizeIdentityEmail(first.email)===normalizeIdentityEmail(second.email);
  const firstPhone=normalizeIdentityPhone(first.phone);
  const secondPhone=normalizeIdentityPhone(second.phone);
  return sameEmail||Boolean(firstPhone&&secondPhone&&firstPhone===secondPhone);
}

function hash(value:string){return createHash("sha256").update(value).digest("hex");}

export function requestDedupeKeys(eventId:string,participants:ParticipantIdentity[],email:string,phone?:string|null){
  const signature=participantSignature(participants);
  const normalizedEmail=normalizeIdentityEmail(email);
  const normalizedPhone=normalizeIdentityPhone(phone);
  return {
    emailKey:hash(`${eventId}|email|${normalizedEmail}|${signature}`),
    phoneKey:normalizedPhone?hash(`${eventId}|phone|${normalizedPhone}|${signature}`):null,
  };
}
