import "server-only";

import {randomBytes,randomUUID} from "node:crypto";
import {BlobSASPermissions,BlobServiceClient,type ContainerClient} from "@azure/storage-blob";

const defaultContainerName="nis-ticketing-archives";
const archivePrefix="gala-2026";
const archiveLifetimeMs=7*24*60*60*1000;

export type PartnerArchiveUpload={
  url:string;
  blobName:string;
  expiresAt:Date;
};

type ArchiveStorageOptions={
  connectionString?:string;
  containerName?:string;
  now?:()=>Date;
  containerClient?:ContainerClient;
};

function configuredContainer(options:ArchiveStorageOptions){
  if(options.containerClient)return options.containerClient;
  const connectionString=options.connectionString??process.env.AZURE_STORAGE_CONNECTION_STRING;
  if(!connectionString)throw new Error("Storage privato archivi ticketing non configurato.");
  const containerName=(options.containerName??process.env.NIS_TICKETING_ARCHIVES_CONTAINER??defaultContainerName).trim();
  if(!containerName)throw new Error("Container archivi ticketing non configurato.");
  return BlobServiceClient.fromConnectionString(connectionString).getContainerClient(containerName);
}

export class PartnerArchiveStorage{
  private readonly container:ContainerClient;
  private readonly now:()=>Date;

  constructor(options:ArchiveStorageOptions={}){
    this.container=configuredContainer(options);
    this.now=options.now??(()=>new Date());
  }

  async upload(name:string,content:Uint8Array):Promise<PartnerArchiveUpload>{
    if(content.byteLength===0)throw new Error("Archivio ZIP vuoto.");
    await this.container.createIfNotExists();
    await this.container.setAccessPolicy();

    const createdAt=this.now();
    const expiresAt=new Date(createdAt.getTime()+archiveLifetimeMs);
    const randomKey=`${randomUUID()}-${randomBytes(18).toString("hex")}`;
    const blobName=`${archivePrefix}/${randomKey}.zip`;
    const blob=this.container.getBlockBlobClient(blobName);
    await blob.uploadData(content,{
      blobHTTPHeaders:{
        blobContentType:"application/zip",
        blobContentDisposition:`attachment; filename="${name.replace(/["\r\n]/g,"_")}"`,
        blobCacheControl:"private, no-store, max-age=0",
      },
      metadata:{expiresat:expiresAt.toISOString()},
    });

    const url=await blob.generateSasUrl({
      permissions:BlobSASPermissions.parse("r"),
      startsOn:new Date(createdAt.getTime()-5*60*1000),
      expiresOn:expiresAt,
      contentDisposition:`attachment; filename="${name.replace(/["\r\n]/g,"_")}"`,
      contentType:"application/zip",
    });
    return {url,blobName,expiresAt};
  }
}

export function getPartnerArchiveStorage(){
  return new PartnerArchiveStorage();
}
