import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {CHECKIN_SESSION_COOKIE,hasValidStaffSessionToken} from "@/lib/ticketing/staff-auth";

export async function requireStaffSession(){
  const cookieStore=await cookies();
  const token=cookieStore.get(CHECKIN_SESSION_COOKIE)?.value??"";
  if(!await hasValidStaffSessionToken(token))redirect("/checkin");
}
