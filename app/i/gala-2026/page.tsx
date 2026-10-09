import {notFound} from "next/navigation";
import GalaInvitationCheckout from "@/components/GalaInvitationCheckout";
import {ticketingRepository} from "@/lib/ticketing/repository";

export const dynamic="force-dynamic";
const INVITATION_ALIAS="gala-2026";

export default async function GalaAliasPage(){
  const [invitation,event,availability]=await Promise.all([ticketingRepository.findInvitationByPublicSlug(INVITATION_ALIAS),ticketingRepository.findEventBySlug("nis-gala-2026"),ticketingRepository.getEventAvailability("nis-gala-2026")]);
  if(!invitation||!event||!availability||invitation.eventId!==event.id)notFound();
  return <GalaInvitationCheckout event={event} invitationAlias={INVITATION_ALIAS} paypalClientId={process.env.PAYPAL_CLIENT_ID?.trim()??""} availableSeats={availability.available}/>;
}
