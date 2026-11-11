import {formatPersonNamePart} from "@/lib/ticketing/name-format";
import {addressVerificationFor,isDeclaredRomeMunicipality,NISSETTONE_MAX_QUANTITY,type NissettoneDeliveryMethod} from "@/lib/nissettone/rules";

const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean=(value:unknown,max:number)=>typeof value==="string"?value.replace(/[\u0000-\u001f\u007f]+/g," ").replace(/\s+/g," ").trim().slice(0,max):"";

export type NissettoneOrderInput={requestId:string;quantity:number;firstName:string;lastName:string;email:string;phone:string;deliveryMethod:NissettoneDeliveryMethod;street:string|null;houseNumber:string|null;postcode:string|null;city:string|null;details:string|null;notes:string|null;privacyAccepted:true;termsAccepted:true};

export function parseNissettoneOrderInput(payload:unknown):NissettoneOrderInput|null{
  const value=payload&&typeof payload==="object"?payload as Record<string,unknown>:{};
  const requestId=clean(value.requestId,36);const quantity=Number(value.quantity);const firstName=formatPersonNamePart(clean(value.firstName,80));const lastName=formatPersonNamePart(clean(value.lastName,80));const email=clean(value.email,254).toLowerCase();const phone=clean(value.phone,40);const deliveryMethod=clean(value.deliveryMethod,20) as NissettoneDeliveryMethod;
  if(!/^[0-9a-f-]{36}$/i.test(requestId)||!Number.isInteger(quantity)||quantity<1||quantity>NISSETTONE_MAX_QUANTITY||!firstName||!lastName||!emailPattern.test(email)||phone.length<5||!(["PICKUP","DELIVERY"] as string[]).includes(deliveryMethod)||value.privacyAccepted!==true||value.termsAccepted!==true)return null;
  if(deliveryMethod==="PICKUP")return {requestId,quantity,firstName,lastName,email,phone,deliveryMethod,street:null,houseNumber:null,postcode:null,city:null,details:null,notes:clean(value.notes,500)||null,privacyAccepted:true,termsAccepted:true};
  const street=clean(value.street,160);const houseNumber=clean(value.houseNumber,30);const postcode=clean(value.postcode,10);const city=clean(value.city,80);const details=clean(value.details,120);const notes=clean(value.notes,500);
  if(!street||!houseNumber||!/^\d{5}$/.test(postcode)||!isDeclaredRomeMunicipality(city))return null;
  return {requestId,quantity,firstName,lastName,email,phone,deliveryMethod,street,houseNumber,postcode,city:"Roma",details:details||null,notes:notes||null,privacyAccepted:true,termsAccepted:true};
}

export function orderAddressVerification(input:NissettoneOrderInput){return addressVerificationFor(input.deliveryMethod);}
