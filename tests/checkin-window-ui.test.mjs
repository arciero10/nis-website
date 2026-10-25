import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

const source=path=>readFile(new URL(path,import.meta.url),"utf8");

test("the staff Scanner menu opens the dynamic page that mounts the check-in controls",async()=>{
  const [page,navigation,scanner]=await Promise.all([
    source("../app/checkin/page.tsx"),
    source("../components/StaffNavigation.tsx"),
    source("../components/CheckInScanner.tsx"),
  ]);
  assert.match(navigation,/href:"\/checkin",label:"Scanner"/);
  assert.match(page,/dynamic="force-dynamic"/);
  assert.match(page,/<CheckInScanner\/>/);
  assert.match(scanner,/\/api\/ticketing\/staff\/checkin-window/);
  assert.match(scanner,/CHECK-IN CHIUSO/);
  assert.match(scanner,/CHECK-IN APERTO/);
});

test("only SUPERADMIN sees window controls while the operational state remains visible to STAFF",async()=>{
  const [scanner,route]=await Promise.all([
    source("../components/CheckInScanner.tsx"),
    source("../app/api/ticketing/staff/checkin-window/route.ts"),
  ]);
  assert.match(scanner,/role==="SUPERADMIN"&&checkInWindow&&<button/);
  assert.match(scanner,/APRI CHECK-IN ORA/);
  assert.match(scanner,/CHIUDI CHECK-IN/);
  assert.match(scanner,/CHECK-IN APERTO MANUALMENTE/);
  assert.match(scanner,/setCheckInWindow\(body\.window\)/);
  assert.match(route,/session\.role!=="SUPERADMIN"/);
  assert.match(route,/status:403/);
});
