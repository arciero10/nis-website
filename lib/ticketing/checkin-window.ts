import {randomUUID} from "node:crypto";
import type {PoolClient,QueryResultRow} from "pg";
import {query,withTransaction} from "@/lib/ticketing/db";
import {resolveCheckInOperationalState,type CheckInManualOverride,type CheckInOperationalState} from "@/lib/ticketing/checkin-rules";
import type {StaffSession} from "@/lib/ticketing/staff-auth";

export const GALA_CHECKIN_EVENT_SLUG="nis-gala-2026";

type CheckInWindowRow=QueryResultRow&{
  id:string;
  slug:string;
  checkin_opens_at:Date|null;
  checkin_closes_at:Date|null;
  checkin_override_state:CheckInManualOverride;
  checkin_override_changed_at:Date|null;
  checkin_override_changed_by_display_name:string|null;
};

export type CheckInOperationalStatus={
  effectiveState:CheckInOperationalState;
  source:"AUTOMATIC"|"MANUAL";
  manualOverride:CheckInManualOverride;
  opensAt:string|null;
  closesAt:string|null;
  changedAt:string|null;
  changedBy:string|null;
};

const iso=(value:Date|null)=>value?.toISOString()??null;
const configuredTimes=(row:CheckInWindowRow)=>({
  opensAt:row.slug===GALA_CHECKIN_EVENT_SLUG?(process.env.NIS_GALA_CHECKIN_OPENS_AT?.trim()||iso(row.checkin_opens_at)):iso(row.checkin_opens_at),
  closesAt:row.slug===GALA_CHECKIN_EVENT_SLUG?(process.env.NIS_GALA_CHECKIN_CLOSES_AT?.trim()||iso(row.checkin_closes_at)):iso(row.checkin_closes_at),
});

function statusFromRow(row:CheckInWindowRow,now=new Date()):CheckInOperationalStatus{
  const {opensAt,closesAt}=configuredTimes(row);
  return {
    effectiveState:resolveCheckInOperationalState(now,opensAt,closesAt,row.checkin_override_state),
    source:row.checkin_override_state?"MANUAL":"AUTOMATIC",
    manualOverride:row.checkin_override_state,
    opensAt,
    closesAt,
    changedAt:iso(row.checkin_override_changed_at),
    changedBy:row.checkin_override_changed_by_display_name,
  };
}

const selectWindow=(suffix="")=>`SELECT id,slug,checkin_opens_at,checkin_closes_at,checkin_override_state,checkin_override_changed_at,checkin_override_changed_by_display_name FROM ticketing_events WHERE slug=$1${suffix}`;

export async function getCheckInOperationalStatus(slug=GALA_CHECKIN_EVENT_SLUG){
  const result=await query<CheckInWindowRow>(selectWindow(),[slug]);
  return result.rows[0]?statusFromRow(result.rows[0]):null;
}

export async function setCheckInManualOverride(action:"OPEN"|"CLOSE",session:StaffSession,slug=GALA_CHECKIN_EVENT_SLUG){
  if(session.role!=="SUPERADMIN")throw new Error("FORBIDDEN");
  return withTransaction(async(client:PoolClient)=>{
    const result=await client.query<CheckInWindowRow>(selectWindow(" FOR UPDATE"),[slug]);
    const event=result.rows[0];
    if(!event)throw new Error("EVENT_NOT_FOUND");
    const overrideState:Exclude<CheckInManualOverride,null>=action==="OPEN"?"OPEN":"CLOSED";
    const changedAt=new Date();
    await client.query(`UPDATE ticketing_events SET
      checkin_override_state=$2,
      checkin_override_changed_at=$3,
      checkin_override_changed_by_staff_id=$4,
      checkin_override_changed_by_display_name=$5,
      checkin_override_session_id=$6,
      updated_at=NOW()
      WHERE id=$1`,[event.id,overrideState,changedAt,session.operatorId,session.displayName,session.sessionId]);
    await client.query(`INSERT INTO ticketing_checkin_window_audit(
      id,event_id,action,performed_by_staff_id,performed_by_display_name,session_id,created_at
    ) VALUES($1,$2,$3,$4,$5,$6,$7)`,[randomUUID(),event.id,action,session.operatorId,session.displayName,session.sessionId,changedAt]);
    return statusFromRow({...event,checkin_override_state:overrideState,checkin_override_changed_at:changedAt,checkin_override_changed_by_display_name:session.displayName},changedAt);
  });
}
