import "server-only";
import {readFile} from "node:fs/promises";
import {join} from "node:path";
import forge from "node-forge";
import {PKPass} from "passkit-generator";
import type {DigitalTicketRecord} from "@/lib/ticketing/repository";
import {NIS_GALA_DETAILS} from "@/data/ticketing";
import {requireAppleWalletConfiguration} from "@/lib/ticketing/wallet/config";
import {buildWalletTicketModel} from "@/lib/ticketing/wallet/model";

function certificateToPem(base64:string){
  const decoded=Buffer.from(base64,"base64");const text=decoded.toString("utf8");
  if(text.includes("-----BEGIN CERTIFICATE-----"))return text;
  const asn1=forge.asn1.fromDer(decoded.toString("binary"));
  return forge.pki.certificateToPem(forge.pki.certificateFromAsn1(asn1));
}

function extractSigner(certificateBase64:string,password:string){
  const der=Buffer.from(certificateBase64,"base64").toString("binary");
  const p12=forge.pkcs12.pkcs12FromAsn1(forge.asn1.fromDer(der),false,password);
  const keyBags=p12.getBags({bagType:forge.pki.oids.pkcs8ShroudedKeyBag})[forge.pki.oids.pkcs8ShroudedKeyBag]
    ??p12.getBags({bagType:forge.pki.oids.keyBag})[forge.pki.oids.keyBag];
  const certBags=p12.getBags({bagType:forge.pki.oids.certBag})[forge.pki.oids.certBag];
  const key=keyBags?.find(bag=>bag.key)?.key;const certificate=certBags?.find(bag=>bag.cert)?.cert;
  if(!key||!certificate)throw new Error("Certificato Apple Wallet non valido");
  return {signerKey:forge.pki.privateKeyToPem(key),signerCert:forge.pki.certificateToPem(certificate)};
}

async function passAssets(){
  const directory=join(process.cwd(),"public","wallet","apple");
  const [icon,icon2x,icon3x,logo,logo2x,logo3x]=await Promise.all(["icon.png","icon@2x.png","icon@3x.png","logo.png","logo@2x.png","logo@3x.png"].map(file=>readFile(join(directory,file))));
  return {"icon.png":icon,"icon@2x.png":icon2x,"icon@3x.png":icon3x,"logo.png":logo,"logo@2x.png":logo2x,"logo@3x.png":logo3x};
}

export async function createAppleWalletPass(record:DigitalTicketRecord){
  const configuration=requireAppleWalletConfiguration();const model=buildWalletTicketModel(record);const signer=extractSigner(configuration.certificateBase64,configuration.certificatePassword);
  const primaryFields=model.companyInvitation
    ?[{key:"company",label:"INVITO",value:model.companyName??"NIS"}]
    :[{key:"holder",label:"PARTECIPANTE",value:model.holderName??""}];
  const secondaryFields=model.companyInvitation
    ?[{key:"entry",label:"INGRESSO",value:`${model.sequenceNumber} di ${model.totalQuantity}`},{key:"type",label:"TIPO INVITO",value:model.allocationType??"Azienda"}]
    :[{key:"category",label:"CATEGORIA",value:"Standard"},{key:"amount",label:"IMPORTO",value:model.amountLabel??""}];
  const pass=new PKPass(await passAssets(),{
    wwdr:certificateToPem(configuration.wwdrCertificateBase64),signerCert:signer.signerCert,signerKey:signer.signerKey,
  },{
    formatVersion:1,serialNumber:model.ticketCode,passTypeIdentifier:configuration.passTypeIdentifier,teamIdentifier:configuration.teamIdentifier,
    organizationName:"Nazionale Italiana Sanitari",description:"Biglietto NIS Gala Charity Night",logoText:"NIS Gala",
    foregroundColor:"rgb(255, 255, 255)",backgroundColor:"rgb(4, 29, 59)",labelColor:"rgb(167, 197, 226)",sharingProhibited:false,
    voided:record.ticket.status==="CANCELLED"||record.ticket.status==="REFUNDED",
  });
  pass.type="eventTicket";
  pass.primaryFields.push(...primaryFields);
  pass.secondaryFields.push(...secondaryFields);
  pass.auxiliaryFields.push({key:"code",label:"CODICE TICKET",value:model.ticketCode},{key:"status",label:"STATO",value:model.statusLabel});
  pass.backFields.push({key:"event",label:"Evento",value:model.eventTitle},{key:"date",label:"Data",value:NIS_GALA_DETAILS.dateLabel},{key:"venue",label:"Luogo",value:`${NIS_GALA_DETAILS.venue}, ${NIS_GALA_DETAILS.venueAddress}, Roma`});
  pass.setBarcodes({format:"PKBarcodeFormatQR",message:model.qrPayload,altText:model.ticketCode,messageEncoding:"iso-8859-1"});
  return pass.getAsBuffer();
}
