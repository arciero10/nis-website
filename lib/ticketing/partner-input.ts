import type {CreatePartnerAllocationInput,PartnerNomineeInput} from "@/lib/ticketing/repository";

const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean=(value:unknown,max:number)=>typeof value==="string"?value.replace(/[\u0000-\u001f\u007f]+/g," ").replace(/\s+/g," ").trim().slice(0,max):"";

export function parsePartnerAllocationInput(payload:Record<string,unknown>):CreatePartnerAllocationInput|null{
  const companyName=clean(payload.companyName,160);const contactEmail=clean(payload.contactEmail,160).toLowerCase();const packageName=clean(payload.packageName,120);const notes=clean(payload.notes,2000);const allocatedQuantity=Number(payload.allocatedQuantity);
  const rawAmount=payload.partnershipAmount;
  let partnershipAmountCents: number|undefined;
  if(rawAmount!==undefined&&rawAmount!==null&&String(rawAmount).trim()!==""){
    const amount=Number(rawAmount);if(!Number.isFinite(amount)||amount<0||amount>100_000_000)return null;partnershipAmountCents=Math.round(amount*100);
  }
  if(!companyName||!emailPattern.test(contactEmail)||!Number.isInteger(allocatedQuantity)||allocatedQuantity<1||allocatedQuantity>10_000)return null;
  return {companyName,contactEmail,packageName:packageName||undefined,partnershipAmountCents,allocatedQuantity,notes:notes||undefined};
}

export function parsePartnerNomineeInput(payload:Record<string,unknown>):PartnerNomineeInput|null{
  const firstName=clean(payload.firstName,80);const lastName=clean(payload.lastName,80);const email=clean(payload.email,160).toLowerCase();const phone=clean(payload.phone,40);
  if(!firstName||!lastName||!emailPattern.test(email))return null;
  return {firstName,lastName,email,phone:phone||undefined};
}
