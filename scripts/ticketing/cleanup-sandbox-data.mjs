import pg from "pg";

const modes=process.argv.slice(2).filter(argument=>argument==="--dry-run"||argument==="--execute");
if(modes.length!==1||process.argv.slice(2).some(argument=>argument!=="--dry-run"&&argument!=="--execute")){
  throw new Error("Uso: node scripts/ticketing/cleanup-sandbox-data.mjs --dry-run|--execute");
}

const execute=modes[0]==="--execute";
const connectionString=process.env.DATABASE_URL?.trim();
if(!connectionString) throw new Error("DATABASE_URL non configurata.");

const ssl=process.env.DATABASE_SSL==="true"
  ?{rejectUnauthorized:process.env.DATABASE_SSL_REJECT_UNAUTHORIZED!=="false"}
  :undefined;
const client=new pg.Client({connectionString,ssl});

const reportQuery=`
  WITH sandbox_orders AS (
    SELECT id FROM ticketing_orders
    WHERE provider='PAYPAL' AND provider_environment='SANDBOX'
  ), sandbox_tickets AS (
    SELECT ticket.* FROM ticketing_tickets ticket
    JOIN sandbox_orders orders ON orders.id=ticket.order_id
  ), sandbox_attendees AS (
    SELECT attendee_id FROM ticketing_order_participants participant
    JOIN sandbox_orders orders ON orders.id=participant.order_id
    WHERE attendee_id IS NOT NULL
    UNION
    SELECT attendee_id FROM ticketing_orders
    WHERE id IN (SELECT id FROM sandbox_orders) AND attendee_id IS NOT NULL
    UNION
    SELECT attendee_id FROM sandbox_tickets
  )
  SELECT
    (SELECT COUNT(*)::integer FROM sandbox_orders) AS orders,
    (SELECT COUNT(*)::integer FROM sandbox_attendees) AS attendees,
    (SELECT COUNT(*)::integer FROM sandbox_tickets) AS tickets,
    (SELECT COUNT(*)::integer FROM ticketing_check_ins checkin JOIN sandbox_tickets ticket ON ticket.id=checkin.ticket_id) AS check_ins,
    (SELECT COUNT(*)::integer FROM sandbox_tickets WHERE email_sent_at IS NOT NULL OR email_claimed_at IS NOT NULL OR email_last_error IS NOT NULL OR email_send_attempts>0) AS email_delivery
`;

async function report(){
  const counts=(await client.query(reportQuery)).rows[0];
  const orders=(await client.query(`
    SELECT order_row.id,order_row.provider_order_id,order_row.provider_capture_id,
      order_row.payment_status,order_row.created_at,
      COUNT(ticket.id)::integer AS ticket_count
    FROM ticketing_orders order_row
    LEFT JOIN ticketing_tickets ticket ON ticket.order_id=order_row.id
    WHERE order_row.provider='PAYPAL' AND order_row.provider_environment='SANDBOX'
    GROUP BY order_row.id
    ORDER BY order_row.created_at,order_row.id
  `)).rows;

  console.log(execute?"PULIZIA SANDBOX - ANTEPRIMA PRE-ESECUZIONE":"PULIZIA SANDBOX - DRY RUN");
  console.table([{
    "Ordini":counts.orders,
    "Partecipanti":counts.attendees,
    "Biglietti":counts.tickets,
    "Check-in":counts.check_ins,
    "Stati email":counts.email_delivery,
  }]);
  if(orders.length){
    console.table(orders.map(order=>({
      id:order.id,
      paypalOrderId:order.provider_order_id??"-",
      paypalCaptureId:order.provider_capture_id??"-",
      stato:order.payment_status,
      creatoIl:new Date(order.created_at).toISOString(),
      biglietti:order.ticket_count,
    })));
  }else console.log("Nessun ordine PayPal Sandbox da rimuovere.");
  return counts;
}

