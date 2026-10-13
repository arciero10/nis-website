import {NextResponse} from "next/server";
import {cancelCharityRequest} from "@/lib/ticketing/charity-request-repository";
import {getStaffSession} from "@/lib/ticketing/staff-auth";

export const runtime="nodejs";

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});if(session.role!=="SUPERADMIN")return NextResponse.json({message:"Operazione riservata al Superadmin."},{status:403});const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({message:"Richiesta non valida."},{status:400});try{await cancelCharityRequest(id,session);return NextResponse.json({message:"Richiesta annullata."});}catch(error){return NextResponse.json({message:error instanceof Error?error.message:"Annullamento non riuscito."},{status:409});}}
