import {createHash} from "node:crypto";
import {NextResponse} from "next/server";
import {parseBankTransferInput,receiptContentMatchesMime,validIdempotencyKey,validateReceipt} from "@/lib/ticketing/manual-input";
import {createManualIssuance,findManualIssuanceByIdempotencyKey} from "@/lib/ticketing/manual-repository";
import {manualDocumentStorage} from "@/lib/ticketing/manual-storage";
import {getStaffSession} from "@/lib/ticketing/staff-auth";
import {deliverTicketEmail} from "@/lib/ticketing/ticket-email";

export const runtime="nodejs";

const extensionFor=(mime:string)=>mime==="application/pdf"?"pdf":mime==="image/png"?"png":"jpg";
const safeFilename=(name:string)=>name.replace(/[\r\n"\\/]+/g,"-").trim().slice(0,180)||"contabile";

export async function POST(request:Request){
  const session=await getStaffSession(request);if(!session)return NextResponse.json({message:"Sessione staff non valida."},{status:401});
  const idempotencyKey=request.headers.get("Idempotency-Key")?.trim()??"";if(!validIdempotencyKey(idempotencyKey))return NextResponse.json({message:"Chiave di invio non valida."},{status:400});
  try{
    const existing=await findManualIssuanceByIdempotencyKey(idempotencyKey);if(existing){await Promise.all(existing.emailPayloads.map(payload=>deliverTicketEmail(payload)));return NextResponse.json({issuanceId:existing.issuanceId,source:existing.source,created:false,tickets:existing.tickets.map(({ticketCode})=>({ticketCode}))});}
    const data=await request.formData();const input=parseBankTransferInput(data);if(!input)return NextResponse.json({message:"Controlla i campi obbligatori e i valori inseriti."},{status:400});
    const value=data.get("receipt");const receipt=validateReceipt(value instanceof File?value:null,session.role==="STAFF");if(!receipt.ok)return NextResponse.json({message:receipt.message},{status:400});
    let document=null;let uploadedKey:string|null=null;let ownsUpload=false;
    if(receipt.file){
      const content=Buffer.from(await receipt.file.arrayBuffer());if(!receiptContentMatchesMime(content,receipt.file.type))return NextResponse.json({message:"Il contenuto della contabile non corrisponde al formato dichiarato."},{status:400});
      const digest=createHash("sha256").update(idempotencyKey).digest("hex");uploadedKey=`gala-2026/bonifici/${digest}.${extensionFor(receipt.file.type)}`;
      ownsUpload=await manualDocumentStorage.upload(uploadedKey,content,receipt.file.type);
      document={storageKey:uploadedKey,originalFilename:safeFilename(receipt.file.name),mimeType:receipt.file.type,size:receipt.file.size};
    }
    try{
      const result=await createManualIssuance("nis-gala-2026",idempotencyKey,input,document,session);
      await Promise.all(result.emailPayloads.map(payload=>deliverTicketEmail(payload)));
      return NextResponse.json({issuanceId:result.issuanceId,source:result.source,created:result.created,tickets:result.tickets.map(({ticketCode})=>({ticketCode}))},{status:result.created?201:200});
    }catch(error){if(uploadedKey&&ownsUpload)await manualDocumentStorage.remove(uploadedKey);throw error;}
  }catch(error){
    console.error("Manual bank transfer ticket issuance failed",error instanceof Error?error.message:"unknown");
    return NextResponse.json({message:"Non è stato possibile emettere i biglietti. Riprova senza ripetere l'invio."},{status:500});
  }
}
