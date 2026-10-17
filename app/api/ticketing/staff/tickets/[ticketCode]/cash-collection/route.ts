import {NextResponse} from "next/server";
import {confirmCashCollection} from "@/lib/ticketing/manual-repository";
import {getStaffSession} from "@/lib/ticketing/staff-auth";

export const runtime="nodejs";

export async function POST(request:Request,{params}:{params:Promise<{ticketCode:string}>}){
  const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  if(session.role!=="SUPERADMIN")return NextResponse.json({message:"Solo il superadmin può confermare un incasso in contanti."},{status:403});
  try{const {ticketCode}=await params;const result=await confirmCashCollection(ticketCode,session);return NextResponse.json({message:result.updated?"Incasso registrato correttamente.":"L’incasso risultava già confermato."});}
  catch(error){const message=error instanceof Error?error.message:"Conferma non riuscita.";console.error("Cash collection confirmation failed",message);return NextResponse.json({message},{status:409});}
}
