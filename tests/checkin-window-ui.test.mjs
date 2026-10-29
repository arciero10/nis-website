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
  assert.match(scanner,/!eventCompleted&&role==="SUPERADMIN"&&checkInWindow&&<button/);
  assert.match(scanner,/APRI CHECK-IN ORA/);
  assert.match(scanner,/CHIUDI CHECK-IN/);
  assert.match(scanner,/CHECK-IN APERTO MANUALMENTE/);
  assert.match(scanner,/setCheckInWindow\(body\.window\)/);
  assert.match(route,/session\.role!=="SUPERADMIN"/);
  assert.match(route,/status:403/);
});

test("completed event is shown as historical and cannot expose manual controls",async()=>{
  const [scanner,repository,route]=await Promise.all([
    source("../components/CheckInScanner.tsx"),
    source("../lib/ticketing/checkin-window.ts"),
    source("../app/api/ticketing/staff/checkin-window/route.ts"),
  ]);
  assert.match(scanner,/eventStatus==="COMPLETED"/);
  assert.match(scanner,/EVENTO CONCLUSO/);
  assert.match(scanner,/Storico ingressi/);
  assert.match(scanner,/Concluso il:/);
  assert.match(scanner,/!eventCompleted&&role==="SUPERADMIN"/);
  assert.match(repository,/event\.status==="COMPLETED"/);
  assert.match(repository,/throw new Error\("EVENT_COMPLETED"\)/);
  assert.match(route,/EVENT_COMPLETED/);
});

test("camera check-in auto-returns only after authorization while denials remain visible",async()=>{
  const scanner=await source("../components/CheckInScanner.tsx");
  assert.match(scanner,/AUTHORIZED_RETURN_DELAY=1400/);
  assert.doesNotMatch(scanner,/DENIED_RETURN_DELAY/);
  assert.match(scanner,/if\(!authorized\)return;[\s\S]*window\.setTimeout\(nextScan,AUTHORIZED_RETURN_DELAY\)/);
  assert.match(scanner,/window\.clearTimeout\(timer\)/);
  assert.match(scanner,/navigator\.vibrate\(authorized\?80:\[100,80,100\]\)/);
  assert.match(scanner,/SCANSIONA PROSSIMO/);
  assert.match(scanner,/AudioContextConstructor=window\.AudioContext/);
  assert.match(scanner,/authorized\?\[\{frequency:880/);
  assert.match(scanner,/frequency:280[\s\S]*frequency:190/);
  assert.match(scanner,/if\(!AudioContextConstructor\)return/);
  assert.match(scanner,/catch\{\}/);
});

test("manual entry keeps preview and explicit confirmation",async()=>{
  const scanner=await source("../components/CheckInScanner.tsx");
  assert.match(scanner,/manualCheck[\s\S]*void inspectTicket\(value\)/);
  assert.match(scanner,/inspectTicket[\s\S]*method:"POST"[\s\S]*lookup\.status==="VALID"\?"confirm":"result"/);
  assert.match(scanner,/CONFERMA INGRESSO/);
  assert.match(scanner,/checkInScannedTicket[\s\S]*method:"PATCH"/);
  assert.match(scanner,/GIÀ UTILIZZATO/);
  assert.match(scanner,/Registrato alle/);
});
