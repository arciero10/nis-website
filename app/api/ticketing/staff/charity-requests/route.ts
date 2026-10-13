import {NextResponse} from "next/server";
import {listPendingCharityRequests} from "@/lib/ticketing/charity-request-repository";
import {getStaffSession} from "@/lib/ticketing/staff-auth";

export const runtime="nodejs";

export async function GET(request:Request){const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});if(session.role!=="SUPERADMIN")return NextResponse.json({message:"Operazione riservata al Superadmin."},{status:403});try{return NextResponse.json({requests:await listPendingCharityRequests("nis-gala-2026")});}catch(error){console.error("Charity requests listing failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Elenco temporaneamente non disponibile."},{status:500});}}
