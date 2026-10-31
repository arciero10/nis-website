import {NextResponse} from "next/server";
import {getStaffSession} from "@/lib/ticketing/staff-auth";
import {getStaffEventContext} from "@/lib/ticketing/staff-event-context";
import {ticketingRepository} from "@/lib/ticketing/repository";

export const runtime="nodejs";

export async function GET(request:Request){
  const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  const search=new URL(request.url).searchParams.get("q")?.trim()??"";
  if(search.length<2)return NextResponse.json({results:[]});
  if(search.length>100)return NextResponse.json({message:"Ricerca non valida."},{status:400});
  try{const event=await getStaffEventContext(session);return NextResponse.json({results:await ticketingRepository.searchStaffTickets(event.slug,search)});}
  catch(error){console.error("Staff ticket search failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:"Ricerca temporaneamente non disponibile."},{status:500});}
}
