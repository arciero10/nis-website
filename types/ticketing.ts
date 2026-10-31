export type IsoDateTime=string;

export const EVENT_STATUSES=["DRAFT","PUBLISHED","OPEN","CLOSED","COMPLETED","ARCHIVED","CANCELLED","ANNOUNCED","SOLD_OUT"] as const;
export type EventStatus=(typeof EVENT_STATUSES)[number];

export const EVENT_TYPES=["CHARITY","INTERNAL","PUBLIC","PRIVATE","CORPORATE","OTHER"] as const;
export type EventType=(typeof EVENT_TYPES)[number];
export const EVENT_VISIBILITIES=["PUBLIC","PRIVATE","INTERNAL"] as const;
export type EventVisibility=(typeof EVENT_VISIBILITIES)[number];
export const RSVP_STATUSES=["CONFIRMED","DECLINED","WAITLIST","PENDING"] as const;
export type RsvpStatus=(typeof RSVP_STATUSES)[number];

export const PAYMENT_STATUSES=["NOT_REQUIRED","PENDING","PAID","FAILED","REFUNDED","PENDING_BANK_TRANSFER","PENDING_CASH","CANCELLED"] as const;
export type PaymentStatus=(typeof PAYMENT_STATUSES)[number];

export const TICKET_CATEGORIES=["STANDARD","VIP","PARTNER","SPONSOR","STAFF","ARTIST","PRESS","COMPLIMENTARY"] as const;
export type TicketCategory=(typeof TICKET_CATEGORIES)[number];

export const ACCESS_MODES=["ONE_SHOT","MULTI_ENTRY"] as const;
export type AccessMode=(typeof ACCESS_MODES)[number];

export const TICKET_STATUSES=["ACTIVE","USED","CANCELLED","REFUNDED"] as const;
export type TicketStatus=(typeof TICKET_STATUSES)[number];

export const CHECK_IN_RESULTS=["ALLOWED","ALREADY_USED","INVALID","CANCELLED"] as const;
export type CheckInResult=(typeof CHECK_IN_RESULTS)[number];
export type StaffRole="STAFF"|"SUPERADMIN";
export type CheckInMethod="QR"|"MANUAL";
export type CheckInStatus="ACTIVE"|"REVERSED";

export const TICKET_ISSUANCE_SOURCES=["PAYPAL","PAYPAL_CHARITY","CASH","BANK_TRANSFER","COMPANY","ADMIN"] as const;
export type TicketIssuanceSource=(typeof TICKET_ISSUANCE_SOURCES)[number];

export const MANUAL_PAYMENT_METHODS=["PAYPAL","CASH","BANK_TRANSFER","COMPLIMENTARY"] as const;
export type ManualPaymentMethod=(typeof MANUAL_PAYMENT_METHODS)[number];
export const CASH_COLLECTION_STATUSES=["DA_INCASSARE","INCASSATO"] as const;
export type CashCollectionStatus=(typeof CASH_COLLECTION_STATUSES)[number];

export const INVITATION_TYPES=["STANDARD","SPONSOR","DONATORE","AZIENDA","OSPITE","STAMPA","MEDIA","PRESS","OMAGGIO_NIS"] as const;
export type InvitationType=(typeof INVITATION_TYPES)[number];
export const ADMIN_INVITATION_TYPES=["STAMPA","MEDIA","PRESS","OMAGGIO_NIS","SPONSOR"] as const;
export type AdminInvitationType=(typeof ADMIN_INVITATION_TYPES)[number];
export type StaffInvitationTypeFilter="ALL"|"OMAGGIO"|InvitationType;

export const COMPLIMENTARY_REASONS=["INSTITUTIONAL_GUEST","NIS_GUEST","SPEAKER","STAFF_ORGANIZATION","COURTESY","OTHER"] as const;
export type ComplimentaryReason=(typeof COMPLIMENTARY_REASONS)[number];

export const ALLOCATION_TYPES=["SPONSOR","DONATORE","AZIENDA","OSPITE"] as const;
export type AllocationType=(typeof ALLOCATION_TYPES)[number];

export const INVITATION_STATUSES=["ACTIVE","DISABLED","EXPIRED"] as const;
export type InvitationStatus=(typeof INVITATION_STATUSES)[number];

export interface Event{
  id:string;
  slug:string;
  title:string;
  description:string;
  longDescription:string|null;
  location:string|null;
  address:string|null;
  eventDate:IsoDateTime|null;
  endsAt:IsoDateTime|null;
  doorsOpenAt:IsoDateTime|null;
  registrationOpensAt:IsoDateTime|null;
  registrationClosesAt:IsoDateTime|null;
  checkinOpensAt:IsoDateTime|null;
  checkinClosesAt:IsoDateTime|null;
  price:number|null;
  currency:string;
  capacity:number|null;
  status:EventStatus;
  eventType:EventType;
  visibility:EventVisibility;
  isFree:boolean;
  isCharity:boolean;
  allowsCompanions:boolean;
  maxCompanions:number|null;
  coverImage:string|null;
  organizationalNotes:string|null;
  contactEmail:string|null;
  publicUrl:string|null;
  completedAt:IsoDateTime|null;
  archivedAt:IsoDateTime|null;
  createdAt:IsoDateTime;
  updatedAt:IsoDateTime;
}

