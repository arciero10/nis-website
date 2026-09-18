import {NextResponse} from "next/server";

const recipient="info@nazionaleitalianasanitari.com";
const requiredFields=["firstName","lastName","email","profession","city","message"] as const;
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ApplicationPayload={
  firstName?:unknown;
  lastName?:unknown;
  email?:unknown;
  phone?:unknown;
  profession?:unknown;
  healthSector?:unknown;
  city?:unknown;
  interestArea?:unknown;
  message?:unknown;
  privacy?:unknown;
};

function text(value:unknown,maxLength:number){
  return typeof value==="string"?value.trim().slice(0,maxLength):"";
}

function escapeHtml(value:string){
  return value.replace(/[&<>"']/g,character=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[character]??character);
}

export async function POST(request:Request){
  let payload:ApplicationPayload;
  try{
    payload=await request.json() as ApplicationPayload;
  }catch{
    return NextResponse.json({message:"Dati della candidatura non validi."},{status:400});
  }

  const application={
    firstName:text(payload.firstName,80),
    lastName:text(payload.lastName,80),
    email:text(payload.email,160),
    phone:text(payload.phone,40),
    profession:text(payload.profession,120),
    healthSector:text(payload.healthSector,120),
    city:text(payload.city,100),
    interestArea:text(payload.interestArea,140),
    message:text(payload.message,2000),
  };

  if(requiredFields.some(field=>!application[field])||!emailPattern.test(application.email)||payload.privacy!==true){
    return NextResponse.json({message:"Controlla i campi obbligatori e il consenso privacy."},{status:400});
  }

  const apiKey=process.env.RESEND_API_KEY;
  const from=process.env.NIS_APPLICATION_FROM_EMAIL;
  if(!apiKey||!from){
    return NextResponse.json({message:"Il servizio di invio candidature non è ancora attivo. Riprova più tardi o contatta info@nazionaleitalianasanitari.com."},{status:503});
  }

  const rows=[
    ["Nome",application.firstName],
    ["Cognome",application.lastName],
    ["Email",application.email],
    ["Telefono",application.phone||"Non indicato"],
    ["Professione / ruolo",application.profession],
    ["Ambito / settore sanitario",application.healthSector||"Non indicato"],
    ["Città",application.city],
    ["Disciplina o area di interesse",application.interestArea||"Non indicata"],
    ["Motivazione / messaggio",application.message],
  ];
  const html=`<h1>Nuova candidatura NIS</h1>${rows.map(([label,value])=>`<p><strong>${escapeHtml(label)}:</strong><br>${escapeHtml(value)}</p>`).join("")}<p><strong>Consenso privacy:</strong> acquisito</p>`;

  try{
    const response=await fetch("https://api.resend.com/emails",{
      method:"POST",
      headers:{Authorization:`Bearer ${apiKey}`,"Content-Type":"application/json"},
      body:JSON.stringify({
        from,
        to:[recipient],
        reply_to:application.email,
        subject:`Nuova candidatura NIS - ${application.firstName} ${application.lastName}`,
        html,
      }),
    });
    if(!response.ok) throw new Error(`Email provider error: ${response.status}`);
  }catch(error){
    console.error("Application email delivery failed",error);
    return NextResponse.json({message:"L’invio non è riuscito. Riprova più tardi."},{status:502});
  }

  return NextResponse.json({message:"Candidatura inviata correttamente."});
}
