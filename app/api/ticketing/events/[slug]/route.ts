import {NextResponse} from "next/server";
import {ticketingRepository} from "@/lib/ticketing/repository";

export async function GET(request:Request,{params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const event=await ticketingRepository.findEventBySlug(slug);

  if(!event){
    return NextResponse.json({message:"Evento non trovato."},{status:404});
  }

  const accessToken=new URL(request.url).searchParams.get("accessToken")??"";
  const invitation=await ticketingRepository.findInvitationByAccessToken(accessToken);
  if(!invitation||invitation.eventId!==event.id){
    return NextResponse.json({message:"Invito non valido o non più disponibile."},{status:404});
  }

  return NextResponse.json({event});
}
