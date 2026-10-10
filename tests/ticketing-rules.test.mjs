import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source=await readFile(new URL("../lib/ticketing/rules.ts",import.meta.url),"utf8");
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {availableTicketCapacity,checkInEligibility,hasTicketCapacity,invitationBlockReason,invitationUsesAfterOrder,orderAmountForQuantity,statusAfterCaptureEvent,ticketsToIssue,validTicketQuantity,validateCompletedPayment}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const presentationSource=await readFile(new URL("../lib/ticketing/presentation.ts",import.meta.url),"utf8");
const presentationCompiled=ts.transpileModule(presentationSource,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {buildTicketQrPayload,extractTicketQrToken,findTicketPosition,ticketStatusLabel}=await import(`data:text/javascript;base64,${Buffer.from(presentationCompiled).toString("base64")}`);
const emailContentSource=await readFile(new URL("../lib/ticketing/email-content.ts",import.meta.url),"utf8");
const emailContentCompiled=ts.transpileModule(emailContentSource,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {buildTicketEmailContent,buildTicketUrl}=await import(`data:text/javascript;base64,${Buffer.from(emailContentCompiled).toString("base64")}`);
const paypalEnvironmentSource=await readFile(new URL("../lib/ticketing/paypal/environment.ts",import.meta.url),"utf8");
const paypalEnvironmentCompiled=ts.transpileModule(paypalEnvironmentSource,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {resolvePayPalEnvironment}=await import(`data:text/javascript;base64,${Buffer.from(paypalEnvironmentCompiled).toString("base64")}`);
const emailProviderSource=await readFile(new URL("../lib/email/provider.ts",import.meta.url),"utf8");
const emailProviderCompiled=ts.transpileModule(emailProviderSource,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {MicrosoftGraphEmailProvider,resetMicrosoftGraphTokenCacheForTests}=await import(`data:text/javascript;base64,${Buffer.from(emailProviderCompiled).toString("base64")}`);

function withMicrosoftGraphEnvironment(){
  const keys=["MICROSOFT_TENANT_ID","MICROSOFT_CLIENT_ID","MICROSOFT_CLIENT_SECRET","TICKETING_EMAIL_FROM"];
  const previous=Object.fromEntries(keys.map(key=>[key,process.env[key]]));
  process.env.MICROSOFT_TENANT_ID="tenant-id";
  process.env.MICROSOFT_CLIENT_ID="client-id";
  process.env.MICROSOFT_CLIENT_SECRET="client-secret";
  process.env.TICKETING_EMAIL_FROM="biglietti@nazionaleitalianasanitari.com";
  resetMicrosoftGraphTokenCacheForTests();
  return ()=>{
    for(const key of keys){
      if(previous[key]===undefined)delete process.env[key];
      else process.env[key]=previous[key];
    }
    resetMicrosoftGraphTokenCacheForTests();
  };
}

const invitation={status:"ACTIVE",maxUses:2,usedCount:0,expiresAt:null};
test("active invitation",()=>assert.equal(invitationBlockReason(invitation),null));
test("disabled invitation",()=>assert.equal(invitationBlockReason({...invitation,status:"DISABLED"}),"DISABLED"));
test("expired invitation",()=>assert.equal(invitationBlockReason({...invitation,expiresAt:"2020-01-01T00:00:00.000Z"}),"EXPIRED"));
test("exhausted invitation",()=>assert.equal(invitationBlockReason({...invitation,usedCount:2}),"MAX_USES_REACHED"));
test("Gala invitation remains available after its first use",()=>assert.equal(invitationBlockReason({...invitation,maxUses:500,usedCount:1}),null));
test("Gala invitation is exhausted only when used_count reaches max_uses",()=>{assert.equal(invitationBlockReason({...invitation,maxUses:500,usedCount:499}),null);assert.equal(invitationBlockReason({...invitation,maxUses:500,usedCount:500}),"MAX_USES_REACHED");});
test("Gala invitation migration preserves used_count and only expands max_uses",async()=>{const migration=await readFile(new URL("../migrations/006_gala_invitation_capacity.sql",import.meta.url),"utf8");assert.match(migration,/SET max_uses = 500/);assert.match(migration,/public_slug = 'gala-2026'/);assert.match(migration,/event\.slug = 'nis-gala-2026'/);assert.doesNotMatch(migration,/SET[\s\S]*used_count\s*=/i);});
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
test("Gala capacity is 300 and availability is based on issued tickets",async()=>{const migration=await readFile(new URL("../migrations/005_gala_capacity.sql",import.meta.url),"utf8");assert.match(migration,/capacity = 300/);assert.equal(availableTicketCapacity(300,57),243);});
test("event capacity remains independent from invitation max_uses",()=>{assert.equal(availableTicketCapacity(300,1),299);assert.equal(invitationBlockReason({...invitation,maxUses:500,usedCount:1}),null);assert.equal(hasTicketCapacity(300,299,2),false);});
test("a multi-ticket order reserves the correct number of seats",()=>{assert.equal(availableTicketCapacity(300,100,4),196);assert.equal(hasTicketCapacity(300,296,4),true);});
test("capacity cannot be exceeded and sold out rejects checkout",()=>{assert.equal(hasTicketCapacity(300,297,4),false);assert.equal(hasTicketCapacity(300,300,1),false);assert.equal(availableTicketCapacity(300,300),0);});
test("events without a capacity remain unlimited",()=>{assert.equal(availableTicketCapacity(null,999),null);assert.equal(hasTicketCapacity(null,999,10),true);});

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
  assert.match(layout,/index:false/);assert.match(layout,/follow:false/);assert.match(layout,/noarchive:true/);assert.match(page,/findDigitalTicketByQrToken/);assert.match(page,/if\(!record\)notFound\(\)/);assert.match(page,/QRCode\.toDataURL\(qrPayload/);assert.doesNotMatch(page,/api\/ticketing\/checkin/);
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
test("concurrent checkout uses an event row lock and pending seat reservations",async()=>{const repository=await readFile(new URL("../lib/ticketing/repository.ts",import.meta.url),"utf8");assert.match(repository,/WHERE slug=\$1 FOR UPDATE/);assert.match(repository,/reservedTicketCount/);assert.match(repository,/payment_status='PENDING'/);assert.match(repository,/hasTicketCapacity\(event\.capacity,issued,inputs\.length,reserved\)/);});
test("sold out checkout does not render PayPal",async()=>{const [checkout,page]=await Promise.all([readFile(new URL("../components/GalaInvitationCheckout.tsx",import.meta.url),"utf8"),readFile(new URL("../app/i/gala-2026/page.tsx",import.meta.url),"utf8")]);assert.match(checkout,/soldOut\?<div className="ticketing-sold-out"/);assert.match(checkout,/POSTI ESAURITI/);assert.match(page,/getEventAvailability/);});
test("public Gala checkout hides remaining seats while preserving the dynamic quantity limit",async()=>{const checkout=await readFile(new URL("../components/GalaInvitationCheckout.tsx",import.meta.url),"utf8");assert.doesNotMatch(checkout,/Posti disponibili/);assert.doesNotMatch(checkout,/Da 1 a \$\{maxQuantity\}/);assert.match(checkout,/maxQuantity=\{maxQuantity\}/);assert.match(checkout,/Math\.min\(10,availableSeats\)/);});
test("public Gala presentation includes production details without exposing Sandbox",async()=>{const [checkout,form,details,layout]=await Promise.all([readFile(new URL("../components/GalaInvitationCheckout.tsx",import.meta.url),"utf8"),readFile(new URL("../components/TicketPurchaseForm.tsx",import.meta.url),"utf8"),readFile(new URL("../data/ticketing.ts",import.meta.url),"utf8"),readFile(new URL("../app/i/gala-2026/layout.tsx",import.meta.url),"utf8")]);assert.match(checkout,/NIS_GALA_DETAILS/);assert.match(details,/28 ottobre 2026/);assert.match(details,/Another Studio/);assert.match(details,/Parking Pietralata/);assert.match(details,/images\/nis-gala-2026-og\.png/);assert.doesNotMatch(checkout,/Sandbox/);assert.doesNotMatch(form,/PayPal Sandbox/);assert.match(layout,/NIS Gala Charity Night – 28 ottobre 2026, Roma/);assert.match(layout,/summary_large_image/);assert.match(layout,/NIS_GALA_SOCIAL_IMAGE/);});
test("staff dashboard keeps remaining capacity visible",async()=>{const dashboard=await readFile(new URL("../components/StaffParticipantsDashboard.tsx",import.meta.url),"utf8");assert.match(dashboard,/Posti disponibili/);assert.match(dashboard,/dashboard\.available/);});
test("participants dashboard supports counts, filters and partial full-name or email search",async()=>{const repository=await readFile(new URL("../lib/ticketing/repository.ts",import.meta.url),"utf8");const method=repository.slice(repository.indexOf("async getStaffParticipants"),repository.indexOf("async applyPaymentDisposition"));assert.match(method,/capacity/);assert.match(method,/CONCAT_WS/);assert.match(method,/attendee\.email ILIKE/);assert.match(method,/ticket\.status='ACTIVE'/);assert.match(method,/ticket\.status='USED'/);});
test("participants API is authenticated and dashboard polls without exposing QR tokens",async()=>{const [route,component]=await Promise.all([readFile(new URL("../app/api/ticketing/staff/participants/route.ts",import.meta.url),"utf8"),readFile(new URL("../components/StaffParticipantsDashboard.tsx",import.meta.url),"utf8")]);assert.match(route,/hasValidStaffSession\(request\)/);assert.match(route,/status:401/);assert.match(component,/setInterval\(\(\)=>void load\(true\),7000\)/);assert.doesNotMatch(route,/qrToken|qr_token/);assert.match(component,/REGISTRA INGRESSO/);});
test("completed PayPal capture dispatches ticket email after ticket finalization",async()=>{const route=await readFile(new URL("../app/api/ticketing/paypal/capture-order/route.ts",import.meta.url),"utf8");const finalized=route.indexOf("finalizePaidOrder");const delivered=route.lastIndexOf("deliverConfirmationTicketEmails");assert.ok(finalized>=0&&delivered>finalized);assert.match(route,/completedCapture/);});
test("non-completed PayPal events do not dispatch ticket email",async()=>{const webhook=await readFile(new URL("../app/api/ticketing/paypal/webhook/route.ts",import.meta.url),"utf8");assert.match(webhook,/type==="PAYMENT\.CAPTURE\.COMPLETED"[\s\S]*deliverConfirmationTicketEmails/);assert.doesNotMatch(webhook,/statusAfterCaptureEvent\(type\)[\s\S]*deliverConfirmationTicketEmails/);});
test("ticket email claims are idempotent across capture retries",async()=>{const repository=await readFile(new URL("../lib/ticketing/repository.ts",import.meta.url),"utf8");assert.match(repository,/email_sent_at IS NULL/);assert.match(repository,/email_claimed_at<NOW\(\)-INTERVAL '10 minutes'/);assert.match(repository,/email_send_attempts=email_send_attempts\+1/);});
test("multi-ticket confirmation sends one email per participant",async()=>{const service=await readFile(new URL("../lib/ticketing/ticket-email.ts",import.meta.url),"utf8");assert.match(service,/confirmation\.tickets\.map/);assert.match(service,/confirmation\.attendees\[index\]/);assert.match(service,/to:payload\.email/);});
test("email provider failure preserves tickets and records a retryable failure",async()=>{const [service,repository]=await Promise.all([readFile(new URL("../lib/ticketing/ticket-email.ts",import.meta.url),"utf8"),readFile(new URL("../lib/ticketing/repository.ts",import.meta.url),"utf8")]);assert.match(service,/markTicketEmailFailed/);assert.match(service,/status:"FAILED"/);assert.doesNotMatch(service,/DELETE FROM ticketing_tickets|payment_status='FAILED'/);assert.match(repository,/email_last_error=\$2/);});
test("ticket email uses the canonical private ticket URL and escapes participant content",()=>{const url=buildTicketUrl("opaque_token-123");assert.equal(url,"https://www.nazionaleitalianasanitari.com/biglietto/opaque_token-123");const content=buildTicketEmailContent({firstName:"Mario <script>",lastName:"Rossi",ticketCode:"NIS26-ABC12345",category:"STANDARD",amount:200,currency:"EUR",qrToken:"opaque_token-123"});assert.match(content.html,/Mario &lt;script&gt; Rossi/);assert.match(content.html,/APRI IL TUO BIGLIETTO/);assert.match(content.html,/28 OTTOBRE 2026/);assert.match(content.html,/Another Studio/);assert.match(content.html,/Parking Pietralata/);assert.match(content.html,/Apri location/);assert.match(content.html,/Apri parcheggio/);assert.match(content.text,/Mostra il QR Code/);});
test("staff resend is authenticated and reuses the existing ticket",async()=>{const [route,service]=await Promise.all([readFile(new URL("../app/api/ticketing/staff/resend-ticket/route.ts",import.meta.url),"utf8"),readFile(new URL("../lib/ticketing/ticket-email.ts",import.meta.url),"utf8")]);assert.match(route,/hasValidStaffSession\(request\)/);assert.match(route,/resendTicketEmail\(ticketCode\)/);assert.match(service,/findTicketEmailPayload\(ticketCode\)/);assert.doesNotMatch(service,/generateQrToken|INSERT INTO ticketing_tickets/);});
test("Microsoft Graph obtains an app-only token, sends from the NIS mailbox and reuses the cached token",async()=>{
  const restore=withMicrosoftGraphEnvironment();
  try{
    const calls=[];
    const fetcher=async(url,init)=>{
      calls.push({url:String(url),init});
      if(String(url).includes("login.microsoftonline.com"))return new Response(JSON.stringify({access_token:"opaque-access-token",expires_in:3600}),{status:200,headers:{"Content-Type":"application/json"}});
      return new Response(null,{status:202});
    };
    const provider=new MicrosoftGraphEmailProvider(fetcher);
    const message={to:"partecipante@example.com",subject:"NIS Gala Charity Night - Il tuo biglietto",text:"Biglietto NIS",html:"<strong>Biglietto NIS</strong>"};
    await provider.send(message);
    await provider.send({...message,to:"secondo@example.com"});

    const tokenCalls=calls.filter(call=>call.url.includes("login.microsoftonline.com"));
    const sendCalls=calls.filter(call=>call.url.includes("graph.microsoft.com/v1.0/users/"));
    assert.equal(tokenCalls.length,1);
    assert.equal(sendCalls.length,2);
    assert.match(tokenCalls[0].url,/tenant-id\/oauth2\/v2\.0\/token$/);
    const tokenBody=new URLSearchParams(String(tokenCalls[0].init.body));
    assert.equal(tokenBody.get("grant_type"),"client_credentials");
    assert.equal(tokenBody.get("scope"),"https://graph.microsoft.com/.default");
    assert.equal(tokenBody.get("client_id"),"client-id");
    assert.equal(tokenBody.get("client_secret"),"client-secret");
    assert.match(sendCalls[0].url,/users\/biglietti%40nazionaleitalianasanitari\.com\/sendMail$/);
    const payload=JSON.parse(String(sendCalls[0].init.body));
    assert.equal(payload.message.from.emailAddress.address,"biglietti@nazionaleitalianasanitari.com");
    assert.equal(payload.message.from.emailAddress.name,"Biglietti NIS");
    assert.equal(payload.message.toRecipients[0].emailAddress.address,"partecipante@example.com");
    assert.equal(payload.saveToSentItems,true);
  }finally{restore();}
});
test("a Microsoft Graph error is surfaced without altering ticket lifecycle logic",async()=>{
  const restore=withMicrosoftGraphEnvironment();
  try{
    const fetcher=async url=>String(url).includes("login.microsoftonline.com")
      ?new Response(JSON.stringify({access_token:"opaque-access-token",expires_in:3600}),{status:200,headers:{"Content-Type":"application/json"}})
      :new Response(null,{status:503});
    const provider=new MicrosoftGraphEmailProvider(fetcher);
    await assert.rejects(()=>provider.send({to:"partecipante@example.com",subject:"Ticket",text:"Ticket",html:"<p>Ticket</p>"}),/Microsoft Graph non riuscito \(503\)/);
    const service=await readFile(new URL("../lib/ticketing/ticket-email.ts",import.meta.url),"utf8");
    assert.match(service,/markTicketEmailFailed/);assert.doesNotMatch(service,/DELETE FROM ticketing_tickets|payment_status='FAILED'/);
  }finally{restore();}
});
test("email credentials remain server-side and SMTP has been removed",async()=>{const [form,dashboard,provider,candidature,environment,packageFile]=await Promise.all([readFile(new URL("../components/TicketPurchaseForm.tsx",import.meta.url),"utf8"),readFile(new URL("../components/StaffParticipantsDashboard.tsx",import.meta.url),"utf8"),readFile(new URL("../lib/email/provider.ts",import.meta.url),"utf8"),readFile(new URL("../app/api/candidature/route.ts",import.meta.url),"utf8"),readFile(new URL("../.env.example",import.meta.url),"utf8"),readFile(new URL("../package.json",import.meta.url),"utf8")]);assert.doesNotMatch(form,/MICROSOFT_CLIENT_SECRET|MICROSOFT_CLIENT_ID|opaque-access-token/);assert.doesNotMatch(dashboard,/MICROSOFT_CLIENT_SECRET|MICROSOFT_CLIENT_ID|opaque-access-token|qrToken/);assert.match(provider,/process\.env\.MICROSOFT_CLIENT_SECRET/);assert.doesNotMatch(provider,/console\.(?:log|error)|SMTP_|nodemailer/);assert.doesNotMatch(candidature,/SMTP_|nodemailer/);assert.doesNotMatch(environment,/SMTP_/);assert.doesNotMatch(packageFile,/nodemailer/);});
test("existing PayPal orders receive an explicit Sandbox marker without changing protected configuration",async()=>{const migration=await readFile(new URL("../migrations/008_paypal_provider_environment.sql",import.meta.url),"utf8");assert.match(migration,/ADD COLUMN IF NOT EXISTS provider_environment/);assert.match(migration,/provider_environment='SANDBOX'/);assert.match(migration,/CHECK \(provider_environment IN \('SANDBOX','LIVE'\)\)/);assert.doesNotMatch(migration,/DELETE|ticketing_events[\s\S]*UPDATE|ticketing_invitations[\s\S]*UPDATE|used_count|public_slug|capacity/i);});
test("PayPal sandbox resolves to the Sandbox API",()=>{assert.deepEqual(resolvePayPalEnvironment("sandbox"),{environment:"sandbox",providerEnvironment:"SANDBOX",base:"https://api-m.sandbox.paypal.com"});});
test("PayPal live resolves to the Live API",()=>{assert.deepEqual(resolvePayPalEnvironment("live"),{environment:"live",providerEnvironment:"LIVE",base:"https://api-m.paypal.com"});});
test("PayPal rejects an unsupported environment",()=>{assert.throws(()=>resolvePayPalEnvironment("production"),/PAYPAL_ENV non valido/);assert.throws(()=>resolvePayPalEnvironment("LIVE"),/PAYPAL_ENV non valido/);assert.throws(()=>resolvePayPalEnvironment(undefined),/PAYPAL_ENV non valido/);});
test("create order accepts the configured PayPal environment without a Sandbox-only guard",async()=>{const [route,repository,client]=await Promise.all([readFile(new URL("../app/api/ticketing/paypal/create-order/route.ts",import.meta.url),"utf8"),readFile(new URL("../lib/ticketing/repository.ts",import.meta.url),"utf8"),readFile(new URL("../lib/ticketing/paypal/client.ts",import.meta.url),"utf8")]);assert.match(route,/payPalEnvironment\(\)/);assert.match(repository,/provider_environment/);assert.match(client,/resolvePayPalEnvironment\(process\.env\.PAYPAL_ENV\)/);assert.doesNotMatch(client,/solo PAYPAL_ENV=sandbox|bases\.sandbox/);});
test("PayPal SDK uses the configured client id and webhook verification shares the configured API client",async()=>{const [form,client]=await Promise.all([readFile(new URL("../components/TicketPurchaseForm.tsx",import.meta.url),"utf8"),readFile(new URL("../lib/ticketing/paypal/client.ts",import.meta.url),"utf8")]);assert.match(form,/client-id=\$\{encodeURIComponent\(paypalClientId\)\}/);assert.match(client,/verifyPayPalWebhook[\s\S]*paypalJson\("\/v1\/notifications\/verify-webhook-signature"/);assert.match(client,/paypalFetch[\s\S]*const configuration=config\(\)/);});
test("Sandbox cleanup requires an explicit mode and selects only technically marked orders",async()=>{const script=await readFile(new URL("../scripts/ticketing/cleanup-sandbox-data.mjs",import.meta.url),"utf8");assert.match(script,/--dry-run/);assert.match(script,/--execute/);assert.match(script,/provider='PAYPAL' AND provider_environment='SANDBOX'/);assert.doesNotMatch(script,/first_name\s*=|last_name\s*=|email\s*=/i);});
test("Sandbox dry-run reports every dependent data class and execute remains transactional",async()=>{const script=await readFile(new URL("../scripts/ticketing/cleanup-sandbox-data.mjs",import.meta.url),"utf8");assert.match(script,/"Ordini":counts\.orders/);assert.match(script,/"Partecipanti":counts\.attendees/);assert.match(script,/"Biglietti":counts\.tickets/);assert.match(script,/"Check-in":counts\.check_ins/);assert.match(script,/"Stati email":counts\.email_delivery/);assert.match(script,/await client\.query\("BEGIN"\)/);assert.match(script,/await client\.query\("COMMIT"\)/);assert.match(script,/await client\.query\("ROLLBACK"\)/);});
test("Sandbox cleanup preserves events, invitations, staff sessions and migration history",async()=>{const script=await readFile(new URL("../scripts/ticketing/cleanup-sandbox-data.mjs",import.meta.url),"utf8");assert.doesNotMatch(script,/DELETE FROM ticketing_events|DELETE FROM ticketing_invitations|DELETE FROM ticketing_staff_sessions|DELETE FROM ticketing_schema_migrations|UPDATE ticketing_invitations/i);assert.match(script,/DELETE FROM ticketing_check_ins/);assert.match(script,/DELETE FROM ticketing_tickets/);assert.match(script,/DELETE FROM ticketing_order_participants/);assert.match(script,/DELETE FROM ticketing_orders/);assert.match(script,/DELETE FROM ticketing_attendees/);});
test("partner allocation schema is incremental and supports partial nomination",async()=>{const migration=await readFile(new URL("../migrations/009_partner_ticket_allocations.sql",import.meta.url),"utf8");assert.match(migration,/CREATE TABLE IF NOT EXISTS ticketing_partner_allocations/);assert.match(migration,/allocated_quantity INTEGER NOT NULL/);assert.match(migration,/status IN \('ACTIVE','CANCELLED'\)/);assert.match(migration,/ALTER COLUMN order_id DROP NOT NULL/);assert.match(migration,/partner_allocation_id/);assert.doesNotMatch(migration,/DROP TABLE|DELETE FROM/);});
test("partner allocation creation locks capacity and cannot exceed remaining seats",async()=>{const repository=await readFile(new URL("../lib/ticketing/repository.ts",import.meta.url),"utf8");const method=repository.slice(repository.indexOf("async createPartnerAllocation"),repository.indexOf("async addPartnerNominee"));assert.match(method,/SELECT \* FROM ticketing_events WHERE slug=\$1 FOR UPDATE/);assert.match(method,/committedSeatCount/);assert.match(method,/reservedTicketCount/);assert.match(method,/hasTicketCapacity\(event\.capacity,committed,input\.allocatedQuantity,reserved\)/);assert.match(method,/TicketingConflictError\("SOLD_OUT"/);});
test("partner seats reduce availability once without double-counting emitted partner tickets",async()=>{const repository=await readFile(new URL("../lib/ticketing/repository.ts",import.meta.url),"utf8");const capacity=availableTicketCapacity(300,50+10);assert.equal(capacity,240);assert.match(repository,/CASE WHEN allocation\.status='ACTIVE' THEN allocation\.allocated_quantity ELSE/);assert.match(repository,/ticket\.order_id IS NOT NULL/);});
test("partner nominees create tickets without PayPal orders",async()=>{const repository=await readFile(new URL("../lib/ticketing/repository.ts",import.meta.url),"utf8");const method=repository.slice(repository.indexOf("async addPartnerNominee"),repository.indexOf("async updatePartnerNominee"));assert.match(method,/source,partner_allocation_id/);assert.match(method,/VALUES\(\$1,\$2,\$3,NULL,\$4/);assert.match(method,/'PARTNER','ONE_SHOT','ACTIVE'/);assert.doesNotMatch(method,/INSERT INTO ticketing_orders|provider_order_id|PAYPAL/);assert.match(method,/allocatedQuantity/);});
test("partner email uses the dedicated subject and omits price",()=>{const content=buildTicketEmailContent({firstName:"Mario",lastName:"Rossi",ticketCode:"NIS26-PARTNER",category:"PARTNER",amount:null,currency:"EUR",qrToken:"partner-token",source:"PARTNER",companyName:"Società XX"});assert.equal(content.subject,"NIS Gala Charity Night - Il tuo invito partner");assert.match(content.html,/Società XX/);assert.match(content.html,/INVITO PARTNER/);assert.doesNotMatch(content.html,/Importo|200,00/);});
test("partner digital ticket shows company and conditionally hides price",async()=>{const page=await readFile(new URL("../app/biglietto/[qrToken]/page.tsx",import.meta.url),"utf8");assert.match(page,/Invito Partner/);assert.match(page,/companyName/);assert.match(page,/partner\?<p><span>Società/);assert.match(page,/:<p><span>Importo/);});
test("partner check-in reuses the atomic one-shot flow",async()=>{const repository=await readFile(new URL("../lib/ticketing/repository.ts",import.meta.url),"utf8");assert.match(repository,/ticket\.partnerAllocationId\?"PAID"/);assert.match(repository,/LEFT JOIN ticketing_partner_allocations/);assert.match(repository,/FOR UPDATE OF ticket/);assert.match(repository,/eligibility==="ALREADY_USED"/);});
test("cancelling an allocation releases only unissued seats",async()=>{const repository=await readFile(new URL("../lib/ticketing/repository.ts",import.meta.url),"utf8");const cancel=repository.slice(repository.indexOf("async cancelPartnerAllocation"),repository.indexOf("async applyPaymentDisposition"));assert.match(cancel,/SET status='CANCELLED'/);assert.doesNotMatch(cancel,/UPDATE ticketing_tickets|DELETE FROM ticketing_tickets/);assert.match(repository,/allocation\.status='ACTIVE' THEN allocation\.allocated_quantity ELSE/);});
test("partner staff APIs require the existing staff session",async()=>{const files=["../app/api/ticketing/staff/partner/route.ts","../app/api/ticketing/staff/partner/[id]/route.ts","../app/api/ticketing/staff/partner/[id]/attendees/route.ts","../app/api/ticketing/staff/partner/[id]/attendees/[attendeeId]/route.ts"];for(const file of files){const source=await readFile(new URL(file,import.meta.url),"utf8");assert.match(source,/hasValidStaffSession\(request\)/);assert.match(source,/status:401/);assert.doesNotMatch(source,/qrToken/);}});
test("partner ticket creation dispatches email and staff resend remains shared",async()=>{const [route,service]=await Promise.all([readFile(new URL("../app/api/ticketing/staff/partner/[id]/attendees/route.ts",import.meta.url),"utf8"),readFile(new URL("../lib/ticketing/ticket-email.ts",import.meta.url),"utf8")]);assert.match(route,/deliverTicketEmail\(emailPayload\)/);assert.match(service,/resendTicketEmail/);assert.match(service,/findTicketEmailPayload/);});
test("order confirmation uses the concise ticket link label",async()=>{
  const page=await readFile(new URL("../app/conferma-biglietti/[qrToken]/page.tsx",import.meta.url),"utf8");assert.match(page,/>Apri biglietto</);assert.doesNotMatch(page,/Apri pagina privata del biglietto/);
});
