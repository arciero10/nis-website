import {NextResponse} from "next/server";
import {buildParticipantExportDataset,type ParticipantExportFilters} from "@/lib/ticketing/participant-export-model";
import {buildParticipantPdf} from "@/lib/ticketing/participant-export-pdf";
import {loadParticipantExportEvent,loadParticipantExportRows} from "@/lib/ticketing/participant-export-repository";
import {buildParticipantXlsx} from "@/lib/ticketing/participant-export-xlsx";
import {getStaffSession} from "@/lib/ticketing/staff-auth";
import {INVITATION_TYPES,TICKET_ISSUANCE_SOURCES} from "@/types/ticketing";

export const runtime="nodejs";
export const dynamic="force-dynamic";

function parseFilters(url:string):ParticipantExportFilters{
  const params=new URL(url).searchParams;const scope=params.get("scope")==="ALL"?"ALL":"FILTERED";const query=params.get("q")?.trim()??"";const status=params.get("status")?.toUpperCase()??"ALL";const source=params.get("source")?.toUpperCase()??"ALL";const type=params.get("type")?.toUpperCase()??"ALL";const from=params.get("from")||null;const to=params.get("to")||null;
  if(query.length>100||!["ALL","VALID","USED","CANCELLED","NOT_USED"].includes(status)||!(source==="ALL"||TICKET_ISSUANCE_SOURCES.includes(source as (typeof TICKET_ISSUANCE_SOURCES)[number]))||!(type==="ALL"||type==="OMAGGIO"||INVITATION_TYPES.includes(type as (typeof INVITATION_TYPES)[number]))||from&&!/^\d{4}-\d{2}-\d{2}$/.test(from)||to&&!/^\d{4}-\d{2}-\d{2}$/.test(to))throw new Error("INVALID_FILTERS");
  return {scope,query,status:status as ParticipantExportFilters["status"],source:source as ParticipantExportFilters["source"],type:type as ParticipantExportFilters["type"],from,to};
}

export async function GET(request:Request,{params}:{params:Promise<{format:string}>}){
  const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});if(session.role!=="SUPERADMIN")return NextResponse.json({message:"Esportazione riservata al Superadmin."},{status:403});
  const {format}=await params;if(format!=="xlsx"&&format!=="pdf")return NextResponse.json({message:"Formato non supportato."},{status:404});
  try{
    const filters=parseFilters(request.url);const [rows,event]=await Promise.all([loadParticipantExportRows("nis-gala-2026",filters),loadParticipantExportEvent("nis-gala-2026")]);const dataset=buildParticipantExportDataset(rows,filters,new Date().toISOString(),event);const bytes=format==="xlsx"?buildParticipantXlsx(dataset):await buildParticipantPdf(dataset);const stamp=new Date().toISOString().slice(0,10);const mime=format==="xlsx"?"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":"application/pdf";
    return new Response(Buffer.from(bytes),{headers:{"Content-Type":mime,"Content-Disposition":`attachment; filename="nis-gala-2026-partecipanti-${stamp}.${format}"`,"Cache-Control":"private, no-store, max-age=0","X-Robots-Tag":"noindex, nofollow, noarchive","X-Content-Type-Options":"nosniff"}});
  }catch(error){if(error instanceof Error&&error.message==="INVALID_FILTERS")return NextResponse.json({message:"Filtri di esportazione non validi."},{status:400});if(error instanceof Error&&error.message==="EXPORT_ROW_LIMIT")return NextResponse.json({message:"Troppi risultati: restringi i filtri prima di esportare."},{status:413});console.error("Participant export failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Esportazione temporaneamente non disponibile."},{status:500});}
}
