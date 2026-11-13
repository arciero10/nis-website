import assert from "node:assert/strict";
import {access,readFile} from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source=path=>readFile(new URL(path,import.meta.url),"utf8");
const rulesSource=await source("../lib/nissettone/rules.ts");
const rulesCompiled=ts.transpileModule(rulesSource,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const rules=await import(`data:text/javascript;base64,${Buffer.from(rulesCompiled).toString("base64")}`);
const validationSource=(await source("../lib/nissettone/validation.ts")).replace(/^import .*;\r?\n/gm,"");
const nameSource=await source("../lib/ticketing/name-format.ts");
const validationCompiled=ts.transpileModule(`${nameSource}\nconst NISSETTONE_MAX_QUANTITY=250;\nconst isDeclaredRomeMunicipality=value=>value.trim().toLocaleLowerCase("it-IT")==="roma";\nconst addressVerificationFor=method=>method==="PICKUP"?"NOT_REQUIRED":"PENDING";\n${validationSource}`,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const validationRules=await import(`data:text/javascript;base64,${Buffer.from(validationCompiled).toString("base64")}`);
const baseOrder={requestId:"11111111-1111-4111-8111-111111111111",quantity:1,firstName:"mARIA",lastName:"dE lUCA",email:"cliente@example.com",phone:"3331234567",deliveryMethod:"PICKUP",privacyAccepted:true,termsAccepted:true};

test("NISSETTONE costs 55 EUR per item and never trusts a client total",()=>{
  assert.equal(rules.NISSETTONE_UNIT_PRICE_CENTS,5500);
  assert.equal(rules.nissettoneTotalCents(1),5500);
  assert.equal(rules.nissettoneTotalCents(3),16500);
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
  const configured={NISSETTONE_PAYPAL_ENABLED:"true",PAYPAL_CLIENT_ID:"client",PAYPAL_CLIENT_SECRET:"secret",PAYPAL_ENV:"sandbox",NISSETTONE_PAYPAL_WEBHOOK_ID:"webhook",NISSETTONE_TERMS_URL:"/nissettone/condizioni-preordine",NISSETTONE_PRIVACY_URL:"/privacy-policy"};
  assert.equal(rules.checkoutConfigured(configured),true);
  assert.equal(rules.checkoutConfigured({...configured,NISSETTONE_PAYPAL_WEBHOOK_ID:""}),false);
  assert.equal(rules.checkoutConfigured({...configured,PAYPAL_ENV:"invalid"}),false);
  assert.equal(rules.checkoutConfigured({...configured,NISSETTONE_PAYPAL_ENABLED:"false"}),false);
  assert.equal(rules.checkoutConfigured({...configured,NISSETTONE_TERMS_URL:""}),false);
  assert.equal(rules.checkoutConfigured({...configured,NISSETTONE_PRIVACY_URL:"http://example.com/privacy"}),false);
});

test("checkout consent links only to configured approved legal documents",async()=>{
  const checkout=await source("../components/NissettoneCheckout.tsx");
  assert.match(checkout,/Ho letto e accetto le/);
  assert.match(checkout,/Condizioni di preordine/);
  assert.match(checkout,/Informativa sulla privacy/);
  assert.doesNotMatch(checkout,/da approvare amministrativamente/);
  assert.match(checkout,/termsUrl&&privacyUrl/);
});

test("migration is additive, isolated from Gala and seeds a disabled 250 item product",async()=>{
  const [base,fiscal]=await Promise.all([source("../migrations/028_nissettone_2026.sql"),source("../migrations/029_nissettone_buyer_fiscal_data.sql")]);
  assert.match(base,/CREATE TABLE IF NOT EXISTS nissettone_products/);
  assert.match(base,/CREATE TABLE IF NOT EXISTS nissettone_orders/);
  assert.match(base,/stock_total INTEGER NOT NULL/);
  assert.match(base,/quantity BETWEEN 1 AND 250/);
  assert.match(base,/VALUES\('nissettone-2026','NISSETTONE 2026',5000,'EUR',250,'DRAFT'/);
  assert.match(fiscal,/ADD COLUMN IF NOT EXISTS buyer_type/);
  assert.match(fiscal,/ADD COLUMN IF NOT EXISTS document_status/);
  assert.match(fiscal,/SET unit_price_cents=5500/);
  assert.match(fiscal,/status='DRAFT'/);
  assert.match(fiscal,/NOT EXISTS \(\s*SELECT 1 FROM nissettone_orders/);
  assert.doesNotMatch(`${base}\n${fiscal}`,/DROP\s|TRUNCATE\s|ALTER TABLE ticketing_|UPDATE ticketing_|DELETE FROM ticketing_/i);
});

test("buyer and fiscal data are validated server-side without mixing delivery address",async()=>{
  const validation=await source("../lib/nissettone/validation.ts");
  assert.match(validation,/buyerType==="ORGANIZATION"/);
  assert.match(validation,/!legalName\|\|!fiscalCode/);
  assert.match(validation,/buyerType==="ORGANIZATION"\?vatNumber/);
  assert.match(validation,/buyerType==="PRIVATE"&&invoiceRequested/);
  assert.match(validation,/deliveryMethod/);
  assert.match(validation,/fiscalStreet/);
  assert.match(validation,/street,houseNumber,postcode,city/);
  assert.doesNotMatch(validation,/buyerType==="ORGANIZATION"&&[^\n]*!vatNumber/);
  const privateOrder=validationRules.parseNissettoneOrderInput({...baseOrder,buyerType:"PRIVATE"});
  assert.equal(privateOrder.firstName,"Maria");
  assert.equal(privateOrder.lastName,"De Luca");
  assert.equal(privateOrder.fiscalCode,null);
  const company=validationRules.parseNissettoneOrderInput({...baseOrder,buyerType:"ORGANIZATION",legalName:"Impresa Demo",fiscalCode:"ABC123",vatNumber:"IT01234567890",fiscalStreet:"Via Roma",fiscalHouseNumber:"1",fiscalPostcode:"00100",fiscalCity:"Roma",fiscalProvince:"RM",fiscalCountry:"Italia"});
  assert.equal(company.vatNumber,"IT01234567890");
  const association=validationRules.parseNissettoneOrderInput({...baseOrder,buyerType:"ORGANIZATION",legalName:"Associazione Demo",fiscalCode:"DEF456",fiscalStreet:"Via Lazio",fiscalHouseNumber:"2",fiscalPostcode:"00100",fiscalCity:"Roma",fiscalProvince:"RM",fiscalCountry:"Italia"});
  assert.equal(association.vatNumber,null);
  const invoicedDelivery=validationRules.parseNissettoneOrderInput({...baseOrder,buyerType:"PRIVATE",invoiceRequested:true,fiscalCode:"RSSMRA80A01H501Z",fiscalStreet:"Via Fiscale",fiscalHouseNumber:"3",fiscalPostcode:"00100",fiscalCity:"Roma",fiscalProvince:"RM",fiscalCountry:"Italia",deliveryMethod:"DELIVERY",street:"Via Consegna",houseNumber:"4",postcode:"00100",city:"Roma"});
  assert.equal(invoicedDelivery.fiscalStreet,"Via Fiscale");
  assert.equal(invoicedDelivery.street,"Via Consegna");
});

test("dashboard and exports keep fiscal data behind SUPERADMIN routes",async()=>{
  const [page,route,exporter,exportRoute]=await Promise.all([source("../components/StaffNissettoneOrders.tsx"),source("../app/api/nissettone/staff/orders/route.ts"),source("../lib/nissettone/export.ts"),source("../app/api/nissettone/staff/exports/[format]/route.ts")]);
  assert.match(page,/Dati fiscali riservati/);
  assert.match(page,/documentStatus/);
  assert.match(route,/role!=="SUPERADMIN"/);
  assert.match(route,/administrativeNotes/);
  assert.match(exporter,/Tipologia acquirente/);
  assert.match(exporter,/Codice fiscale/);
  assert.match(exporter,/Stato documento/);
  assert.match(exportRoute,/role!=="SUPERADMIN"/);
});

test("NISSETTONE email uses its dedicated Graph sender and fails closed when unset",async()=>{
  const [email,provider,env]=await Promise.all([source("../lib/nissettone/email.ts"),source("../lib/email/provider.ts"),source("../.env.example")]);
  assert.match(email,/NISSETTONE_EMAIL_FROM/);
  assert.match(email,/status:"DISABLED"/);
  assert.match(email,/from:sender/);
  assert.match(email,/replyTo:sender/);
  assert.match(provider,/microsoftGraphSettings\(message\.from\)/);
  assert.match(env,/NISSETTONE_EMAIL_FROM=ordini@nazionaleitalianasanitari\.com/);
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

test("inventory activation sends STATUS and records the DRAFT to ACTIVE audit atomically",async()=>{
  const [route,repository,dashboard,migration]=await Promise.all([
    source("../app/api/nissettone/staff/inventory/route.ts"),
    source("../lib/nissettone/repository.ts"),
    source("../components/StaffNissettoneOrders.tsx"),
    source("../migrations/028_nissettone_2026.sql"),
  ]);
  assert.match(dashboard,/name="action" defaultValue="STATUS"/);
  assert.match(route,/body\.action==="STATUS"/);
  assert.match(route,/body\.status==="ACTIVE"/);
  assert.match(repository,/UPDATE nissettone_products SET status=\$2/);
  assert.match(repository,/PRODUCT_STATUS/);
  assert.match(repository,/STOCK_UNCHANGED/);
  assert.match(migration,/quantity INTEGER NOT NULL CHECK \(quantity <> 0\)/);
});

test("the four official product images and public SEO route are wired",async()=>{
  for(const file of ["nissettone-prodotto.jpg","nissettone-01.jpeg","nissettone-2.jpeg","nissettone-3.jpeg"]){
    await access(new URL(`../public/images/nissettone/${file}`,import.meta.url));
  }
  const [page,checkout,sitemap,site]=await Promise.all([source("../app/nissettone/page.tsx"),source("../components/NissettoneCheckout.tsx"),source("../app/sitemap.ts"),source("../data/site.ts")]);
  assert.match(page,/Product/);
  assert.match(page,/NISSETTONE 2026/);
  assert.match(checkout,/nissettone-prodotto\.jpg/);
  assert.match(sitemap,/\/nissettone/);
  assert.match(site,/NISSETTONE/);
});
