import assert from "node:assert/strict";
import {access,readFile} from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source=path=>readFile(new URL(path,import.meta.url),"utf8");
const rulesSource=await source("../lib/nissettone/rules.ts");
const rulesCompiled=ts.transpileModule(rulesSource,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const rules=await import(`data:text/javascript;base64,${Buffer.from(rulesCompiled).toString("base64")}`);

test("NISSETTONE costs 50 EUR per item and never trusts a client total",()=>{
  assert.equal(rules.NISSETTONE_UNIT_PRICE_CENTS,5000);
  assert.equal(rules.nissettoneTotalCents(1),5000);
  assert.equal(rules.nissettoneTotalCents(3),15000);
  assert.throws(()=>rules.nissettoneTotalCents(0));
});

test("quantity and availability are capped at the real 250 item inventory",()=>{
  assert.equal(rules.NISSETTONE_INITIAL_STOCK,250);
  assert.equal(rules.validNissettoneQuantity(250,250),true);
  assert.equal(rules.validNissettoneQuantity(251,250),false);
  assert.equal(rules.validNissettoneQuantity(5,4),false);
  assert.equal(rules.availableStock(250,120,30),100);
});

test("delivery accepts only a declared Roma municipality and pickup uses Sabotino",()=>{
  assert.equal(rules.isDeclaredRomeMunicipality(" Roma "),true);
  assert.equal(rules.isDeclaredRomeMunicipality("Fiumicino"),false);
  assert.equal(rules.addressVerificationFor("DELIVERY"),"PENDING");
  assert.equal(rules.addressVerificationFor("PICKUP"),"NOT_REQUIRED");
  assert.match(rules.NISSETTONE_PICKUP_ADDRESS,/Pasticceria Sabotino/);
  assert.match(rules.NISSETTONE_PICKUP_ADDRESS,/Via Sabotino 23\/25/);
});

test("commercial PayPal checkout is fail-closed until credentials and its dedicated webhook exist",()=>{
  const configured={NISSETTONE_PAYPAL_ENABLED:"true",PAYPAL_CLIENT_ID:"client",PAYPAL_CLIENT_SECRET:"secret",PAYPAL_ENV:"sandbox",NISSETTONE_PAYPAL_WEBHOOK_ID:"webhook"};
  assert.equal(rules.checkoutConfigured(configured),true);
  assert.equal(rules.checkoutConfigured({...configured,NISSETTONE_PAYPAL_WEBHOOK_ID:""}),false);
  assert.equal(rules.checkoutConfigured({...configured,PAYPAL_ENV:"invalid"}),false);
  assert.equal(rules.checkoutConfigured({...configured,NISSETTONE_PAYPAL_ENABLED:"false"}),false);
});

test("migration is additive, isolated from Gala and seeds a disabled 250 item product",async()=>{
  const migration=await source("../migrations/028_nissettone_2026.sql");
  assert.match(migration,/CREATE TABLE IF NOT EXISTS nissettone_products/);
  assert.match(migration,/CREATE TABLE IF NOT EXISTS nissettone_orders/);
  assert.match(migration,/stock_total INTEGER NOT NULL/);
  assert.match(migration,/quantity BETWEEN 1 AND 250/);
  assert.match(migration,/VALUES\('nissettone-2026','NISSETTONE 2026',5000,'EUR',250,'DRAFT'/);
  assert.doesNotMatch(migration,/DROP\s|TRUNCATE\s|ALTER TABLE ticketing_|UPDATE ticketing_|DELETE FROM ticketing_/i);
});

test("inventory reservations and payment finalization are transactional and idempotent",async()=>{
  const repository=await source("../lib/nissettone/repository.ts");
  assert.match(repository,/withTransaction\(async client/);
  assert.match(repository,/productRow\(client,true\)/);
  assert.match(repository,/WHERE request_id=\$1/);
  assert.match(repository,/payment_status='PENDING' AND o\.reservation_expires_at>NOW\(\)/);
  assert.match(repository,/reservation_expires_at<=NOW\(\)/);
  assert.match(repository,/if\(order\.payment_status==="PAID"\)return mapOrder\(order\)/);
  assert.match(repository,/currency!==order\.currency/);
  assert.match(repository,/Number\(amount\)\.toFixed\(2\)/);
  assert.match(repository,/stock_committed\+order\.quantity>product\.stock_total/);
  assert.match(repository,/ON CONFLICT DO NOTHING/);
});

test("refunds restore inventory and duplicate webhooks cannot be processed twice",async()=>{
  const repository=await source("../lib/nissettone/repository.ts");
  assert.equal(rules.nissettonePaymentDispositionForEvent("PAYMENT.CAPTURE.REFUNDED"),"REFUNDED");
  assert.equal(rules.nissettonePaymentDispositionForEvent("PAYMENT.CAPTURE.REVERSED"),"REFUNDED");
  assert.equal(rules.nissettonePaymentDispositionForEvent("PAYMENT.CAPTURE.DENIED"),"FAILED");
  assert.match(repository,/status==="REFUNDED"&&order\.payment_status==="PAID"/);
  assert.match(repository,/stock_committed=GREATEST\(0,stock_committed-\$2\)/);
  assert.match(repository,/movement_type,quantity,reason\) VALUES\(\$1,\$2,'REFUND'/);
  assert.match(repository,/nissettone_paypal_events\(event_id,event_type,order_id\)/);
});

test("REFUNDED and REVERSED share one idempotent inventory release path",async()=>{
  const [webhook,repository]=await Promise.all([source("../app/api/nissettone/paypal/webhook/route.ts"),source("../lib/nissettone/repository.ts")]);
  assert.match(webhook,/nissettonePaymentDispositionForEvent\(type\)/);
  assert.match(webhook,/disposition==="REFUNDED"/);
  assert.match(repository,/if\(status==="REFUNDED"&&order\.payment_status==="PAID"\)/);
  assert.match(repository,/WHERE id=\$1 AND payment_status<>\$2/);
  assert.match(repository,/ON CONFLICT DO NOTHING/);
});

test("webhook is signed with a dedicated id and checkout never uses PayPal Charity",async()=>{
  const [webhook,createOrder,checkout]=await Promise.all([
    source("../app/api/nissettone/paypal/webhook/route.ts"),
    source("../app/api/nissettone/orders/route.ts"),
    source("../components/NissettoneCheckout.tsx"),
  ]);
  assert.match(webhook,/NISSETTONE_PAYPAL_WEBHOOK_ID/);
  assert.match(webhook,/verifyPayPalWebhook\(request\.headers,event,webhookId\)/);
  assert.match(createOrder,/nissettoneTotal|totalCents|createNissettoneReservation/);
  assert.doesNotMatch(`${webhook}\n${createOrder}\n${checkout}`,/fundraiser\/charity|6169624/);
});

test("admin APIs and page are SUPERADMIN-only and keep economic data private",async()=>{
  const [ordersRoute,inventoryRoute,page,publicPage]=await Promise.all([
    source("../app/api/nissettone/staff/orders/route.ts"),
    source("../app/api/nissettone/staff/inventory/route.ts"),
    source("../app/staff/nissettone/page.tsx"),
    source("../app/nissettone/page.tsx"),
  ]);
  for(const value of [ordersRoute,inventoryRoute])assert.match(value,/role!=="SUPERADMIN"/);
  assert.match(page,/requireSuperadmin/);
  assert.doesNotMatch(publicPage,/revenueCents|ricavi complessivi|incassi totali/i);
});

test("the three official product images and public SEO route are wired",async()=>{
  for(const file of ["nissettone-01.jpeg","nissettone-2.jpeg","nissettone-3.jpeg"]){
    await access(new URL(`../public/images/nissettone/${file}`,import.meta.url));
  }
  const [page,sitemap,site]=await Promise.all([source("../app/nissettone/page.tsx"),source("../app/sitemap.ts"),source("../data/site.ts")]);
  assert.match(page,/Product/);
  assert.match(page,/NISSETTONE 2026/);
  assert.match(sitemap,/\/nissettone/);
  assert.match(site,/NISSETTONE/);
});
