"use client";

import Link from "next/link";
import {FormEvent,useState} from "react";

type FieldName="firstName"|"lastName"|"email"|"phone"|"profession"|"healthSector"|"city"|"interestArea"|"message"|"privacy";
type FormErrors=Partial<Record<FieldName,string>>;

const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form:HTMLFormElement):FormErrors{
  const data=new FormData(form);
  const errors:FormErrors={};
  const requiredFields:[FieldName,string][]=[
    ["firstName","Inserisci il nome."],
    ["lastName","Inserisci il cognome."],
    ["email","Inserisci l’indirizzo email."],
    ["profession","Inserisci la professione o il ruolo."],
    ["city","Inserisci la città."],
    ["message","Inserisci la motivazione o un messaggio."],
  ];

  requiredFields.forEach(([name,message])=>{
    if(!String(data.get(name)??"").trim()) errors[name]=message;
  });

  const email=String(data.get("email")??"").trim();
  if(email&&!emailPattern.test(email)) errors.email="Inserisci un indirizzo email valido.";
  if(data.get("privacy")!=="on") errors.privacy="Devi accettare l’informativa privacy per inviare la candidatura.";
  return errors;
}

export default function ApplicationForm(){
  const [errors,setErrors]=useState<FormErrors>({});
  const [status,setStatus]=useState<"idle"|"sending"|"success"|"error">("idle");
  const [serverMessage,setServerMessage]=useState("");

  async function handleSubmit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const form=event.currentTarget;
    const nextErrors=validate(form);
    setErrors(nextErrors);
    setServerMessage("");

    if(Object.keys(nextErrors).length){
      setStatus("idle");
      const firstError=Object.keys(nextErrors)[0] as FieldName;
      const firstInvalid=form.elements.namedItem(firstError);
      if(firstInvalid instanceof HTMLElement) firstInvalid.focus();
      return;
    }

    setStatus("sending");
    const data=Object.fromEntries(new FormData(form).entries());

    try{
      const response=await fetch("/api/candidature",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...data,privacy:data.privacy==="on"}),
      });
      const result=await response.json() as {message?:string};
      if(!response.ok) throw new Error(result.message||"Non è stato possibile inviare la candidatura.");

      form.reset();
      setErrors({});
      setStatus("success");
    }catch(error){
      setStatus("error");
      setServerMessage(error instanceof Error?error.message:"Non è stato possibile inviare la candidatura. Riprova più tardi.");
    }
  }

  const fieldProps=(name:FieldName)=>({
    "aria-invalid":Boolean(errors[name]),
    "aria-describedby":errors[name]?`${name}-error`:undefined,
    onChange:()=>{
      if(errors[name]) setErrors(current=>({...current,[name]:undefined}));
    },
  });

  return <form className="form-side dark application-form" noValidate onSubmit={handleSubmit}>
    <div className="eyebrow white">DIVENTA PARTE DEL CAMBIAMENTO</div>
    <h2 className="section-title">Invia la tua candidatura</h2>
    <p className="application-intro">Raccontaci chi sei e come vorresti contribuire alle attività della Nazionale Italiana Sanitari.</p>

    <div className="form-grid">
      <label className="field">Nome *
        <input name="firstName" autoComplete="given-name" maxLength={80} required {...fieldProps("firstName")}/>
        {errors.firstName&&<span className="field-error" id="firstName-error">{errors.firstName}</span>}
      </label>
      <label className="field">Cognome *
        <input name="lastName" autoComplete="family-name" maxLength={80} required {...fieldProps("lastName")}/>
        {errors.lastName&&<span className="field-error" id="lastName-error">{errors.lastName}</span>}
      </label>
      <label className="field">Email *
        <input name="email" type="email" inputMode="email" autoComplete="email" maxLength={160} required {...fieldProps("email")}/>
        {errors.email&&<span className="field-error" id="email-error">{errors.email}</span>}
      </label>
      <label className="field">Telefono
        <input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40}/>
      </label>
      <label className="field">Professione / ruolo *
        <input name="profession" autoComplete="organization-title" maxLength={120} required {...fieldProps("profession")}/>
        {errors.profession&&<span className="field-error" id="profession-error">{errors.profession}</span>}
      </label>
      <label className="field">Ambito sanitario
        <input name="healthSector" maxLength={120}/>
      </label>
      <label className="field">Città *
        <input name="city" autoComplete="address-level2" maxLength={100} required {...fieldProps("city")}/>
        {errors.city&&<span className="field-error" id="city-error">{errors.city}</span>}
      </label>
      <label className="field">Disciplina / area di interesse
        <input name="interestArea" maxLength={140}/>
      </label>
      <label className="field full">Motivazione / messaggio *
        <textarea name="message" maxLength={2000} required placeholder="Raccontaci la tua motivazione e quale contributo vorresti portare alla NIS." {...fieldProps("message")}/>
        {errors.message&&<span className="field-error" id="message-error">{errors.message}</span>}
      </label>
      <div className="field full privacy-field">
        <label className="privacy-check">
          <input name="privacy" type="checkbox" required {...fieldProps("privacy")}/>
          <span>Dichiaro di aver letto la <Link href="/privacy-policy">Privacy Policy</Link> e acconsento al trattamento dei dati personali ai fini della gestione della candidatura.</span>
        </label>
        {errors.privacy&&<span className="field-error" id="privacy-error">{errors.privacy}</span>}
      </div>
    </div>

    <button type="submit" className="btn btn-blue application-submit" disabled={status==="sending"}>
      {status==="sending"?"INVIO IN CORSO...":"INVIA CANDIDATURA"}
    </button>

    {status==="success"&&<div className="form-status success" role="status">
      <strong>Candidatura inviata correttamente.</strong>
      <span>Grazie per aver scelto di entrare in contatto con la Nazionale Italiana Sanitari. Il nostro team valuterà la tua richiesta e ti ricontatterà.</span>
    </div>}
    {status==="error"&&<div className="form-status error" role="alert">{serverMessage}</div>}
  </form>;
}
