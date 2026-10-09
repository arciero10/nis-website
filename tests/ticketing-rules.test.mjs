import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source=await readFile(new URL("../lib/ticketing/rules.ts",import.meta.url),"utf8");
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {checkInEligibility,invitationBlockReason,invitationUsesAfterOrder,orderAmountForQuantity,statusAfterCaptureEvent,ticketsToIssue,validTicketQuantity,validateCompletedPayment}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const presentationSource=await readFile(new URL("../lib/ticketing/presentation.ts",import.meta.url),"utf8");
const presentationCompiled=ts.transpileModule(presentationSource,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {buildTicketPageUrl,buildTicketQrPayload,extractTicketQrToken,findTicketPosition,ticketStatusLabel}=await import(`data:text/javascript;base64,${Buffer.from(presentationCompiled).toString("base64")}`);

const invitation={status:"ACTIVE",maxUses:2,usedCount:0,expiresAt:null};
test("active invitation",()=>assert.equal(invitationBlockReason(invitation),null));
test("disabled invitation",()=>assert.equal(invitationBlockReason({...invitation,status:"DISABLED"}),"DISABLED"));
test("expired invitation",()=>assert.equal(invitationBlockReason({...invitation,expiresAt:"2020-01-01T00:00:00.000Z"}),"EXPIRED"));
test("exhausted invitation",()=>assert.equal(invitationBlockReason({...invitation,usedCount:2}),"MAX_USES_REACHED"));
test("capture requires exact status, currency and amount",()=>{assert.equal(validateCompletedPayment({status:"COMPLETED",amount:"200.00",currency:"EUR"},"200.00"),true);assert.equal(validateCompletedPayment({status:"COMPLETED",amount:"199.99",currency:"EUR"},"200.00"),false);assert.equal(validateCompletedPayment({status:"PENDING",amount:"200.00",currency:"EUR"},"200.00"),false);});
test("refund and denial dispositions",()=>{assert.deepEqual(statusAfterCaptureEvent("PAYMENT.CAPTURE.REFUNDED"),{paymentStatus:"REFUNDED",ticketStatus:"REFUNDED"});assert.deepEqual(statusAfterCaptureEvent("PAYMENT.CAPTURE.DENIED"),{paymentStatus:"FAILED",ticketStatus:"CANCELLED"});});
test("1 ticket costs 200 EUR",()=>assert.equal(orderAmountForQuantity(200,1),200));
test("2 tickets cost 400 EUR",()=>assert.equal(orderAmountForQuantity(200,2),400));
test("5 tickets cost 1000 EUR",()=>assert.equal(orderAmountForQuantity(200,5),1000));
test("up to 10 tickets are accepted",()=>assert.equal(validTicketQuantity(10),true));
test("quantity 0 is rejected",()=>assert.equal(orderAmountForQuantity(200,0),null));
test("quantity above 10 is rejected",()=>assert.equal(orderAmountForQuantity(200,11),null));
test("server total ignores an altered client total",()=>{const alteredClientTotal=1;const serverTotal=orderAmountForQuantity(200,2);assert.notEqual(serverTotal,alteredClientTotal);assert.equal(serverTotal,400);});
test("N participants produce N tickets",()=>assert.equal(ticketsToIssue(5,0),5));
test("capture retry produces no duplicate ticket",()=>assert.equal(ticketsToIssue(5,5),0));
test("used_count increases once independently from ticket count",()=>{assert.equal(invitationUsesAfterOrder(0),1);assert.equal(invitationUsesAfterOrder(7),8);});

test("short invitation alias is private and excluded from sitemap",async()=>{
  const [layout,page,sitemap]=await Promise.all([
    readFile(new URL("../app/i/gala-2026/layout.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/i/gala-2026/page.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/sitemap.ts",import.meta.url),"utf8"),
  ]);
  assert.match(layout,/index:false/);assert.match(layout,/follow:false/);assert.match(layout,/noarchive:true/);
  assert.match(page,/findInvitationByPublicSlug/);assert.doesNotMatch(sitemap,/\/i\/gala-2026/);
});

test("legacy token invitation route remains available",async()=>{
  const page=await readFile(new URL("../app/inviti/nis-gala-2026/[accessToken]/page.tsx",import.meta.url),"utf8");
  assert.match(page,/findInvitationByAccessToken/);assert.match(page,/accessToken=\{accessToken\}/);
});

test("valid ticket status is displayed",()=>assert.equal(ticketStatusLabel("ACTIVE"),"VALIDO"));
test("unknown qrToken resolves to not found",()=>assert.equal(findTicketPosition([{qrToken:"known-token"}],"missing-token"),-1));
test("multiple tickets produce distinct QR payloads",()=>{
  const payloads=["token-one","token-two","token-three"].map(token=>buildTicketQrPayload(token));
  assert.equal(new Set(payloads).size,3);assert.deepEqual(payloads,["NIS:token-one","NIS:token-two","NIS:token-three"]);
});
test("QR payload contains no participant PII",()=>{
  const payload=buildTicketQrPayload("opaque-random-token");
  assert.doesNotMatch(payload,/Mario|Rossi|mario%40example\.com/i);assert.equal(payload,"NIS:opaque-random-token");assert.equal(extractTicketQrToken(payload),"opaque-random-token");
});
test("digital ticket page is noindex and returns 404 for an unmatched token",async()=>{
  const [layout,page]=await Promise.all([readFile(new URL("../app/biglietto/[qrToken]/layout.tsx",import.meta.url),"utf8"),readFile(new URL("../app/biglietto/[qrToken]/page.tsx",import.meta.url),"utf8")]);
  assert.match(layout,/index:false/);assert.match(layout,/follow:false/);assert.match(layout,/noarchive:true/);assert.match(page,/if\(position<0\)notFound\(\)/);assert.match(page,/QRCode\.toDataURL\(qrPayload/);assert.doesNotMatch(page,/api\/ticketing\/checkin/);
});

test("valid unused ticket is authorized",()=>assert.equal(checkInEligibility({ticketStatus:"ACTIVE",firstCheckInAt:null,paymentStatus:"PAID",eventStatus:"ANNOUNCED"}),"AUTHORIZED"));
test("used ticket is denied with the first check-in state",()=>assert.equal(checkInEligibility({ticketStatus:"USED",firstCheckInAt:"2026-10-09T18:30:00.000Z",paymentStatus:"PAID",eventStatus:"ANNOUNCED"}),"ALREADY_USED"));
test("cancelled or unpaid ticket is invalid",()=>{assert.equal(checkInEligibility({ticketStatus:"CANCELLED",firstCheckInAt:null,paymentStatus:"PAID",eventStatus:"ANNOUNCED"}),"INVALID");assert.equal(checkInEligibility({ticketStatus:"ACTIVE",firstCheckInAt:null,paymentStatus:"PENDING",eventStatus:"ANNOUNCED"}),"INVALID");});
test("check-in transaction locks the ticket, records only the first access and preserves its timestamp",async()=>{const repository=await readFile(new URL("../lib/ticketing/repository.ts",import.meta.url),"utf8");assert.match(repository,/FOR UPDATE OF ticket/);assert.match(repository,/INSERT INTO ticketing_check_ins/);assert.match(repository,/if\(eligibility==="ALREADY_USED"\).*checkedInAt:ticket\.firstCheckInAt/s);});
test("missing QR token returns INVALID without participant data",async()=>{const repository=await readFile(new URL("../lib/ticketing/repository.ts",import.meta.url),"utf8");assert.match(repository,/if\(!row\)return \{status:"INVALID"\}/);});
test("check-in API requires staff authentication before processing a token",async()=>{const route=await readFile(new URL("../app/api/ticketing/checkin/route.ts",import.meta.url),"utf8");assert.match(route,/if\(!await hasValidStaffSession\(request\)\).*status:401/s);});
test("concurrent one-shot scans are serialized into AUTHORIZED then ALREADY_USED",async()=>{const repository=await readFile(new URL("../lib/ticketing/repository.ts",import.meta.url),"utf8");assert.match(repository,/FOR UPDATE OF ticket/);assert.equal(checkInEligibility({ticketStatus:"ACTIVE",firstCheckInAt:null,paymentStatus:"PAID",eventStatus:"ANNOUNCED"}),"AUTHORIZED");assert.equal(checkInEligibility({ticketStatus:"USED",firstCheckInAt:"2026-10-09T18:30:00.000Z",paymentStatus:"PAID",eventStatus:"ANNOUNCED"}),"ALREADY_USED");});
test("check-in and ticket routes are private and excluded from sitemap",async()=>{const [layout,sitemap]=await Promise.all([readFile(new URL("../app/checkin/layout.tsx",import.meta.url),"utf8"),readFile(new URL("../app/sitemap.ts",import.meta.url),"utf8")]);assert.match(layout,/index:false/);assert.match(layout,/follow:false/);assert.match(layout,/noarchive:true/);assert.doesNotMatch(sitemap,/\/checkin|\/biglietto/);});
test("staff session lasts 8 hours and uses a secure HttpOnly SameSite Lax cookie",async()=>{const [route,auth]=await Promise.all([readFile(new URL("../app/api/ticketing/checkin/session/route.ts",import.meta.url),"utf8"),readFile(new URL("../lib/ticketing/staff-auth.ts",import.meta.url),"utf8")]);assert.match(route,/httpOnly:true/);assert.match(route,/secure:process\.env\.NODE_ENV==="production"/);assert.match(route,/sameSite:"lax"/);assert.match(auth,/CHECKIN_SESSION_MAX_AGE=60\*60\*8/);});
test("staff pages require a server-side session",async()=>{const [guard,searchPage,ingressPage]=await Promise.all([readFile(new URL("../lib/ticketing/staff-page.ts",import.meta.url),"utf8"),readFile(new URL("../app/staff/cerca/page.tsx",import.meta.url),"utf8"),readFile(new URL("../app/staff/ingressi/page.tsx",import.meta.url),"utf8")]);assert.match(guard,/hasValidStaffSessionToken/);assert.match(guard,/redirect\("\/checkin"\)/);assert.match(searchPage,/await requireStaffSession\(\)/);assert.match(ingressPage,/await requireStaffSession\(\)/);});
test("staff search is partial and case-insensitive without exposing QR tokens",async()=>{const repository=await readFile(new URL("../lib/ticketing/repository.ts",import.meta.url),"utf8");const method=repository.slice(repository.indexOf("async searchStaffTickets"),repository.indexOf("async getStaffIngressDashboard"));assert.match(method,/ILIKE \$2/);assert.match(method,/first_name/);assert.match(method,/last_name/);assert.match(method,/ticket_code/);assert.doesNotMatch(method,/qr_token/);});
test("manual check-in requires authentication and reuses the atomic ticket lock",async()=>{const [route,repository]=await Promise.all([readFile(new URL("../app/api/ticketing/checkin/manual/route.ts",import.meta.url),"utf8"),readFile(new URL("../lib/ticketing/repository.ts",import.meta.url),"utf8")]);assert.match(route,/hasValidStaffSession\(request\)/);assert.match(route,/checkInByTicketCode/);assert.match(repository,/checkInByTicketCode[\s\S]*performTicketCheckIn\("ticket_code"/);assert.match(repository,/performTicketCheckIn[\s\S]*FOR UPDATE OF ticket/);});
test("double and concurrent manual check-ins are serialized",async()=>{const repository=await readFile(new URL("../lib/ticketing/repository.ts",import.meta.url),"utf8");assert.match(repository,/performTicketCheckIn[\s\S]*FOR UPDATE OF ticket/);assert.match(repository,/eligibility==="ALREADY_USED"/);assert.match(repository,/UPDATE ticketing_tickets SET status='USED'/);});
test("staff dashboard counts emitted, checked-in and pending tickets",async()=>{const repository=await readFile(new URL("../lib/ticketing/repository.ts",import.meta.url),"utf8");const method=repository.slice(repository.indexOf("async getStaffIngressDashboard"),repository.indexOf("async applyPaymentDisposition"));assert.match(method,/COUNT\(\*\) FILTER \(WHERE ticket\.status IN \('ACTIVE','USED'\)\)/);assert.match(method,/COUNT\(\*\) FILTER \(WHERE ticket\.status='USED'\)/);assert.match(method,/COUNT\(\*\) FILTER \(WHERE ticket\.status='ACTIVE'\)/);assert.match(method,/ORDER BY ticket\.first_check_in_at DESC/);});
test("logout revokes the server session and clears the cookie",async()=>{const [route,auth]=await Promise.all([readFile(new URL("../app/api/ticketing/checkin/session/route.ts",import.meta.url),"utf8"),readFile(new URL("../lib/ticketing/staff-auth.ts",import.meta.url),"utf8")]);assert.match(route,/DELETE[\s\S]*revokeStaffSession\(request\)/);assert.match(route,/maxAge:0/);assert.match(auth,/SET revoked_at=NOW\(\)/);});
test("staff routes are noindex",async()=>{const layout=await readFile(new URL("../app/staff/layout.tsx",import.meta.url),"utf8");assert.match(layout,/index:false/);assert.match(layout,/follow:false/);assert.match(layout,/noarchive:true/);});
test("order confirmation uses the concise ticket link label",async()=>{
  const page=await readFile(new URL("../app/conferma-biglietti/[qrToken]/page.tsx",import.meta.url),"utf8");assert.match(page,/>Apri biglietto</);assert.doesNotMatch(page,/Apri pagina privata del biglietto/);
});
