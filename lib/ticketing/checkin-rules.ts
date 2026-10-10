export type StaffRole="STAFF"|"SUPERADMIN";
export type CheckInMethod="QR"|"MANUAL";
export type CheckInWindowState="OPEN"|"NOT_OPEN"|"CLOSED";

export function checkInWindowState(now:Date,opensAt:string|null,closesAt:string|null):CheckInWindowState{
  const opens=opensAt?new Date(opensAt).getTime():null;const closes=closesAt?new Date(closesAt).getTime():null;
  if(opensAt&&Number.isNaN(opens))return "NOT_OPEN";
  if(closesAt&&Number.isNaN(closes))return "CLOSED";
  if(opens!==null&&now.getTime()<opens)return "NOT_OPEN";
  if(closes!==null&&now.getTime()>closes)return "CLOSED";
  return "OPEN";
}

export function canBypassCheckInWindow(role:StaffRole){return role==="SUPERADMIN";}

export function validReverseReason(value:unknown){return typeof value==="string"&&value.trim().length>=3&&value.trim().length<=500;}
