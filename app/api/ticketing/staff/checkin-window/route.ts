import {NextResponse} from "next/server";
import {getCheckInOperationalStatus,setCheckInManualOverride} from "@/lib/ticketing/checkin-window";
import {getStaffSession} from "@/lib/ticketing/staff-auth";

export const runtime="nodejs";

export async function GET(request:Request){
  const session=await getStaffSession(request);
  if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  try{
    const window=await getCheckInOperationalStatus();
    if(!window)return NextResponse.json({message:"Evento non trovato."},{status:404});
    return NextResponse.json({window,role:session.role},{headers:{"Cache-Control":"private, no-store"}});
  }catch(error){
    console.error("Check-in window lookup failed",error instanceof Error?error.message:"unknown");
    return NextResponse.json({message:"Stato check-in non disponibile."},{status:500});
  }
}

export async function POST(request:Request){
  const session=await getStaffSession(request);
  if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  if(session.role!=="SUPERADMIN")return NextResponse.json({message:"Operazione riservata al Superadmin."},{status:403});
  const payload=await request.json().catch(()=>({})) as {action?:unknown};
  if(payload.action!=="OPEN"&&payload.action!=="CLOSE")return NextResponse.json({message:"Azione non valida."},{status:400});
  try{
    const window=await setCheckInManualOverride(payload.action,session);
    return NextResponse.json({window},{headers:{"Cache-Control":"private, no-store"}});
  }catch(error){
    console.error("Check-in window override failed",error instanceof Error?error.message:"unknown");
    return NextResponse.json({message:"Aggiornamento stato check-in non riuscito."},{status:500});
  }
}