export interface EventTicketType{
  id:string;
  eventId:string;
  code:string;
  label:string;
  price:number|null;
  currency:string;
  isFree:boolean;
  maxQuantity:number|null;
  isPublic:boolean;
  isActive:boolean;
  displayOrder:number;
  notes:string|null;
}

export interface EventRegistration{
  id:string;
  eventId:string;
  attendeeId:string|null;
  ticketId:string|null;
  ticketTypeId:string|null;
  primaryRegistrationId:string|null;
  participantRole:"PRIMARY"|"COMPANION"|"GUEST"|"COMPANY"|"STAFF";
  firstName:string;
  lastName:string;
  email:string|null;
  phone:string|null;
  company:string|null;
  rsvpStatus:RsvpStatus;
  paymentStatus:PaymentStatus;
  notes:string|null;
  createdAt:IsoDateTime;
  updatedAt:IsoDateTime;
}

export interface Attendee{
  id:string;
  eventId:string;
  firstName:string;
  lastName:string;
  email:string;
  phone?:string;
  company?:string;
  source:"STANDARD"|"PARTNER";
  partnerAllocationId:string|null;
  createdAt:IsoDateTime;
  updatedAt:IsoDateTime;
}

export interface Order{
  id:string;
  eventId:string;
  attendeeId:string|null;
  invitationId:string;
  requestId:string;
  provider:"PAYPAL";
  providerEnvironment:"SANDBOX"|"LIVE";
  providerOrderId:string|null;
  providerCaptureId:string|null;
  amount:number;
  currency:"EUR";
  paymentStatus:PaymentStatus;
  createdAt:IsoDateTime;
  updatedAt:IsoDateTime;
  paidAt:IsoDateTime|null;
}

export interface OrderParticipant{
  id:string;
  orderId:string;
  attendeeId:string|null;
  position:number;
  firstName:string;
  lastName:string;
  email:string;
  phone?:string;
  company?:string;
  createdAt:IsoDateTime;
}

export interface Ticket{
  id:string;
  eventId:string;
  attendeeId:string;
  orderId:string|null;
  partnerAllocationId:string|null;
  manualIssuanceId:string|null;
  issuanceSource:TicketIssuanceSource;
  invitationType:InvitationType;
  ticketCode:string;
  qrToken:string;
  category:TicketCategory;
  accessMode:AccessMode;
  status:TicketStatus;
  sequenceNumber:number|null;
  totalQuantity:number|null;
  createdAt:IsoDateTime;
  updatedAt:IsoDateTime;
  firstCheckInAt:IsoDateTime|null;
  lastCheckInAt:IsoDateTime|null;
}

export interface PartnerAllocation{
  id:string;
  eventId:string;
  companyName:string;
  allocationType:AllocationType;
  contactEmail:string|null;
  packageName:string|null;
  partnershipAmountCents:number|null;
  allocatedQuantity:number;
  status:"ACTIVE"|"CANCELLED";
  emailDeliveryStatus:"PENDING"|"SENT"|"FAILED";
  emailSentAt:IsoDateTime|null;
  emailSendAttempts:number;
  emailLastError:string|null;
  notes:string|null;
  createdAt:IsoDateTime;
  updatedAt:IsoDateTime;
}

export interface CheckIn{
  id:string;
  ticketId:string;
  eventId:string;
  checkedInAt:IsoDateTime;
  result:CheckInResult;
  checkedInByStaffId:string|null;
  checkedInByDisplayName:string|null;
  checkinMethod:CheckInMethod;
  sessionId:string|null;
  status:CheckInStatus;
  windowBypassed:boolean;
  reversedAt:IsoDateTime|null;
  reversedByStaffId:string|null;
  reversedByDisplayName:string|null;
  reverseReason:string|null;
  reverseSessionId:string|null;
}

export interface Invitation{
  id:string;
  eventId:string;
  accessTokenHash:string;
  publicSlug:string|null;
  label:string;
  maxUses:number;
  usedCount:number;
  expiresAt:IsoDateTime|null;
  status:InvitationStatus;
  createdAt:IsoDateTime;
  updatedAt:IsoDateTime;
}

export interface TicketPurchaseInput{
  eventId:string;
  firstName:string;
  lastName:string;
  email:string;
  phone?:string;
  privacyAccepted:true;
}

export interface TicketLookup{
  ticketCode?:string;
  qrToken?:string;
}
