const nameBoundary=/(^|[\s'’-])(\p{L})/gu;

export function formatPersonNamePart(value:string){
  return value.normalize("NFC").trim().replace(/\s+/g," ").toLocaleLowerCase("it-IT").replace(nameBoundary,(_,boundary:string,letter:string)=>`${boundary}${letter.toLocaleUpperCase("it-IT")}`);
}

export function formatPersonFullName(firstName:string,lastName:string){
  return [formatPersonNamePart(firstName),formatPersonNamePart(lastName)].filter(Boolean).join(" ");
}

export function formatTicketHolderName(firstName:string,lastName:string){
  return formatPersonFullName(firstName,lastName).toLocaleUpperCase("it-IT");
}
