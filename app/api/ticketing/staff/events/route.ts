import {NextResponse} from "next/server";
import {parseManagedEventInput} from "@/lib/ticketing/event-input";
import {createManagedEvent,listManagedEvents} from "@/lib/ticketing/event-management";
import {getStaffSession} from "@/lib/ticketing/staff-auth";

export const runtime="nodejs";

export async function GET(request:Request){const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});if(session.role!=="SUPERADMIN")return NextResponse.json({message:"Operazione riservata al Superadmin."},{status:403});return NextResponse.json({events:await listManagedEvents(),selectedEventId:session.selectedEventId});}

export async function POST(request:Request){
  const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});if(session.role!=="SUPERADMIN")return NextResponse.json({message:"Operazione riservata al Superadmin."},{status:403});
  try{const input=parseManagedEventInput(await request.json() as Record<string,unknown>);if(!input)return NextResponse.json({message:"Configurazione evento non valida."},{status:400});const id=await createManagedEvent(input,session);return NextResponse.json({id},{status:201});}
  catch(error){const message=error instanceof Error?error.message:"unknown";console.error("Event creation failed",message);return NextResponse.json({message:message.includes("unique")?"Slug già utilizzato.":"Creazione evento non riuscita."},{status:409});}
}
