import {createHash,randomBytes,randomUUID,timingSafeEqual} from "node:crypto";
import {query} from "@/lib/ticketing/db";
import type {StaffRole} from "@/lib/ticketing/checkin-rules";

export const CHECKIN_SESSION_COOKIE="nis_checkin_session";
export const CHECKIN_SESSION_MAX_AGE=60*60*8;

export type StaffSession={sessionId:string;operatorId:string;displayName:string;role:StaffRole;loginAt:string};
type StaffSessionRow={id:string;operator_id:string;display_name:string;role:StaffRole;login_at:Date};

const hash=(value:string)=>createHash("sha256").update(value).digest("hex");
const digest=(value:string)=>createHash("sha256").update(value).digest();
const matches=(provided:string,expected:string|undefined)=>Boolean(expected?.trim())&&timingSafeEqual(digest(provided),digest(expected!.trim()));

export function checkOperatorPin(provided:string):{role:StaffRole;displayName:string}|null{
  const staffPin=process.env.NIS_STAFF_PIN?.trim()||process.env.NIS_CHECKIN_PIN?.trim();
  const superadminPin=process.env.NIS_SUPERADMIN_PIN?.trim();
  if(!staffPin&&!superadminPin)throw new Error("NIS_STAFF_PIN/NIS_SUPERADMIN_PIN non configurati.");
  if(matches(provided,superadminPin))return {role:"SUPERADMIN",displayName:process.env.NIS_SUPERADMIN_DISPLAY_NAME?.trim()||"Superadmin"};
  if(matches(provided,staffPin))return {role:"STAFF",displayName:process.env.NIS_STAFF_DISPLAY_NAME?.trim()||"Staff"};
  return null;
}

export async function createStaffSession(identity:{role:StaffRole;displayName:string}){
  const token=randomBytes(32).toString("base64url");const sessionId=randomUUID();const operatorId=randomUUID();
  await query("DELETE FROM ticketing_staff_sessions WHERE expires_at<=NOW() OR revoked_at IS NOT NULL");
  await query("INSERT INTO ticketing_staff_sessions(id,token_hash,operator_id,display_name,role,login_at,expires_at) VALUES($1,$2,$3,$4,$5,NOW(),NOW()+($6*INTERVAL '1 second'))",[sessionId,hash(token),operatorId,identity.displayName,identity.role,CHECKIN_SESSION_MAX_AGE]);
  return {token,session:{sessionId,operatorId,displayName:identity.displayName,role:identity.role,loginAt:new Date().toISOString()} satisfies StaffSession};
}

function cookieValue(request:Request){
  const header=request.headers.get("cookie")??"";
  for(const part of header.split(";")){const [name,...value]=part.trim().split("=");if(name===CHECKIN_SESSION_COOKIE)return decodeURIComponent(value.join("="));}
  return "";
}

const mapSession=(row:StaffSessionRow):StaffSession=>({sessionId:row.id,operatorId:row.operator_id,displayName:row.display_name,role:row.role,loginAt:row.login_at.toISOString()});

export async function getStaffSession(request:Request){return getStaffSessionByToken(cookieValue(request));}

export async function getStaffSessionByToken(token:string):Promise<StaffSession|null>{
  if(!token)return null;
  const result=await query<StaffSessionRow>("UPDATE ticketing_staff_sessions SET last_used_at=NOW() WHERE token_hash=$1 AND revoked_at IS NULL AND expires_at>NOW() RETURNING id,operator_id,display_name,role,login_at",[hash(token)]);
  return result.rows[0]?mapSession(result.rows[0]):null;
}

export async function hasValidStaffSession(request:Request){return Boolean(await getStaffSession(request));}
export async function hasValidStaffSessionToken(token:string){return Boolean(await getStaffSessionByToken(token));}

export async function revokeStaffSession(request:Request){
  const token=cookieValue(request);if(token)await query("UPDATE ticketing_staff_sessions SET revoked_at=NOW() WHERE token_hash=$1",[hash(token)]);
}
