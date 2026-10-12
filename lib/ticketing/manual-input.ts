import type {AdminInvitationType,ComplimentaryReason} from "@/types/ticketing";

const ADMIN_TYPES:AdminInvitationType[]=["STAMPA","MEDIA","PRESS","OMAGGIO"];
const LEGACY_REASONS:ComplimentaryReason[]=["INSTITUTIONAL_GUEST","NIS_GUEST","SPEAKER","STAFF_ORGANIZATION","COURTESY","OTHER"];

export const MANUAL_TICKET_MAX_QUANTITY=10;
export const RECEIPT_MAX_BYTES=10*1024*1024;
export const RECEIPT_MIME_TYPES=["application/pdf","image/jpeg","image/png"] as const;

const clean=(value:FormDataEntryValue|null,max:number)=>typeof value==="string"?value.replace(/[\u0000-\u001f\u007f]+/g," ").trim().slice(0,max):"";
const validEmail=(value:string)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)&&value.length<=254;
const quantity=(value:string)=>{const parsed=Number(value);return Number.isInteger(parsed)&&parsed>=1&&parsed<=MANUAL_TICKET_MAX_QUANTITY?parsed:null;};
const amount=(value:string)=>{const parsed=Number(value.replace(",","."));return Number.isFinite(parsed)&&parsed>0&&parsed<=1_000_000?Math.round(parsed*100)/100:null;};
const validDate=(value:string)=>!value||(/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(`${value}T00:00:00Z`)));

export type BankTransferIssuanceInput={source:"BANK_TRANSFER";firstName:string;lastName:string;email:string;phone?:string;quantity:number;declaredAmount:number;transferDate:string|null;transferReference:string|null;notes:string|null};
export type AdminIssuanceInput={source:"ADMIN";invitationType:AdminInvitationType;firstName:string;lastName:string;email:string;phone?:string;quantity:number;organization:string|null;reason:string;notes:string|null};

export function parseBankTransferInput(data:FormData){
  const firstName=clean(data.get("firstName"),80);const lastName=clean(data.get("lastName"),80);const email=clean(data.get("email"),254).toLowerCase();const phone=clean(data.get("phone"),40);const parsedQuantity=quantity(clean(data.get("quantity"),2));const declaredAmount=amount(clean(data.get("declaredAmount"),20));const transferDate=clean(data.get("transferDate"),10);const transferReference=clean(data.get("transferReference"),120);const notes=clean(data.get("notes"),1000);
  if(!firstName||!lastName||!validEmail(email)||parsedQuantity===null||declaredAmount===null||!validDate(transferDate))return null;
  return {source:"BANK_TRANSFER",firstName,lastName,email,phone:phone||undefined,quantity:parsedQuantity,declaredAmount,transferDate:transferDate||null,transferReference:transferReference||null,notes:notes||null} satisfies BankTransferIssuanceInput;
}

export function parseAdminInput(data:FormData){
  const invitationType=clean(data.get("invitationType"),20) as AdminInvitationType;const firstName=clean(data.get("firstName"),80);const lastName=clean(data.get("lastName"),80);const email=clean(data.get("email"),254).toLowerCase();const phone=clean(data.get("phone"),40);const parsedQuantity=quantity(clean(data.get("quantity"),2));const organization=clean(data.get("organization"),180);const reason=clean(data.get("reason"),500);const notes=clean(data.get("notes"),1000);
  if(!ADMIN_TYPES.includes(invitationType)||!firstName||!lastName||!validEmail(email)||parsedQuantity===null||!reason)return null;
  return {source:"ADMIN",invitationType,firstName,lastName,email,phone:phone||undefined,quantity:parsedQuantity,organization:organization||null,reason,notes:notes||null} satisfies AdminIssuanceInput;
}

export function parseComplimentaryInput(data:FormData){
  const legacyReason=clean(data.get("reason"),40) as ComplimentaryReason;const reasonOther=clean(data.get("reasonOther"),300);if(!LEGACY_REASONS.includes(legacyReason)||(legacyReason==="OTHER"&&!reasonOther))return null;
  data.set("invitationType","OMAGGIO");data.set("reason",reasonOther||legacyReason.replaceAll("_"," "));
  return parseAdminInput(data);
}

export function validateReceipt(file:File|null,required:boolean){
  if(!file||file.size===0)return required?{ok:false as const,message:"La contabile del bonifico è obbligatoria."}:{ok:true as const,file:null};
  if(file.size>RECEIPT_MAX_BYTES)return {ok:false as const,message:"La contabile non può superare 10 MB."};
  if(!RECEIPT_MIME_TYPES.includes(file.type as (typeof RECEIPT_MIME_TYPES)[number]))return {ok:false as const,message:"Formato contabile non valido. Usa PDF, JPG, JPEG o PNG."};
  return {ok:true as const,file};
}

export function receiptContentMatchesMime(content:Uint8Array,mimeType:string){
  if(mimeType==="application/pdf")return content.length>=5&&String.fromCharCode(...content.slice(0,5))==="%PDF-";
  if(mimeType==="image/png")return content.length>=8&&[137,80,78,71,13,10,26,10].every((byte,index)=>content[index]===byte);
  if(mimeType==="image/jpeg")return content.length>=3&&content[0]===0xff&&content[1]===0xd8&&content[2]===0xff;
  return false;
}

export function validIdempotencyKey(value:string){return /^[A-Za-z0-9_-]{16,128}$/.test(value);}
