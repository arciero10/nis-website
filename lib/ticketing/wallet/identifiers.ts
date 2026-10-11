export function stableGoogleWalletObjectId(issuerId:string,ticketId:string){
  const suffix=`nis_gala_2026_${ticketId.toLowerCase().replace(/[^a-z0-9_-]/g,"_")}`;
  return `${issuerId}.${suffix}`;
}

export function qualifiedGoogleWalletClassId(issuerId:string,classId:string){
  return classId.startsWith(`${issuerId}.`)?classId:`${issuerId}.${classId}`;
}
