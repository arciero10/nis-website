import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

const source=path=>readFile(new URL(path,import.meta.url),"utf8");

test("STAFF navigation exposes only operational sections and logout",async()=>{
  const [navigation,styles]=await Promise.all([source("../components/StaffNavigation.tsx"),source("../app/globals.css")]);
  assert.match(navigation,/const staffLinks=\[[\s\S]*Check-in[\s\S]*Partecipanti[\s\S]*Ingressi[\s\S]*\]/);
  assert.match(navigation,/const superadminLinks=\[[\s\S]*Dashboard[\s\S]*Eventi[\s\S]*Biglietti[\s\S]*Aziende[\s\S]*Report[\s\S]*\]/);
  assert.match(navigation,/role==="SUPERADMIN"\?superadminLinks:staffLinks/);
  assert.match(navigation,/loggingOut\?"Uscita\.\.\.":"Esci"/);
  assert.match(styles,/staff-sidebar-toggle/);
  assert.match(styles,/staff-navigation\.staff-sidebar/);
  assert.match(styles,/@media\(max-width:960px\)/);
  assert.match(styles,/staff-dashboard-metrics-operational\{grid-template-columns:repeat\(3/);
});

test("sensitive staff pages and APIs require SUPERADMIN",async()=>{
  const [guard,partnerPage,partnerDetail,issuancePage,ticketDetail,resend,...manualRoutes]=await Promise.all([
    source("../lib/ticketing/staff-page.ts"),
    source("../app/staff/partner/page.tsx"),
    source("../app/staff/partner/[id]/page.tsx"),
    source("../app/staff/emissione/page.tsx"),
    source("../app/staff/ticket/[ticketCode]/page.tsx"),
    source("../app/api/ticketing/staff/resend-ticket/route.ts"),
    source("../app/api/ticketing/staff/manual-issuance/paypal-charity/route.ts"),
    source("../app/api/ticketing/staff/manual-issuance/cash/route.ts"),
    source("../app/api/ticketing/staff/manual-issuance/bank-transfer/route.ts"),
    source("../app/api/ticketing/staff/manual-issuance/complimentary/route.ts"),
    source("../app/api/ticketing/staff/manual-issuance/admin/route.ts"),
  ]);
  assert.match(guard,/requireSuperadminSession/);
  assert.match(guard,/session\.role!=="SUPERADMIN"/);
  for(const page of [partnerPage,partnerDetail,issuancePage,ticketDetail])assert.match(page,/requireSuperadminSession/);
  for(const route of [resend,...manualRoutes]){assert.match(route,/session\.role!=="SUPERADMIN"/);assert.match(route,/status:403/);}
});

test("STAFF participants view omits administrative composition, delivery and resend controls",async()=>{
  const [page,dashboard,route]=await Promise.all([
    source("../app/staff/partecipanti/page.tsx"),
    source("../components/StaffParticipantsDashboard.tsx"),
    source("../app/api/ticketing/staff/participants/route.ts"),
  ]);
  assert.match(page,/StaffParticipantsDashboard role=\{session\.role\}/);
  assert.match(dashboard,/const isSuperadmin=role==="SUPERADMIN"/);
  for(const label of ["Capienza","Posti disponibili","Composizione del totale operativo","Filtra origine","Filtra tipo invito","REINVIA BIGLIETTO","Tentativi"])assert.match(dashboard,new RegExp(`isSuperadmin[^\\n]*|${label}`));
  assert.match(dashboard,/staff-dashboard-metrics-operational/);
  assert.match(dashboard,/Totale attesi/);
  assert.match(dashboard,/Nome, cognome o codice ticket/);
  assert.match(route,/session\.role==="SUPERADMIN"\?rawSource/);
  assert.match(route,/session\.role==="SUPERADMIN"\?rawType/);
  assert.match(route,/if\(session\.role==="SUPERADMIN"\)return NextResponse\.json\(dashboard\)/);
  assert.doesNotMatch(route,/emailStatus:person|emailSendAttempts:person|emailLastError:person/);
});

test("STAFF scanner and ingress history hide SUPERADMIN audit and reversal controls",async()=>{
  const [scanner,history,statusRoute]=await Promise.all([
    source("../components/CheckInScanner.tsx"),
    source("../components/StaffIngressDashboard.tsx"),
    source("../app/api/ticketing/staff/checkin-window/route.ts"),
  ]);
  assert.match(scanner,/role==="SUPERADMIN"&&checkInWindow\?\.source==="MANUAL"&&checkInWindow\.changedBy/);
  assert.match(scanner,/StaffNavigation role=\{role\}/);
  assert.match(history,/visibleEntries=role==="SUPERADMIN"\?dashboard\.entries:dashboard\.entries\.filter/);
  assert.match(history,/role==="SUPERADMIN"&&entry\.status==="REVERSED"/);
  assert.match(history,/role==="SUPERADMIN"&&entry\.status==="ACTIVE"&&<button/);
  assert.match(statusRoute,/session\.role==="SUPERADMIN"\?window:\{\.\.\.window,changedBy:null,changedAt:null\}/);
});
