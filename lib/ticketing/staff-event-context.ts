import {query} from "@/lib/ticketing/db";
import type {StaffSession} from "@/lib/ticketing/staff-auth";
import type {EventStatus} from "@/types/ticketing";

export type StaffEventContext={id:string;slug:string;title:string;status:EventStatus};

export async function getStaffEventContext(session:StaffSession):Promise<StaffEventContext>{
  const result=await query<StaffEventContext>(`SELECT id,slug,title,status FROM ticketing_events
    WHERE ($1::uuid IS NULL OR id=$1)
    ORDER BY CASE status WHEN 'OPEN' THEN 0 WHEN 'PUBLISHED' THEN 1 WHEN 'CLOSED' THEN 2 WHEN 'COMPLETED' THEN 3 WHEN 'ARCHIVED' THEN 4 ELSE 5 END,event_date DESC NULLS LAST,created_at DESC LIMIT 1`,[session.selectedEventId]);
  if(result.rows[0])return result.rows[0];
  const fallback=await query<StaffEventContext>("SELECT id,slug,title,status FROM ticketing_events ORDER BY event_date DESC NULLS LAST,created_at DESC LIMIT 1");
  if(!fallback.rows[0])throw new Error("NO_TICKETING_EVENT");return fallback.rows[0];
}
