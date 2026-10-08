import {Pool,type PoolClient,type QueryResultRow} from "pg";

declare global{
  var nisTicketingPool:Pool|undefined;
}

function databaseConfig(){
  const connectionString=process.env.DATABASE_URL?.trim();
  if(!connectionString) throw new Error("DATABASE_URL non configurata per NIS Ticketing.");

  const ssl=process.env.DATABASE_SSL==="true"
    ?{rejectUnauthorized:process.env.DATABASE_SSL_REJECT_UNAUTHORIZED!=="false"}
    :undefined;
  return {connectionString,ssl,max:10,idleTimeoutMillis:30_000,connectionTimeoutMillis:8_000};
}

export function ticketingPool(){
  if(!globalThis.nisTicketingPool) globalThis.nisTicketingPool=new Pool(databaseConfig());
  return globalThis.nisTicketingPool;
}

export async function query<T extends QueryResultRow>(text:string,values:unknown[]=[]){
  return ticketingPool().query<T>(text,values);
}

export async function withTransaction<T>(operation:(client:PoolClient)=>Promise<T>){
  const client=await ticketingPool().connect();
  try{
    await client.query("BEGIN");
    const result=await operation(client);
    await client.query("COMMIT");
    return result;
  }catch(error){
    await client.query("ROLLBACK");
    throw error;
  }finally{
    client.release();
  }
}
