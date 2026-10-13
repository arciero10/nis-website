import {NextResponse} from "next/server";
import {issueCharityRequest} from "@/lib/ticketing/charity-request-repository";
import {getStaffSession} from "@/lib/ticketing/staff-auth";
import {deliverTicketEmail} from "@/lib/ticketing/ticket-email";

export const runtime="nodejs";

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});if(session.role!=="SUPERADMIN")return NextResponse.json({message:"Operazione riservata al Superadmin."},{status:403});const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({message:"Richiesta non valida."},{status:400});try{const result=await issueCharityRequest(id,session);const deliveries=await Promise.all(result.emailPayloads.map(payload=>deliverTicketEmail(payload)));return NextResponse.json({message:deliveries.every(item=>item.status==="SENT")?"Donazione confermata, ticket emessi ed email inviate.":"Donazione confermata e ticket emessi. Una o più email potranno essere reinviate.",tickets:result.tickets.map(ticket=>({ticketCode:ticket.ticketCode}))});}catch(error){console.error("Charity request issuance failed",error instanceof Error?error.message:"unknown");return NextResponse.json({message:error instanceof Error?error.message:"Emissione non riuscita."},{status:409});}}
