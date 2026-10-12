import {ticketingRepository} from "@/lib/ticketing/repository";
import {createTicketPdf} from "@/lib/ticketing/ticket-pdf";

export const runtime="nodejs";export const dynamic="force-dynamic";

export async function GET(_:Request,{params}:{params:Promise<{qrToken:string}>}){
  const {qrToken}=await params;const record=await ticketingRepository.findDigitalTicketByQrToken(qrToken);if(!record)return new Response("Biglietto non trovato.",{status:404,headers:{"Cache-Control":"private, no-store"}});
  const pdf=await createTicketPdf(record);return new Response(Buffer.from(pdf),{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="NIS-Gala-${record.ticket.ticketCode}.pdf"`,"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow, noarchive"}});
}
