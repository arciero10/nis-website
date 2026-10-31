import {NextResponse} from "next/server";
import {selectManagedEvent} from "@/lib/ticketing/event-management";
import {getStaffSession} from "@/lib/ticketing/staff-auth";

export const runtime="nodejs";

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});if(session.role!=="SUPERADMIN")return NextResponse.json({message:"Operazione riservata al Superadmin."},{status:403});
  const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({message:"Evento non valido."},{status:400});
  try{await selectManagedEvent(id,session);return NextResponse.json({selected:true});}catch(error){console.error("Event selection failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Selezione evento non riuscita."},{status:404});}
}
