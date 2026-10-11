import "server-only";
import {createSign} from "node:crypto";
import type {DigitalTicketRecord} from "@/lib/ticketing/repository";
import {NIS_GALA_DETAILS} from "@/data/ticketing";
import {requireGoogleWalletConfiguration} from "@/lib/ticketing/wallet/config";
import {qualifiedGoogleWalletClassId,stableGoogleWalletObjectId} from "@/lib/ticketing/wallet/identifiers";
import {buildWalletTicketModel} from "@/lib/ticketing/wallet/model";

const base64Url=(value:string)=>Buffer.from(value).toString("base64url");

export function buildGoogleWalletObject(record:DigitalTicketRecord,issuerId:string,classId:string){
  const model=buildWalletTicketModel(record);const textModulesData=[
    {id:"status",header:"STATO",body:model.statusLabel},
    ...(model.companyInvitation?[{id:"company",header:"SOCIETÀ",body:model.companyName??"NIS"},{id:"allocation",header:"TIPO INVITO",body:model.allocationType??"Azienda"},{id:"entry",header:"INGRESSO",body:`${model.sequenceNumber} di ${model.totalQuantity}`}]:[{id:"category",header:"CATEGORIA",body:"Standard"},{id:"amount",header:"IMPORTO",body:model.amountLabel??""}]),
    {id:"venue",header:"LUOGO",body:`${NIS_GALA_DETAILS.venue}, ${NIS_GALA_DETAILS.venueAddress}, Roma`},
  ];
  return {
    id:stableGoogleWalletObjectId(issuerId,model.ticketId),classId:qualifiedGoogleWalletClassId(issuerId,classId),state:"ACTIVE",
    ticketHolderName:model.companyInvitation?(model.companyName??"NIS"):model.holderName,
    ticketNumber:model.ticketCode,
    barcode:{type:"QR_CODE",value:model.qrPayload,alternateText:model.ticketCode},
    textModulesData,
  };
}

export function createGoogleWalletSaveUrl(record:DigitalTicketRecord,issuedAt=Math.floor(Date.now()/1000)){
  const configuration=requireGoogleWalletConfiguration();const object=buildGoogleWalletObject(record,configuration.issuerId,configuration.classId);
  const header=base64Url(JSON.stringify({alg:"RS256",typ:"JWT"}));
  const claims=base64Url(JSON.stringify({iss:configuration.serviceAccountEmail,aud:"google",typ:"savetowallet",iat:issuedAt,origins:["https://www.nazionaleitalianasanitari.com"],payload:{eventTicketObjects:[object]}}));
  const unsigned=`${header}.${claims}`;const signature=createSign("RSA-SHA256").update(unsigned).end().sign(configuration.privateKey).toString("base64url");
  return `https://pay.google.com/gp/v/save/${unsigned}.${signature}`;
}
