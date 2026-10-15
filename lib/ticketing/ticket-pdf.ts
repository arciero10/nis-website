import {readFile} from "node:fs/promises";
import path from "node:path";
import {PDFDocument,rgb,StandardFonts,type PDFFont} from "pdf-lib";
import QRCode from "qrcode";
import type {DigitalTicketRecord} from "@/lib/ticketing/repository";
import {buildTicketQrPayload,invitationTypeLabel,ticketStatusLabel} from "@/lib/ticketing/presentation";
import {formatTicketHolderName} from "@/lib/ticketing/name-format";

function fittedFontSize(text:string,maxWidth:number,font:PDFFont,preferred=28,minimum=14){
  let size=preferred;while(size>minimum&&font.widthOfTextAtSize(text,size)>maxWidth)size-=1;return size;
}

export async function createTicketPdf(record:DigitalTicketRecord){
  const document=await PDFDocument.create();const page=document.addPage([595.28,841.89]);const regular=await document.embedFont(StandardFonts.Helvetica);const bold=await document.embedFont(StandardFonts.HelveticaBold);
  const hero=await document.embedPng(await readFile(path.join(process.cwd(),"public","images","nis-gala-2026-ticket-hero.png")));const qr=await document.embedPng(await QRCode.toBuffer(buildTicketQrPayload(record.ticket.qrToken),{errorCorrectionLevel:"M",margin:2,width:500,color:{dark:"#041d3b",light:"#ffffff"}}));
  const navy=rgb(4/255,29/255,59/255);const blue=rgb(11/255,99/255,182/255);const muted=rgb(82/255,107/255,131/255);const scale=595.28/hero.width;const heroHeight=hero.height*scale;
  page.drawImage(hero,{x:0,y:841.89-heroHeight,width:595.28,height:heroHeight});
  const admin=record.ticket.issuanceSource==="ADMIN";const company=record.ticket.issuanceSource==="COMPANY";const holder=company?(record.companyName??"Invito aziendale"):formatTicketHolderName(record.attendee.firstName,record.attendee.lastName);const type=invitationTypeLabel(record.ticket.invitationType);
  page.drawText(admin?`INVITO ${type.toUpperCase()}`:company?"INVITO AZIENDALE":"BIGLIETTO NOMINATIVO",{x:44,y:480,size:11,font:bold,color:blue});
  const holderSize=fittedFontSize(holder,507,bold);const holderX=company?44:44+(507-bold.widthOfTextAtSize(holder,holderSize))/2;page.drawText(holder,{x:holderX,y:445,size:holderSize,font:bold,color:navy,maxWidth:507});
  if(company)page.drawText(`${type} - Ingresso ${record.ticket.sequenceNumber??1} di ${record.ticket.totalQuantity??1}`,{x:44,y:420,size:12,font:regular,color:muted});
  else if(admin)page.drawText(`Tipo invito: ${type}`,{x:44,y:420,size:12,font:regular,color:muted});
  page.drawImage(qr,{x:188,y:170,width:220,height:220});
  page.drawText("MOSTRA QUESTO QR ALL'INGRESSO",{x:179,y:148,size:10,font:bold,color:muted});
  page.drawText("CODICE TICKET",{x:44,y:115,size:9,font:bold,color:muted});page.drawText(record.ticket.ticketCode,{x:44,y:94,size:15,font:bold,color:navy});
  page.drawText("STATO",{x:390,y:115,size:9,font:bold,color:muted});page.drawText(ticketStatusLabel(record.ticket.status),{x:390,y:94,size:13,font:bold,color:record.ticket.status==="ACTIVE"?rgb(10/255,140/255,73/255):navy});
  page.drawLine({start:{x:44,y:76},end:{x:551,y:76},thickness:1,color:rgb(.85,.89,.93)});
  page.drawText("28 ottobre 2026 - Another Studio - Via di Pietralata 183, 00158 Roma RM",{x:44,y:56,size:9,font:regular,color:muted});
  page.drawText("Parcheggio: Parking Pietralata - Via del Casale Rocchi 3, Roma",{x:44,y:40,size:9,font:regular,color:muted});
  return document.save();
}
