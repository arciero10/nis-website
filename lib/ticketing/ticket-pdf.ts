import {readFile} from "node:fs/promises";
import path from "node:path";
import {PDFDocument,rgb,StandardFonts,type PDFImage,type PDFFont} from "pdf-lib";
import QRCode from "qrcode";
import {GALA_SPONSOR_LABEL,galaSponsors} from "@/data/gala-sponsors";
import {panteleiaFooter} from "@/data/panteleia";
import type {DigitalTicketRecord} from "@/lib/ticketing/repository";
import {buildTicketQrPayload,invitationTypeLabel,ticketStatusLabel} from "@/lib/ticketing/presentation";
import {formatTicketHolderName} from "@/lib/ticketing/name-format";

function fittedFontSize(text:string,maxWidth:number,font:PDFFont,preferred=28,minimum=14){
  let size=preferred;while(size>minimum&&font.widthOfTextAtSize(text,size)>maxWidth)size-=1;return size;
}

function containedSize(image:PDFImage,maxWidth:number,maxHeight:number){const scale=Math.min(maxWidth/image.width,maxHeight/image.height);return {width:image.width*scale,height:image.height*scale};}

export async function createTicketPdf(record:DigitalTicketRecord){
  const document=await PDFDocument.create();const page=document.addPage([595.28,841.89]);const regular=await document.embedFont(StandardFonts.Helvetica);const bold=await document.embedFont(StandardFonts.HelveticaBold);
  const hero=await document.embedPng(await readFile(path.join(process.cwd(),"public","images","nis-gala-2026-ticket-hero.png")));const qr=await document.embedPng(await QRCode.toBuffer(buildTicketQrPayload(record.ticket.qrToken),{errorCorrectionLevel:"M",margin:2,width:500,color:{dark:"#041d3b",light:"#ffffff"}}));const sponsorImages=await Promise.all(galaSponsors.map(async sponsor=>({sponsor,image:await document.embedPng(await readFile(path.join(process.cwd(),"public",...sponsor.image.split("/").filter(Boolean))))})));
  const navy=rgb(4/255,29/255,59/255);const blue=rgb(11/255,99/255,182/255);const muted=rgb(82/255,107/255,131/255);const scale=595.28/hero.width;const heroHeight=hero.height*scale;
  page.drawImage(hero,{x:0,y:841.89-heroHeight,width:595.28,height:heroHeight});
  const admin=record.ticket.issuanceSource==="ADMIN";const company=record.ticket.issuanceSource==="COMPANY";const holder=company?(record.companyName??"Invito aziendale"):formatTicketHolderName(record.attendee.firstName,record.attendee.lastName);const type=invitationTypeLabel(record.ticket.invitationType);
  page.drawText(admin?`INVITO ${type.toUpperCase()}`:company?"INVITO AZIENDALE":"BIGLIETTO NOMINATIVO",{x:44,y:480,size:11,font:bold,color:blue});
  const holderSize=fittedFontSize(holder,507,bold);const holderX=company?44:44+(507-bold.widthOfTextAtSize(holder,holderSize))/2;page.drawText(holder,{x:holderX,y:445,size:holderSize,font:bold,color:navy,maxWidth:507});
  if(company)page.drawText(`${type} - Ingresso ${record.ticket.sequenceNumber??1} di ${record.ticket.totalQuantity??1}`,{x:44,y:420,size:12,font:regular,color:muted});
  page.drawImage(qr,{x:188,y:205,width:220,height:220});
  page.drawText("MOSTRA QUESTO QR ALL'INGRESSO",{x:179,y:183,size:10,font:bold,color:muted});
  page.drawText("CODICE TICKET",{x:44,y:170,size:9,font:bold,color:muted});page.drawText(record.ticket.ticketCode,{x:44,y:149,size:15,font:bold,color:navy});
  page.drawText("STATO",{x:390,y:170,size:9,font:bold,color:muted});page.drawText(ticketStatusLabel(record.ticket.status),{x:390,y:149,size:13,font:bold,color:record.ticket.status==="ACTIVE"?rgb(10/255,140/255,73/255):navy});
  page.drawText("28 ottobre 2026 - Another Studio - Via di Pietralata 183, 00158 Roma RM",{x:44,y:134,size:7.4,font:regular,color:muted});
  page.drawText("Parcheggio: Parking Pietralata - Via del Casale Rocchi 3, Roma",{x:44,y:124,size:7.4,font:regular,color:muted});
  page.drawRectangle({x:44,y:47,width:507,height:68,color:rgb(.975,.98,.985),borderColor:rgb(.84,.88,.91),borderWidth:.5});
  page.drawText(GALA_SPONSOR_LABEL,{x:(595.28-bold.widthOfTextAtSize(GALA_SPONSOR_LABEL,5.8))/2,y:106,size:5.8,font:bold,color:muted});
  const sponsorRows=[sponsorImages.slice(0,5),sponsorImages.slice(5)];
  sponsorRows.forEach((row,rowIndex)=>{const slotGap=5;const slotWidth=91;const rowWidth=row.length*slotWidth+(row.length-1)*slotGap;const slotStart=(595.28-rowWidth)/2;const rowY=rowIndex===0?79:53;row.forEach(({image},index)=>{const size=containedSize(image,slotWidth,20);const slotX=slotStart+index*(slotWidth+slotGap);page.drawImage(image,{x:slotX+(slotWidth-size.width)/2,y:rowY+(20-size.height)/2,width:size.width,height:size.height});});});
  const footerNavy=rgb(7/255,29/255,55/255);const footerGold=rgb(216/255,188/255,114/255);const footerText=rgb(211/255,220/255,232/255);page.drawRectangle({x:0,y:0,width:595.28,height:43,color:footerNavy});page.drawLine({start:{x:44,y:43},end:{x:551,y:43},thickness:.6,color:rgb(52/255,72/255,96/255)});
  const poweredSize=6.6;const nameSize=7.2;const subtitleSize=6.6;const footerGap=7;const poweredWidth=bold.widthOfTextAtSize(panteleiaFooter.poweredBy,poweredSize);const nameWidth=bold.widthOfTextAtSize(panteleiaFooter.name,nameSize);const subtitleWidth=regular.widthOfTextAtSize(panteleiaFooter.subtitle,subtitleSize);let footerX=(595.28-poweredWidth-nameWidth-subtitleWidth-footerGap*2)/2;
  page.drawText(panteleiaFooter.poweredBy,{x:footerX,y:30,size:poweredSize,font:bold,color:footerGold});footerX+=poweredWidth+footerGap;page.drawText(panteleiaFooter.name,{x:footerX,y:30,size:nameSize,font:bold,color:rgb(1,1,1)});footerX+=nameWidth+footerGap;page.drawText(panteleiaFooter.subtitle,{x:footerX,y:30,size:subtitleSize,font:regular,color:footerText});
  const legalSize=6.2;page.drawText(panteleiaFooter.compactLegalLine1,{x:(595.28-regular.widthOfTextAtSize(panteleiaFooter.compactLegalLine1,legalSize))/2,y:17,size:legalSize,font:regular,color:footerText});page.drawText(panteleiaFooter.compactLegalLine2,{x:(595.28-regular.widthOfTextAtSize(panteleiaFooter.compactLegalLine2,legalSize))/2,y:7,size:legalSize,font:regular,color:footerText});
  return document.save();
}
