import {getEmailProvider} from "@/lib/email/provider";
import {buildTicketEmailContent} from "@/lib/ticketing/email-content";
import {GALA_REPLY_TO} from "@/lib/ticketing/email-config";
import {buildPartnerInvitationEmailContent} from "@/lib/ticketing/partner-email-content";
import {getPartnerArchiveStorage} from "@/lib/ticketing/partner-archive-storage";
import {createPartnerTicketArchive} from "@/lib/ticketing/partner-ticket-archive";
import {ticketingRepository,type TicketConfirmation,type TicketEmailPayload} from "@/lib/ticketing/repository";
import {walletLinksForToken} from "@/lib/ticketing/wallet/config";

export async function deliverTicketEmail(payload:TicketEmailPayload,force=false){
  try{if(!await ticketingRepository.claimTicketEmail(payload.ticketId,force))return {status:"SKIPPED" as const};}
  catch{console.error("Ticket email claim failed");return {status:"FAILED" as const};}
  try{const content=buildTicketEmailContent({...payload,walletLinks:walletLinksForToken(payload.qrToken)});await getEmailProvider().send({to:payload.email,replyTo:GALA_REPLY_TO,subject:content.subject,text:content.text,html:content.html});await ticketingRepository.markTicketEmailSent(payload.ticketId);return {status:"SENT" as const};}
  catch(error){try{await ticketingRepository.markTicketEmailFailed(payload.ticketId,error instanceof Error?error.message:"Errore provider email");}catch{console.error("Ticket email failure state could not be saved");}console.error("Ticket email delivery failed");return {status:"FAILED" as const};}
}

export async function deliverConfirmationTicketEmails(confirmation:TicketConfirmation){
  return Promise.all(confirmation.tickets.map((ticket,index)=>{const attendee=confirmation.attendees[index];return deliverTicketEmail({ticketId:ticket.id,firstName:attendee.firstName,lastName:attendee.lastName,email:attendee.email,ticketCode:ticket.ticketCode,qrToken:ticket.qrToken,category:ticket.category,amount:confirmation.event.price,currency:confirmation.event.currency,source:"STANDARD",companyName:null,allocationType:null,issuanceSource:"PAYPAL",invitationType:"STANDARD"});}));
}

export async function resendTicketEmail(ticketCode:string){const payload=await ticketingRepository.findTicketEmailPayload(ticketCode);if(!payload)return {status:"NOT_FOUND" as const};return deliverTicketEmail(payload,true);}

export async function deliverPartnerAllocationEmail(allocationId:string,force=false){
  const payload=await ticketingRepository.findPartnerAllocationEmailPayload(allocationId);if(!payload)return {status:"NOT_FOUND" as const};
  try{if(!await ticketingRepository.claimPartnerAllocationEmail(allocationId,force))return {status:"SKIPPED" as const};}
  catch{console.error("Partner invitation email claim failed");return {status:"FAILED" as const};}
  try{
    const tickets=payload.tickets.map(ticket=>({...ticket,walletLinks:walletLinksForToken(ticket.qrToken)}));const provider=getEmailProvider();
    let archiveUrl:string|null=null;
    try{const archive=await createPartnerTicketArchive(payload);const uploaded=await getPartnerArchiveStorage().upload(archive.name,archive.content);archiveUrl=uploaded.url;}
    catch{console.error("Archive upload failed - email sent with private links only");}
    const content=buildPartnerInvitationEmailContent({companyName:payload.companyName,allocationType:payload.allocationType,packageName:payload.packageName,archiveUrl,tickets});
    await provider.send({to:payload.contactEmail,replyTo:GALA_REPLY_TO,subject:content.subject,text:content.text,html:content.html});
    await ticketingRepository.markPartnerAllocationEmailSent(allocationId);return {status:"SENT" as const,archiveAvailable:Boolean(archiveUrl)};
  }
  catch(error){try{await ticketingRepository.markPartnerAllocationEmailFailed(allocationId,error instanceof Error?error.message:"Errore provider email");}catch{console.error("Partner invitation email failure state could not be saved");}console.error("Partner invitation email delivery failed");return {status:"ERROR" as const};}
}
