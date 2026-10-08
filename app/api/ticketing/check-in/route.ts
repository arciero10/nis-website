import {NextResponse} from "next/server";

export const runtime="nodejs";

export async function POST(request:Request){
  let credential="";
  try{
    const payload=await request.json() as {credential?:unknown};
    credential=typeof payload.credential==="string"?payload.credential.trim():"";
  }catch{
    return NextResponse.json({message:"Richiesta non valida."},{status:400});
  }

  if(!credential||credential.length>160){
    return NextResponse.json({message:"Inserisci un codice ticket valido."},{status:400});
  }

  return NextResponse.json({
    code:"CHECK_IN_NOT_CONFIGURED",
    message:"La verifica ticket sara disponibile dopo il collegamento della persistenza.",
  },{status:503});
}
