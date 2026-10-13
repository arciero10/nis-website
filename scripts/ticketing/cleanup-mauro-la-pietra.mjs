import pg from "pg";

const dryRun=process.argv.includes("--dry-run");const confirm=process.argv.includes("--confirm");
if(dryRun===confirm||process.argv.slice(2).some(value=>value!=="--dry-run"&&value!=="--confirm"))throw new Error("Uso: node scripts/ticketing/cleanup-mauro-la-pietra.mjs --dry-run|--confirm");
const connectionString=process.env.DATABASE_URL?.trim();if(!connectionString)throw new Error("DATABASE_URL non configurata.");
const client=new pg.Client({connectionString,ssl:process.env.DATABASE_SSL==="true"?{rejectUnauthorized:process.env.DATABASE_SSL_REJECT_UNAUTHORIZED!=="false"}:undefined});
const expected={firstName:"Mauro",lastName:"La Pietra",ticketCode:"NIS26-QT7ABN6W",source:"BANK_TRANSFER"};

await client.connect();
try{
  await client.query("BEGIN");
  const result=await client.query(`SELECT ticket.id AS ticket_id,ticket.event_id,ticket.attendee_id,ticket.manual_issuance_id,ticket.ticket_code,ticket.status,ticket.issuance_source,attendee.first_name,attendee.last_name,
    (SELECT COUNT(*) FROM ticketing_check_ins WHERE ticket_id=ticket.id)::integer AS check_ins,
    (SELECT COUNT(*) FROM ticketing_tickets WHERE attendee_id=ticket.attendee_id)::integer AS attendee_tickets,
    (SELECT COUNT(*) FROM ticketing_tickets WHERE manual_issuance_id=ticket.manual_issuance_id)::integer AS issuance_tickets
    FROM ticketing_tickets ticket JOIN ticketing_attendees attendee ON attendee.id=ticket.attendee_id
    WHERE ticket.ticket_code=$1 AND ticket.issuance_source=$2 AND attendee.first_name=$3 AND attendee.last_name=$4
    FOR UPDATE OF ticket`,[expected.ticketCode,expected.source,expected.firstName,expected.lastName]);
  const row=result.rows[0];console.log(confirm?"CLEANUP MAURO LA PIETRA - CONFERMA":"CLEANUP MAURO LA PIETRA - DRY RUN");
  if(!row){console.log("Nessun ticket corrispondente ai quattro criteri esatti trovato. Nessuna modifica.");await client.query("ROLLBACK");}
  else{
    console.table([{nome:`${row.first_name} ${row.last_name}`,ticket:row.ticket_code,origine:row.issuance_source,stato:row.status,checkIn:row.check_ins,ticketAttendee:row.attendee_tickets,ticketEmissione:row.issuance_tickets}]);
    console.log("Record previsti: 1 ticket;",row.check_ins,"check-in;",row.attendee_tickets===1?"1 attendee esclusivo":"attendee condiviso preservato",";",row.issuance_tickets===1?"1 emissione esclusiva":"emissione condivisa preservata");
    if(dryRun){await client.query("ROLLBACK");console.log("Nessuna cancellazione eseguita. Usa --confirm per procedere.");}
    else{
      await client.query("INSERT INTO ticketing_ticket_deletion_audit(id,event_id,ticket_id,ticket_code,holder_name,source,previous_status,deleted_by_display_name,deleted_by_role,deletion_reason) VALUES(gen_random_uuid(),$1,$2,$3,$4,$5,$6,$7,'SUPERADMIN',$8)",[row.event_id,row.ticket_id,row.ticket_code,`${row.first_name} ${row.last_name}`,row.issuance_source,row.status,"ONE-OFF CLEANUP","Ticket BANK_TRANSFER creato per errore"]);
      await client.query("DELETE FROM ticketing_check_ins WHERE ticket_id=$1",[row.ticket_id]);await client.query("DELETE FROM ticketing_tickets WHERE id=$1",[row.ticket_id]);
      await client.query("DELETE FROM ticketing_attendees attendee WHERE attendee.id=$1 AND NOT EXISTS (SELECT 1 FROM ticketing_tickets WHERE attendee_id=attendee.id) AND NOT EXISTS (SELECT 1 FROM ticketing_orders WHERE attendee_id=attendee.id) AND NOT EXISTS (SELECT 1 FROM ticketing_order_participants WHERE attendee_id=attendee.id)",[row.attendee_id]);
      if(row.manual_issuance_id)await client.query("DELETE FROM ticketing_manual_issuances issuance WHERE issuance.id=$1 AND NOT EXISTS (SELECT 1 FROM ticketing_tickets WHERE manual_issuance_id=issuance.id) AND NOT EXISTS (SELECT 1 FROM ticketing_charity_requests WHERE manual_issuance_id=issuance.id)",[row.manual_issuance_id]);
      await client.query("UPDATE ticketing_events SET status='ANNOUNCED',updated_at=NOW() WHERE id=$1 AND status='SOLD_OUT'",[row.event_id]);await client.query("COMMIT");console.log("Eliminato esclusivamente il ticket Mauro La Pietra NIS26-QT7ABN6W e i record tecnici divenuti orfani.");
    }
  }
}catch(error){await client.query("ROLLBACK");throw error;}finally{await client.end();}
