import {createHash,randomBytes,randomUUID,timingSafeEqual} from "node:crypto";
import {query} from "@/lib/ticketing/db";

export const CHECKIN_SESSION_COOKIE="nis_checkin_session";
export const CHECKIN_SESSION_MAX_AGE=60*60*8;

const hash=(value:string)=>createHash("sha256").update(value).digest("hex");
const digest=(value:string)=>createHash("sha256").update(value).digest();

export function checkOperatorPin(provided:string){
  const expected=process.env.NIS_CHECKIN_PIN?.trim();
  if(!expected)throw new Error("NIS_CHECKIN_PIN non configurato.");
  return timingSafeEqual(digest(provided),digest(expected));
}

export async function createStaffSession(){
  const token=randomBytes(32).toString("base64url");
  await query("DELETE FROM ticketing_staff_sessions WHERE expires_at<=NOW() OR revoked_at IS NOT NULL");
  await query("INSERT INTO ticketing_staff_sessions(id,token_hash,expires_at) VALUES($1,$2,NOW()+($3*INTERVAL '1 second'))",[randomUUID(),hash(token),CHECKIN_SESSION_MAX_AGE]);
  return token;
}

function cookieValue(request:Request){
  const header=request.headers.get("cookie")??"";
  for(const part of header.split(";")){const [name,...value]=part.trim().split("=");if(name===CHECKIN_SESSION_COOKIE)return decodeURIComponent(value.join("="));}
  return "";
}

export async function hasValidStaffSession(request:Request){
  const token=cookieValue(request);if(!token)return false;
  return hasValidStaffSessionToken(token);
}

export async function hasValidStaffSessionToken(token:string){
  if(!token)return false;
  const result=await query("UPDATE ticketing_staff_sessions SET last_used_at=NOW() WHERE token_hash=$1 AND revoked_at IS NULL AND expires_at>NOW() RETURNING id",[hash(token)]);
  return Boolean(result.rowCount);
}

export async function revokeStaffSession(request:Request){
  const token=cookieValue(request);if(token)await query("UPDATE ticketing_staff_sessions SET revoked_at=NOW() WHERE token_hash=$1",[hash(token)]);
}
