import {NextResponse} from "next/server";
import {parseDuplicateEventInput} from "@/lib/ticketing/event-input";
import {duplicateManagedEvent} from "@/lib/ticketing/event-management";
import {getStaffSession} from "@/lib/ticketing/staff-auth";

export const runtime="nodejs";

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});if(session.role!=="SUPERADMIN")return NextResponse.json({message:"Operazione riservata al Superadmin."},{status:403});
  const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({message:"Evento non valido."},{status:400});
  try{const input=parseDuplicateEventInput(await request.json() as Record<string,unknown>);if(!input)return NextResponse.json({message:"Dati duplicazione non validi."},{status:400});return NextResponse.json({id:await duplicateManagedEvent(id,input,session)},{status:201});}
  catch(error){console.error("Event duplication failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Duplicazione evento non riuscita."},{status:409});}
}
