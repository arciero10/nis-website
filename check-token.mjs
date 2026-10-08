import pg from "pg";
import { createHash } from "crypto";

const token = "3E1HtIJ4M6MKpPfnaeAnDaekw4MOSgl5bghqiRYmhs";
const tokenHash = createHash("sha256").update(token).digest("hex");

const c = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true }
});

await c.connect();

const r = await c.query(`
  SELECT id, access_token_hash, label, status
  FROM ticketing_invitations
`);

console.log("HASH DEL LINK:", tokenHash);
console.table(r.rows);

await c.end();
