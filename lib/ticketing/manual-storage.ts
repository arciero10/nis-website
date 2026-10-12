import "server-only";
import {BlobServiceClient} from "@azure/storage-blob";

export type ReceiptUpload={storageKey:string;originalFilename:string;mimeType:string;size:number};

function configuration(){
  const connectionString=process.env.AZURE_STORAGE_CONNECTION_STRING?.trim();
  if(!connectionString)throw new Error("Storage contabili non configurato.");
  return {connectionString,container:process.env.NIS_TICKETING_DOCUMENTS_CONTAINER?.trim()||"nis-ticketing-private"};
}

function containerClient(){const config=configuration();return BlobServiceClient.fromConnectionString(config.connectionString).getContainerClient(config.container);}

async function streamToBuffer(stream:NodeJS.ReadableStream|null|undefined){
  if(!stream)return Buffer.alloc(0);const chunks:Buffer[]=[];for await(const chunk of stream)chunks.push(Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk));return Buffer.concat(chunks);
}

export const manualDocumentStorage={
  async upload(storageKey:string,content:Buffer,mimeType:string){
    const container=containerClient();await container.createIfNotExists();
    try{await container.getBlockBlobClient(storageKey).uploadData(content,{blobHTTPHeaders:{blobContentType:mimeType},conditions:{ifNoneMatch:"*"}});return true;}
    catch(error){const status=typeof error==="object"&&error!==null&&"statusCode" in error?Number(error.statusCode):0;if(status===409||status===412)return false;throw error;}
  },
  async download(storageKey:string){const response=await containerClient().getBlobClient(storageKey).download();return {content:await streamToBuffer(response.readableStreamBody),mimeType:response.contentType??"application/octet-stream"};},
  async remove(storageKey:string){await containerClient().deleteBlob(storageKey,{deleteSnapshots:"include"}).catch(()=>undefined);},
};
