import {createHash,randomBytes} from "node:crypto";

export function generateInvitationAccessToken(){
  return randomBytes(32).toString("base64url");
}

export function hashInvitationAccessToken(accessToken:string){
  return createHash("sha256").update(accessToken).digest("hex");
}

export function validInvitationTokenShape(accessToken:string){
  return accessToken.length>=24&&accessToken.length<=128&&/^[A-Za-z0-9_-]+$/.test(accessToken);
}
