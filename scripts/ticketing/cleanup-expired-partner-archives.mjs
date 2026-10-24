import {BlobServiceClient} from "@azure/storage-blob";

const execute=process.argv.includes("--execute");
const dryRun=process.argv.includes("--dry-run")||!execute;
const connectionString=process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName=(process.env.NIS_TICKETING_ARCHIVES_CONTAINER||"nis-ticketing-archives").trim();

if(!connectionString)throw new Error("AZURE_STORAGE_CONNECTION_STRING non configurata.");
if(!containerName)throw new Error("NIS_TICKETING_ARCHIVES_CONTAINER non configurato.");

const container=BlobServiceClient.fromConnectionString(connectionString).getContainerClient(containerName);
const now=Date.now();
let scanned=0;
let expired=0;
let deleted=0;

for await(const blob of container.listBlobsFlat({prefix:"gala-2026/",includeMetadata:true})){
  scanned+=1;
  const expiresAt=Date.parse(blob.metadata?.expiresat||"");
  if(!Number.isFinite(expiresAt)||expiresAt>now)continue;
  expired+=1;
  if(!dryRun){
    await container.deleteBlob(blob.name,{deleteSnapshots:"include"});
    deleted+=1;
  }
}

console.log(JSON.stringify({mode:dryRun?"dry-run":"execute",scanned,expired,deleted},null,2));
