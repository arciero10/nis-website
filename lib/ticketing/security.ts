import {randomBytes} from "node:crypto";

const TICKET_ALPHABET="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCharacters(length:number){
  const bytes=randomBytes(length);
  return Array.from(bytes,byte=>TICKET_ALPHABET[byte%TICKET_ALPHABET.length]).join("");
}

export function generateTicketCode(year=2026){
  const shortYear=String(year).slice(-2);
  return `NIS${shortYear}-${randomCharacters(8)}`;
}

export function generateQrToken(){
  return randomBytes(32).toString("base64url");
}
