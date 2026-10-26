import {NextResponse} from "next/server";
import {TicketingConflictError,ticketingRepository} from "@/lib/ticketing/repository";
import {getStaffSession} from "@/lib/ticketing/staff-auth";

export const runtime="nodejs";

export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});if(session.role!=="SUPERADMIN")return NextResponse.json({message:"Operazione riservata al Superadmin."},{status:403});
  const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({message:"Assegnazione non valida."},{status:400});
  try{const allocation=await ticketingRepository.getPartnerAllocation(id);return allocation?NextResponse.json({allocation}):NextResponse.json({message:"Assegnazione non trovata."},{status:404});}
  catch(error){console.error("Partner allocation detail failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Dettaglio partner temporaneamente non disponibile."},{status:500});}
}

export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){
  const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});if(session.role!=="SUPERADMIN")return NextResponse.json({message:"Operazione riservata al Superadmin."},{status:403});
  const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({message:"Assegnazione non valida."},{status:400});
  try{return await ticketingRepository.cancelPartnerAllocation(id)?NextResponse.json({message:"Assegnazione annullata. I ticket ancora validi sono stati disattivati."}):NextResponse.json({message:"Assegnazione non trovata."},{status:404});}
  catch(error){if(error instanceof TicketingConflictError)return NextResponse.json({message:error.message,code:error.code},{status:409});console.error("Partner allocation cancellation failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Annullamento temporaneamente non disponibile."},{status:500});}
}
