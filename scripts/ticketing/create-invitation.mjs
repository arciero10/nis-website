import {createHash,randomBytes,randomUUID} from "node:crypto";
import pg from "pg";

const connectionString=process.env.DATABASE_URL?.trim();
if(!connectionString) throw new Error("DATABASE_URL non configurata.");

const token=process.env.NIS_GALA_INVITATION_TOKEN?.trim()||randomBytes(32).toString("base64url");
if(token.length<24) throw new Error("NIS_GALA_INVITATION_TOKEN deve contenere almeno 24 caratteri.");

const maxUses=Number(process.env.NIS_GALA_INVITATION_MAX_USES||1);
if(!Number.isInteger(maxUses)||maxUses<1) throw new Error("NIS_GALA_INVITATION_MAX_USES non valido.");

const expiresAt=process.env.NIS_GALA_INVITATION_EXPIRES_AT?.trim()||null;
if(expiresAt&&Number.isNaN(new Date(expiresAt).getTime())) throw new Error("NIS_GALA_INVITATION_EXPIRES_AT non valido.");
const publicSlug=process.env.NIS_GALA_INVITATION_PUBLIC_SLUG?.trim()||"gala-2026";
if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(publicSlug)) throw new Error("NIS_GALA_INVITATION_PUBLIC_SLUG non valido.");

const ssl=process.env.DATABASE_SSL==="true"
  ?{rejectUnauthorized:process.env.DATABASE_SSL_REJECT_UNAUTHORIZED!=="false"}
  :undefined;
const client=new pg.Client({connectionString,ssl});
await client.connect();

try{
  const event=await client.query("SELECT id FROM ticketing_events WHERE slug=$1",["nis-gala-2026"]);
  if(!event.rowCount) throw new Error("Evento nis-gala-2026 non trovato. Esegui prima le migrazioni.");

  const tokenHash=createHash("sha256").update(token).digest("hex");
  await client.query(`INSERT INTO ticketing_invitations (
    id,event_id,access_token_hash,public_slug,label,max_uses,used_count,expires_at,status,created_at,updated_at
  ) VALUES ($1,$2,$3,$4,$5,$6,0,$7,'ACTIVE',NOW(),NOW())
  ON CONFLICT (access_token_hash) DO UPDATE SET
    public_slug=EXCLUDED.public_slug,
    label=EXCLUDED.label,
    max_uses=EXCLUDED.max_uses,
    expires_at=EXCLUDED.expires_at,
    status='ACTIVE',
    updated_at=NOW()`,[
    randomUUID(),
    event.rows[0].id,
    tokenHash,
    publicSlug,
    process.env.NIS_GALA_INVITATION_LABEL?.trim()||"Invito NIS Gala 2026",
    maxUses,
    expiresAt,
  ]);

  console.log("Invito creato. Conserva il link in modo riservato:");
  console.log(`http://localhost:3000/inviti/nis-gala-2026/${token}`);
}finally{
  await client.end();
}
