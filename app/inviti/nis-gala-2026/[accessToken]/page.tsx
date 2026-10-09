import {notFound} from "next/navigation";
import GalaInvitationCheckout from "@/components/GalaInvitationCheckout";
import {ticketingRepository} from "@/lib/ticketing/repository";

export const dynamic="force-dynamic";

export default async function GalaInvitationPage({params}:{params:Promise<{accessToken:string}>}){
  const {accessToken}=await params;
  const [invitation,event,availability]=await Promise.all([ticketingRepository.findInvitationByAccessToken(accessToken),ticketingRepository.findEventBySlug("nis-gala-2026"),ticketingRepository.getEventAvailability("nis-gala-2026")]);
  if(!invitation||!event||!availability||invitation.eventId!==event.id)notFound();
  return <GalaInvitationCheckout event={event} accessToken={accessToken} paypalClientId={process.env.PAYPAL_CLIENT_ID?.trim()??""} availableSeats={availability.available}/>;
}
