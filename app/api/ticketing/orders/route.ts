import {NextResponse} from "next/server";
import {ticketingRepository} from "@/lib/ticketing/repository";

export const runtime="nodejs";

const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type PurchasePayload={
  eventSlug?:unknown;
  accessToken?:unknown;
  firstName?:unknown;
  lastName?:unknown;
  email?:unknown;
  phone?:unknown;
  company?:unknown;
  privacyAccepted?:unknown;
};

function clean(value:unknown,maxLength:number){
  if(typeof value!=="string") return "";
  return value.replace(/[\u0000-\u001f\u007f]+/g," ").replace(/\s+/g," ").trim().slice(0,maxLength);
}

export async function POST(request:Request){
  let payload:PurchasePayload;
  try{
    payload=await request.json() as PurchasePayload;
  }catch{
    return NextResponse.json({message:"Richiesta non valida."},{status:400});
  }

  const eventSlug=clean(payload.eventSlug,100);
  const accessToken=clean(payload.accessToken,128);
  const firstName=clean(payload.firstName,80);
  const lastName=clean(payload.lastName,80);
  const email=clean(payload.email,160);
  const phone=clean(payload.phone,40);
  const company=clean(payload.company,140);

  if(!eventSlug||!accessToken||!firstName||!lastName||!emailPattern.test(email)||payload.privacyAccepted!==true){
    return NextResponse.json({message:"Controlla i campi obbligatori e il consenso privacy."},{status:400});
  }

  const event=await ticketingRepository.findEventBySlug(eventSlug);
  if(!event){
    return NextResponse.json({message:"Evento non trovato."},{status:404});
  }

  const invitation=await ticketingRepository.findInvitationByAccessToken(accessToken);
  if(!invitation||invitation.eventId!==event.id){
    return NextResponse.json({message:"Invito non valido o non più disponibile."},{status:404});
  }

  void phone;
  void company;

  return NextResponse.json({
    code:"PAYMENT_NOT_CONFIGURED",
    message:"Il pagamento online sara attivato nel prossimo blocco di sviluppo.",
  },{status:503});
}
