"use client";

import Link from "next/link";
import {FormEvent,useEffect,useRef,useState} from "react";

type FieldName="firstName"|"lastName"|"email"|"privacy";
type FormErrors=Partial<Record<FieldName,string>>;
type PurchaseData={firstName:string;lastName:string;email:string;phone:string;company:string;privacyAccepted:true};
type PayPalButtons={render:(element:HTMLElement)=>Promise<void>;close:()=>Promise<void>};
type PayPalNamespace={Buttons:(options:{style:Record<string,unknown>;createOrder:()=>Promise<string>;onApprove:(data:{orderID:string})=>Promise<void>;onCancel:()=>void;onError:(error:unknown)=>void})=>PayPalButtons};
declare global{interface Window{paypal?:PayPalNamespace}}

const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function readAndValidate(form:HTMLFormElement){
  const data=new FormData(form);const errors:FormErrors={};const firstName=String(data.get("firstName")??"").trim();const lastName=String(data.get("lastName")??"").trim();const email=String(data.get("email")??"").trim();
  if(!firstName)errors.firstName="Inserisci il nome.";if(!lastName)errors.lastName="Inserisci il cognome.";if(!email)errors.email="Inserisci l'indirizzo email.";else if(!emailPattern.test(email))errors.email="Inserisci un indirizzo email valido.";if(data.get("privacy")!=="on")errors.privacy="Devi accettare l'informativa privacy per continuare.";
  return {errors,payload:{firstName,lastName,email,phone:String(data.get("phone")??"").trim(),company:String(data.get("company")??"").trim(),privacyAccepted:true as const}};
}

export default function TicketPurchaseForm({accessToken,paypalClientId}:{accessToken:string;paypalClientId:string}){
  const [errors,setErrors]=useState<FormErrors>({});const [payload,setPayload]=useState<PurchaseData|null>(null);const [status,setStatus]=useState<"idle"|"loading"|"ready"|"processing"|"cancelled"|"error">("idle");const [message,setMessage]=useState("");const host=useRef<HTMLDivElement>(null);const requestId=useRef("");
  useEffect(()=>{
    if(!payload||!paypalClientId||!host.current)return;let active=true;let buttons:PayPalButtons|undefined;
    const start=async()=>{setStatus("loading");if(!window.paypal)await new Promise<void>((resolve,reject)=>{const existing=document.querySelector<HTMLScriptElement>("script[data-nis-paypal]");if(existing){existing.addEventListener("load",()=>resolve(),{once:true});existing.addEventListener("error",()=>reject(),{once:true});return;}const script=document.createElement("script");script.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(paypalClientId)}&currency=EUR&intent=capture&components=buttons`;script.async=true;script.dataset.nisPaypal="true";script.onload=()=>resolve();script.onerror=()=>reject();document.head.appendChild(script);});if(!active||!window.paypal||!host.current)return;host.current.replaceChildren();buttons=window.paypal.Buttons({style:{layout:"vertical",shape:"rect",label:"pay",height:48},createOrder:async()=>{setStatus("processing");if(!requestId.current)requestId.current=crypto.randomUUID();const response=await fetch("/api/ticketing/paypal/create-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...payload,accessToken,requestId:requestId.current})});const body=await response.json() as {orderId?:string;message?:string};if(!response.ok||!body.orderId)throw new Error(body.message||"Ordine non creato.");return body.orderId;},onApprove:async data=>{setStatus("processing");const response=await fetch("/api/ticketing/paypal/capture-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderId:data.orderID})});const body=await response.json() as {redirectPath?:string;message?:string};if(!response.ok||!body.redirectPath)throw new Error(body.message||"Pagamento non confermato.");window.location.assign(body.redirectPath);},onCancel:()=>{setStatus("cancelled");setMessage("Pagamento annullato. Nessun biglietto è stato emesso.");},onError:error=>{console.error("PayPal checkout error",error);setStatus("error");setMessage("Non è stato possibile completare il pagamento. Riprova senza chiudere questa pagina.");}});await buttons.render(host.current);if(active)setStatus("ready");};start().catch(()=>{if(active){setStatus("error");setMessage("PayPal Sandbox non è disponibile. Riprova più tardi.");}});return()=>{active=false;void buttons?.close();};
  },[accessToken,paypalClientId,payload]);
  function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();const result=readAndValidate(event.currentTarget);setErrors(result.errors);setMessage("");if(Object.keys(result.errors).length){const first=event.currentTarget.elements.namedItem(Object.keys(result.errors)[0]);if(first instanceof HTMLElement)first.focus();return;}requestId.current=crypto.randomUUID();setPayload(result.payload);}
  const clear=(name:FieldName)=>errors[name]&&setErrors(current=>({...current,[name]:undefined}));
  return <form className="ticketing-purchase-form" noValidate onSubmit={submit}><div className="ticketing-form-grid">
    <label className="ticketing-field"><span>Nome *</span><input name="firstName" autoComplete="given-name" maxLength={80} required aria-invalid={Boolean(errors.firstName)} onChange={()=>clear("firstName")}/>{errors.firstName&&<small>{errors.firstName}</small>}</label>
    <label className="ticketing-field"><span>Cognome *</span><input name="lastName" autoComplete="family-name" maxLength={80} required aria-invalid={Boolean(errors.lastName)} onChange={()=>clear("lastName")}/>{errors.lastName&&<small>{errors.lastName}</small>}</label>
    <label className="ticketing-field ticketing-field-full"><span>Email *</span><input name="email" type="email" inputMode="email" autoComplete="email" maxLength={160} required aria-invalid={Boolean(errors.email)} onChange={()=>clear("email")}/>{errors.email&&<small>{errors.email}</small>}</label>
    <label className="ticketing-field"><span>Telefono</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40}/></label><label className="ticketing-field"><span>Azienda</span><input name="company" autoComplete="organization" maxLength={140}/></label></div>
    <div className="ticketing-privacy"><label><input name="privacy" type="checkbox" required aria-invalid={Boolean(errors.privacy)} onChange={()=>clear("privacy")}/><span>Dichiaro di aver letto la <Link href="/privacy-policy">Privacy Policy</Link> e acconsento al trattamento dei dati necessario alla gestione dell'acquisto.</span></label>{errors.privacy&&<small>{errors.privacy}</small>}</div>
    {!payload&&<button className="btn btn-blue ticketing-submit" type="submit">Continua al pagamento</button>}{payload&&!paypalClientId&&<div className="ticketing-notice" role="alert">PayPal Sandbox non è configurato sul server.</div>}{payload&&paypalClientId&&<><div ref={host} className="ticketing-paypal-buttons" aria-label="Pagamento PayPal Sandbox"/>{(status==="loading"||status==="processing")&&<p className="ticketing-form-note" role="status">{status==="loading"?"Caricamento PayPal Sandbox...":"Conferma del pagamento in corso..."}</p>}</>}{message&&<div className="ticketing-notice" role="alert">{message}</div>}
  </form>;
}
