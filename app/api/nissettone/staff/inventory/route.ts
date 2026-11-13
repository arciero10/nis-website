import {NextResponse} from "next/server";
import {getStaffSession} from "@/lib/ticketing/staff-auth";
import {NissettoneConflictError,setNissettoneProductStatus,updateNissettoneStock} from "@/lib/nissettone/repository";

type InventoryBody={action?:unknown;stockTotal?:unknown;status?:unknown;reason?:unknown};

function safeErrorDetails(error:unknown){
  if(!(error instanceof Error))return {name:"UnknownError"};
  const databaseError=error as Error&{code?:string;constraint?:string};
  return {name:error.name,code:databaseError.code,constraint:databaseError.constraint};
}

export async function PATCH(request:Request){
  const session=await getStaffSession(request);
  if(!session||session.role!=="SUPERADMIN")return NextResponse.json({message:"Operazione riservata al Superadmin."},{status:403});

  let body:InventoryBody={};
  try{
    body=await request.json() as InventoryBody;
    const reason=typeof body.reason==="string"?body.reason.trim().slice(0,500):"";
    if(reason.length<3)return NextResponse.json({message:"Motivazione obbligatoria."},{status:400});
    if(body.action==="STOCK"){
      const total=Number(body.stockTotal);
      return NextResponse.json({product:await updateNissettoneStock(total,reason,session)});
    }
    if(body.action==="STATUS"&&(body.status==="DRAFT"||body.status==="ACTIVE"||body.status==="ARCHIVED")){
      return NextResponse.json({product:await setNissettoneProductStatus(body.status,reason,session)});
    }
    return NextResponse.json({message:"Operazione non valida."},{status:400});
  }catch(error){
    if(error instanceof NissettoneConflictError)return NextResponse.json({message:error.message,code:error.code},{status:409});
    console.error("Nissettone inventory update failed",{
      action:typeof body.action==="string"?body.action:"UNKNOWN",
      target:body.action==="STATUS"&&typeof body.status==="string"?body.status:"REDACTED",
      ...safeErrorDetails(error),
    });
    return NextResponse.json({message:"Inventario non aggiornato."},{status:500});
  }
}
