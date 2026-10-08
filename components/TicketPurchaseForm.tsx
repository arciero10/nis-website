"use client";

import Link from "next/link";
import {FormEvent,useState} from "react";

type FieldName="firstName"|"lastName"|"email"|"privacy";
type FormErrors=Partial<Record<FieldName,string>>;

const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form:HTMLFormElement){
  const data=new FormData(form);
  const errors:FormErrors={};
  const firstName=String(data.get("firstName")??"").trim();
  const lastName=String(data.get("lastName")??"").trim();
  const email=String(data.get("email")??"").trim();

  if(!firstName) errors.firstName="Inserisci il nome.";
  if(!lastName) errors.lastName="Inserisci il cognome.";
  if(!email) errors.email="Inserisci l'indirizzo email.";
  else if(!emailPattern.test(email)) errors.email="Inserisci un indirizzo email valido.";
  if(data.get("privacy")!=="on") errors.privacy="Devi accettare l'informativa privacy per continuare.";

  return errors;
}

export default function TicketPurchaseForm(){
  const [errors,setErrors]=useState<FormErrors>({});
  const [notice,setNotice]=useState(false);

  function handleSubmit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const form=event.currentTarget;
    const nextErrors=validate(form);
    setErrors(nextErrors);
    setNotice(false);

    if(Object.keys(nextErrors).length){
      const firstInvalid=form.elements.namedItem(Object.keys(nextErrors)[0]);
      if(firstInvalid instanceof HTMLElement) firstInvalid.focus();
      return;
    }

    setNotice(true);
  }

  function clearError(name:FieldName){
    if(errors[name]) setErrors(current=>({...current,[name]:undefined}));
  }

  return <form className="ticketing-purchase-form" noValidate onSubmit={handleSubmit}>
    <div className="ticketing-form-grid">
      <label className="ticketing-field">
        <span>Nome *</span>
        <input name="firstName" autoComplete="given-name" maxLength={80} required aria-invalid={Boolean(errors.firstName)} aria-describedby={errors.firstName?"ticket-first-name-error":undefined} onChange={()=>clearError("firstName")}/>
        {errors.firstName&&<small id="ticket-first-name-error">{errors.firstName}</small>}
      </label>
      <label className="ticketing-field">
        <span>Cognome *</span>
        <input name="lastName" autoComplete="family-name" maxLength={80} required aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName?"ticket-last-name-error":undefined} onChange={()=>clearError("lastName")}/>
        {errors.lastName&&<small id="ticket-last-name-error">{errors.lastName}</small>}
      </label>
      <label className="ticketing-field ticketing-field-full">
        <span>Email *</span>
        <input name="email" type="email" inputMode="email" autoComplete="email" maxLength={160} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email?"ticket-email-error":undefined} onChange={()=>clearError("email")}/>
        {errors.email&&<small id="ticket-email-error">{errors.email}</small>}
      </label>
      <label className="ticketing-field">
        <span>Telefono</span>
        <input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40}/>
      </label>
      <label className="ticketing-field">
        <span>Azienda</span>
        <input name="company" autoComplete="organization" maxLength={140}/>
      </label>
    </div>

    <div className="ticketing-privacy">
      <label>
        <input name="privacy" type="checkbox" required aria-invalid={Boolean(errors.privacy)} aria-describedby={errors.privacy?"ticket-privacy-error":undefined} onChange={()=>clearError("privacy")}/>
        <span>Dichiaro di aver letto la <Link href="/privacy-policy">Privacy Policy</Link> e acconsento al trattamento dei dati necessario alla gestione dell'acquisto.</span>
      </label>
      {errors.privacy&&<small id="ticket-privacy-error">{errors.privacy}</small>}
    </div>

    <button className="btn btn-blue ticketing-submit" type="submit">Continua al pagamento</button>
    <p className="ticketing-form-note">In questo blocco non viene effettuato alcun pagamento e i dati non vengono salvati.</p>
    {notice&&<div className="ticketing-notice" role="status">Il pagamento online non è ancora attivo. Il collegamento sicuro a PayPal sarà introdotto nel Blocco 2.</div>}
  </form>;
}
