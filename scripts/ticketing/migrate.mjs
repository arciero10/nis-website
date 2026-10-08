import {readdir,readFile} from "node:fs/promises";
import {resolve} from "node:path";
import pg from "pg";

const connectionString=process.env.DATABASE_URL?.trim();
if(!connectionString) throw new Error("DATABASE_URL non configurata.");

const ssl=process.env.DATABASE_SSL==="true"
  ?{rejectUnauthorized:process.env.DATABASE_SSL_REJECT_UNAUTHORIZED!=="false"}
  :undefined;
const client=new pg.Client({connectionString,ssl});
const migrationsDirectory=resolve(process.cwd(),"migrations");

await client.connect();
try{
  await client.query(`CREATE TABLE IF NOT EXISTS ticketing_schema_migrations (
    name TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  const files=(await readdir(migrationsDirectory)).filter(file=>file.endsWith(".sql")).sort();

  for(const file of files){
    const alreadyApplied=await client.query("SELECT 1 FROM ticketing_schema_migrations WHERE name=$1",[file]);
    if(alreadyApplied.rowCount) continue;

    await client.query("BEGIN");
    try{
      await client.query("SELECT pg_advisory_xact_lock($1)",[26062026]);
      await client.query(await readFile(resolve(migrationsDirectory,file),"utf8"));
      await client.query("INSERT INTO ticketing_schema_migrations(name) VALUES($1)",[file]);
      await client.query("COMMIT");
      console.log(`Migrazione applicata: ${file}`);
    }catch(error){
      await client.query("ROLLBACK");
      throw error;
    }
  }
}finally{
  await client.end();
}
