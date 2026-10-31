import {NextResponse} from "next/server";
import {createEventRsvp} from "@/lib/ticketing/public-events";

export const runtime="nodejs";
const clean=(value:unknown,max:number)=>typeof value==="string"?value.trim().slice(0,max):"";

export async function POST(request:Request,{params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))return NextResponse.json({message:"Evento non valido."},{status:400});
  try{const body=await request.json() as Record<string,unknown>;const firstName=clean(body.firstName,100);const lastName=clean(body.lastName,100);const email=clean(body.email,254).toLowerCase();const phone=clean(body.phone,40);const rawCompanions=Array.isArray(body.companions)?body.companions:[];const companions=rawCompanions.map(item=>{const person=item as Record<string,unknown>;return {firstName:clean(person.firstName,100),lastName:clean(person.lastName,100)};});if(!firstName||!lastName||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||companions.some(person=>!person.firstName||!person.lastName))return NextResponse.json({message:"Dati RSVP non validi."},{status:400});const id=await createEventRsvp(slug,{primary:{firstName,lastName,email,phone},companions,ticketTypeId:clean(body.ticketTypeId,36)||undefined,notes:clean(body.notes,1000)});return NextResponse.json({id},{status:201});}
  catch(error){const code=error instanceof Error?error.message:"";const messages:Record<string,string>={REGISTRATION_CLOSED:"Le registrazioni non sono aperte.",COMPANIONS_DISABLED:"Gli accompagnatori non sono consentiti.",TOO_MANY_COMPANIONS:"Numero accompagnatori non consentito.",TICKET_TYPE_INVALID:"Tipo ingresso non disponibile."};return NextResponse.json({message:messages[code]||"Registrazione non riuscita."},{status:code==="REGISTRATION_CLOSED"?409:400});}
}
