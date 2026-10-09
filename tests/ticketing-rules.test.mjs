import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source=await readFile(new URL("../lib/ticketing/rules.ts",import.meta.url),"utf8");
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {invitationBlockReason,invitationUsesAfterOrder,orderAmountForQuantity,statusAfterCaptureEvent,ticketsToIssue,validTicketQuantity,validateCompletedPayment}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const presentationSource=await readFile(new URL("../lib/ticketing/presentation.ts",import.meta.url),"utf8");
const presentationCompiled=ts.transpileModule(presentationSource,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {buildTicketPageUrl,findTicketPosition,ticketStatusLabel}=await import(`data:text/javascript;base64,${Buffer.from(presentationCompiled).toString("base64")}`);

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
test("multiple tickets produce distinct private QR URLs",()=>{
  const urls=["token-one","token-two","token-three"].map(token=>buildTicketPageUrl(token));
  assert.equal(new Set(urls).size,3);assert.ok(urls.every(url=>url.startsWith("https://www.nazionaleitalianasanitari.com/biglietto/")));
});
test("QR URL contains no participant PII",()=>{
  const url=buildTicketPageUrl("opaque-random-token");
  assert.doesNotMatch(url,/Mario|Rossi|mario%40example\.com/i);assert.equal(url,"https://www.nazionaleitalianasanitari.com/biglietto/opaque-random-token");
});
test("digital ticket page is noindex and returns 404 for an unmatched token",async()=>{
  const [layout,page]=await Promise.all([readFile(new URL("../app/biglietto/[qrToken]/layout.tsx",import.meta.url),"utf8"),readFile(new URL("../app/biglietto/[qrToken]/page.tsx",import.meta.url),"utf8")]);
  assert.match(layout,/index:false/);assert.match(layout,/follow:false/);assert.match(layout,/noarchive:true/);assert.match(page,/if\(position<0\)notFound\(\)/);assert.match(page,/QRCode\.toDataURL\(ticketUrl/);
});
test("order confirmation uses the concise ticket link label",async()=>{
  const page=await readFile(new URL("../app/conferma-biglietti/[qrToken]/page.tsx",import.meta.url),"utf8");assert.match(page,/>Apri biglietto</);assert.doesNotMatch(page,/Apri pagina privata del biglietto/);
});
