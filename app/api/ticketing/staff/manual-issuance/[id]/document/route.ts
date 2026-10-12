import {NextResponse} from "next/server";
import {getManualDocumentReference} from "@/lib/ticketing/manual-repository";
import {manualDocumentStorage} from "@/lib/ticketing/manual-storage";
import {getStaffSession} from "@/lib/ticketing/staff-auth";

export const runtime="nodejs";

export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  if(session.role!=="SUPERADMIN")return NextResponse.json({message:"Accesso riservato al superadmin."},{status:403});
  const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return new NextResponse(null,{status:404});
  try{const reference=await getManualDocumentReference(id);if(!reference)return new NextResponse(null,{status:404});const file=await manualDocumentStorage.download(reference.storageKey);return new NextResponse(new Uint8Array(file.content),{headers:{"Content-Type":reference.mimeType||file.mimeType,"Content-Length":String(reference.size),"Content-Disposition":`inline; filename*=UTF-8''${encodeURIComponent(reference.filename)}`,"Cache-Control":"private, no-store"}});}catch(error){console.error("Manual issuance document download failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Documento non disponibile."},{status:500});}
}
