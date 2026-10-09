import {NextResponse} from "next/server";
import {hasValidStaffSession} from "@/lib/ticketing/staff-auth";
import {ticketingRepository} from "@/lib/ticketing/repository";

export const runtime="nodejs";

export async function GET(request:Request){
  if(!await hasValidStaffSession(request))return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  const search=new URL(request.url).searchParams.get("q")?.trim()??"";
  if(search.length<2)return NextResponse.json({results:[]});
  if(search.length>100)return NextResponse.json({message:"Ricerca non valida."},{status:400});
  try{return NextResponse.json({results:await ticketingRepository.searchStaffTickets("nis-gala-2026",search)});}
  catch(error){console.error("Staff ticket search failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Ricerca temporaneamente non disponibile."},{status:500});}
}
