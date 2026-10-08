export type IsoDateTime=string;

export const EVENT_STATUSES=["DRAFT","ANNOUNCED","PUBLISHED","SOLD_OUT","CANCELLED","COMPLETED"] as const;
export type EventStatus=(typeof EVENT_STATUSES)[number];

export const PAYMENT_STATUSES=["PENDING","PAID","FAILED","REFUNDED","CANCELLED"] as const;
export type PaymentStatus=(typeof PAYMENT_STATUSES)[number];

export const TICKET_CATEGORIES=["STANDARD","VIP","PARTNER","SPONSOR","STAFF","ARTIST","PRESS","COMPLIMENTARY"] as const;
export type TicketCategory=(typeof TICKET_CATEGORIES)[number];

export const ACCESS_MODES=["ONE_SHOT","MULTI_ENTRY"] as const;
export type AccessMode=(typeof ACCESS_MODES)[number];

export const TICKET_STATUSES=["ACTIVE","USED","CANCELLED","REFUNDED"] as const;
export type TicketStatus=(typeof TICKET_STATUSES)[number];

export const CHECK_IN_RESULTS=["ALLOWED","ALREADY_USED","INVALID","CANCELLED"] as const;
export type CheckInResult=(typeof CHECK_IN_RESULTS)[number];

export const INVITATION_STATUSES=["ACTIVE","DISABLED","EXPIRED"] as const;
export type InvitationStatus=(typeof INVITATION_STATUSES)[number];

export interface Event{
  id:string;
  slug:string;
  title:string;
  description:string;
  location:string|null;
  eventDate:IsoDateTime|null;
  doorsOpenAt:IsoDateTime|null;
  price:number;
  currency:"EUR";
  capacity:number|null;
  status:EventStatus;
  createdAt:IsoDateTime;
}

export interface Attendee{
  id:string;
  eventId:string;
  firstName:string;
  lastName:string;
  email:string;
  phone?:string;
  company?:string;
  createdAt:IsoDateTime;
}

export interface Order{
  id:string;
  eventId:string;
  attendeeId:string;
  provider:"PAYPAL";
  providerOrderId:string|null;
  providerCaptureId:string|null;
  amount:number;
  currency:"EUR";
  paymentStatus:PaymentStatus;
  createdAt:IsoDateTime;
  paidAt:IsoDateTime|null;
}

export interface Ticket{
  id:string;
  eventId:string;
  attendeeId:string;
  orderId:string;
  ticketCode:string;
  qrToken:string;
  category:TicketCategory;
  accessMode:AccessMode;
  status:TicketStatus;
  createdAt:IsoDateTime;
  firstCheckInAt:IsoDateTime|null;
  lastCheckInAt:IsoDateTime|null;
}

export interface CheckIn{
  id:string;
  ticketId:string;
  checkedInAt:IsoDateTime;
  result:CheckInResult;
}

export interface Invitation{
  id:string;
  eventId:string;
  accessToken:string;
  label:string;
  maxUses:number;
  usedCount:number;
  expiresAt:IsoDateTime|null;
  status:InvitationStatus;
  createdAt:IsoDateTime;
}

export interface TicketPurchaseInput{
  eventId:string;
  firstName:string;
  lastName:string;
  email:string;
  phone?:string;
  company?:string;
  privacyAccepted:true;
}

export interface TicketLookup{
  ticketCode?:string;
  qrToken?:string;
}
