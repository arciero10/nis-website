import pg from "pg";

const c = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true }
});

await c.connect();

const r = await c.query(`
  SELECT
    i.id AS invitation_id,
    i.event_id,
    i.label,
    i.status,
    i.max_uses,
    i.used_count,
    e.id AS event_id_found,
    e.slug,
    e.title,
    e.status AS event_status
  FROM ticketing_invitations i
  LEFT JOIN ticketing_events e ON e.id = i.event_id
`);

console.table(r.rows);

await c.end();