await client.connect();
try{
  const marker=await client.query(`
    SELECT 1 FROM information_schema.columns
    WHERE table_schema=current_schema()
      AND table_name='ticketing_orders'
      AND column_name='provider_environment'
  `);
  if(!marker.rowCount) throw new Error("Marker provider_environment assente. Esegui prima npm run db:migrate:ticketing.");

  if(!execute){
    await report();
  }else{
    await client.query("BEGIN");
    try{
      await client.query("SELECT pg_advisory_xact_lock($1)",[26062027]);
      await client.query(`SELECT event.id FROM ticketing_events event
        WHERE event.id IN (
          SELECT DISTINCT orders.event_id FROM ticketing_orders orders
          WHERE orders.provider='PAYPAL' AND orders.provider_environment='SANDBOX'
        ) FOR UPDATE`);
      await client.query("SELECT id FROM ticketing_orders WHERE provider='PAYPAL' AND provider_environment='SANDBOX' FOR UPDATE");
      await client.query(`CREATE TEMP TABLE cleanup_sandbox_orders ON COMMIT DROP AS
        SELECT id FROM ticketing_orders
        WHERE provider='PAYPAL' AND provider_environment='SANDBOX'`);
      await client.query(`CREATE TEMP TABLE cleanup_sandbox_attendees ON COMMIT DROP AS
        SELECT attendee_id AS id FROM ticketing_order_participants WHERE order_id IN (SELECT id FROM cleanup_sandbox_orders) AND attendee_id IS NOT NULL
        UNION
        SELECT attendee_id FROM ticketing_orders WHERE id IN (SELECT id FROM cleanup_sandbox_orders) AND attendee_id IS NOT NULL
        UNION
        SELECT attendee_id FROM ticketing_tickets WHERE order_id IN (SELECT id FROM cleanup_sandbox_orders)`);
      await client.query("SELECT ticket.id FROM ticketing_tickets ticket JOIN cleanup_sandbox_orders orders ON orders.id=ticket.order_id FOR UPDATE OF ticket");

      const sharedAttendees=await client.query(`
        SELECT attendee.id
        FROM cleanup_sandbox_attendees attendee
        WHERE EXISTS (SELECT 1 FROM ticketing_orders orders WHERE orders.attendee_id=attendee.id AND orders.id NOT IN (SELECT id FROM cleanup_sandbox_orders))
           OR EXISTS (SELECT 1 FROM ticketing_order_participants participant WHERE participant.attendee_id=attendee.id AND participant.order_id NOT IN (SELECT id FROM cleanup_sandbox_orders))
           OR EXISTS (SELECT 1 FROM ticketing_tickets ticket WHERE ticket.attendee_id=attendee.id AND ticket.order_id NOT IN (SELECT id FROM cleanup_sandbox_orders))
      `);
      if(sharedAttendees.rowCount) throw new Error("Pulizia interrotta: uno o più partecipanti Sandbox risultano condivisi con ordini non Sandbox.");

      const counts=await report();
      if(counts.orders===0){
        await client.query("COMMIT");
        console.log("Nessuna modifica necessaria.");
      }else{
        await client.query("DELETE FROM ticketing_check_ins WHERE ticket_id IN (SELECT id FROM ticketing_tickets WHERE order_id IN (SELECT id FROM cleanup_sandbox_orders))");
        await client.query("DELETE FROM ticketing_tickets WHERE order_id IN (SELECT id FROM cleanup_sandbox_orders)");
        await client.query("DELETE FROM ticketing_order_participants WHERE order_id IN (SELECT id FROM cleanup_sandbox_orders)");
        await client.query("DELETE FROM ticketing_orders WHERE id IN (SELECT id FROM cleanup_sandbox_orders)");
        await client.query("DELETE FROM ticketing_attendees WHERE id IN (SELECT id FROM cleanup_sandbox_attendees)");
        await client.query("COMMIT");
        console.log("Pulizia dati PayPal Sandbox completata.");
      }
    }catch(error){
      await client.query("ROLLBACK");
      throw error;
    }
  }
}finally{
  await client.end();
}
