export type StaffRole="STAFF"|"SUPERADMIN";
export type CheckInMethod="QR"|"MANUAL";
export type CheckInWindowState="OPEN"|"NOT_OPEN"|"CLOSED";
export type CheckInOperationalState="SCHEDULED"|"OPEN"|"CLOSED";
export type CheckInManualOverride="OPEN"|"CLOSED"|null;

export function resolveCheckInOperationalState(now:Date,opensAt:string|null,closesAt:string|null,manualOverride:CheckInManualOverride):CheckInOperationalState{
  if(manualOverride)return manualOverride;
  const opens=opensAt?new Date(opensAt).getTime():null;const closes=closesAt?new Date(closesAt).getTime():null;
  if(opensAt&&Number.isNaN(opens))return "SCHEDULED";
  if(closesAt&&Number.isNaN(closes))return "CLOSED";
  if(opens!==null&&now.getTime()<opens)return "SCHEDULED";
  if(closes!==null&&now.getTime()>closes)return "CLOSED";
  return "OPEN";
}

export function checkInWindowState(now:Date,opensAt:string|null,closesAt:string|null):CheckInWindowState{
  const state=resolveCheckInOperationalState(now,opensAt,closesAt,null);
  return state==="SCHEDULED"?"NOT_OPEN":state;
}

export function validReverseReason(value:unknown){return typeof value==="string"&&value.trim().length>=3&&value.trim().length<=500;}
