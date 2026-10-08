import {randomBytes,timingSafeEqual} from "node:crypto";
import {nisGala2026} from "@/data/ticketing";
import type {Invitation,InvitationStatus} from "@/types/ticketing";

const minimumTokenLength=24;
const maximumTokenLength=128;

function integerSetting(value:string|undefined,fallback:number,minimum:number){
  const parsed=Number(value);
  return Number.isInteger(parsed)&&parsed>=minimum?parsed:fallback;
}

function invitationStatus(value:string|undefined):InvitationStatus{
  return value==="DISABLED"||value==="EXPIRED"?value:"ACTIVE";
}

function secureTokenMatch(received:string,configured:string){
  const receivedBuffer=Buffer.from(received);
  const configuredBuffer=Buffer.from(configured);
  return receivedBuffer.length===configuredBuffer.length&&timingSafeEqual(receivedBuffer,configuredBuffer);
}

export function generateInvitationAccessToken(){
  return randomBytes(32).toString("base64url");
}

export function findConfiguredGalaInvitation(accessToken:string,now=new Date()):Invitation|null{
  const configuredToken=process.env.NIS_GALA_INVITATION_TOKEN?.trim()??"";
  const receivedToken=accessToken.trim();

  if(configuredToken.length<minimumTokenLength||configuredToken.length>maximumTokenLength) return null;
  if(receivedToken.length<minimumTokenLength||receivedToken.length>maximumTokenLength) return null;
  if(!secureTokenMatch(receivedToken,configuredToken)) return null;

  const configuredExpiry=process.env.NIS_GALA_INVITATION_EXPIRES_AT?.trim();
  const expiryDate=configuredExpiry?new Date(configuredExpiry):null;
  const expiresAt=expiryDate&&!Number.isNaN(expiryDate.getTime())?expiryDate.toISOString():null;
  const maxUses=integerSetting(process.env.NIS_GALA_INVITATION_MAX_USES,1,1);
  const usedCount=integerSetting(process.env.NIS_GALA_INVITATION_USED_COUNT,0,0);
  let status=invitationStatus(process.env.NIS_GALA_INVITATION_STATUS);

  if(status==="ACTIVE"&&expiryDate&&expiryDate.getTime()<=now.getTime()) status="EXPIRED";
  if(status!=="ACTIVE"||usedCount>=maxUses) return null;

  return {
    id:"inv_nis_gala_2026_primary",
    eventId:nisGala2026.id,
    accessToken:configuredToken,
    label:process.env.NIS_GALA_INVITATION_LABEL?.trim()||"Invito NIS Gala 2026",
    maxUses,
    usedCount,
    expiresAt,
    status,
    createdAt:"2026-10-08T00:00:00.000Z",
  };
}
