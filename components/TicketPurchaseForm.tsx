"use client";

import Link from "next/link";
import {FormEvent,useEffect,useRef,useState} from "react";

type FormErrors=Record<string,string>;
type ParticipantData={firstName:string;lastName:string;email:string;phone:string;company:string};
type PurchaseData={quantity:number;total:number;participants:ParticipantData[];privacyAccepted:true};
type PayPalButtons={render:(element:HTMLElement)=>Promise<void>;close:()=>Promise<void>};
type PayPalNamespace={Buttons:(options:{style:Record<string,unknown>;createOrder:()=>Promise<string>;onApprove:(data:{orderID:string})=>Promise<void>;onCancel:()=>void;onError:(error:unknown)=>void})=>PayPalButtons};
type InvitationProps={accessToken:string;invitationAlias?:never}|{accessToken?:never;invitationAlias:string};
declare global{interface Window{paypal?:PayPalNamespace}}

const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const formatPrice=(value:number)=>new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(value);

function readAndValidate(form:HTMLFormElement,quantity:number,unitPrice:number){
  const data=new FormData(form);const errors:FormErrors={};const participants:ParticipantData[]=[];
  for(let index=0;index<quantity;index++){
    const firstName=String(data.get(`firstName-${index}`)??"").trim();const lastName=String(data.get(`lastName-${index}`)??"").trim();const email=String(data.get(`email-${index}`)??"").trim();
    if(!firstName)errors[`firstName-${index}`]="Inserisci il nome.";if(!lastName)errors[`lastName-${index}`]="Inserisci il cognome.";if(!email)errors[`email-${index}`]="Inserisci l'indirizzo email.";else if(!emailPattern.test(email))errors[`email-${index}`]="Inserisci un indirizzo email valido.";
    participants.push({firstName,lastName,email,phone:String(data.get(`phone-${index}`)??"").trim(),company:String(data.get(`company-${index}`)??"").trim()});
  }
  if(data.get("privacy")!=="on")errors.privacy="Devi accettare l'informativa privacy per continuare.";
  return {errors,payload:{quantity,total:quantity*unitPrice,participants,privacyAccepted:true as const}};
}

export default function TicketPurchaseForm({accessToken,invitationAlias,paypalClientId,unitPrice,maxQuantity}:InvitationProps&{paypalClientId:string;unitPrice:number;maxQuantity:number}){
  const [quantity,setQuantity]=useState(1);const [errors,setErrors]=useState<FormErrors>({});const [payload,setPayload]=useState<PurchaseData|null>(null);const [status,setStatus]=useState<"idle"|"loading"|"ready"|"processing"|"cancelled"|"error">("idle");const [message,setMessage]=useState("");const host=useRef<HTMLDivElement>(null);const requestId=useRef("");
  useEffect(()=>{
    if(!payload||!paypalClientId||!host.current)return;let active=true;let buttons:PayPalButtons|undefined;
    const start=async()=>{setStatus("loading");if(!window.paypal)await new Promise<void>((resolve,reject)=>{const existing=document.querySelector<HTMLScriptElement>("script[data-nis-paypal]");if(existing){if(window.paypal){resolve();return;}existing.addEventListener("load",()=>resolve(),{once:true});existing.addEventListener("error",()=>reject(),{once:true});return;}const script=document.createElement("script");script.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(paypalClientId)}&currency=EUR&intent=capture&components=buttons`;script.async=true;script.dataset.nisPaypal="true";script.onload=()=>resolve();script.onerror=()=>reject();document.head.appendChild(script);});if(!active||!window.paypal||!host.current)return;host.current.replaceChildren();buttons=window.paypal.Buttons({style:{layout:"vertical",shape:"rect",label:"pay",height:48},createOrder:async()=>{setStatus("processing");if(!requestId.current)requestId.current=crypto.randomUUID();const invitationCredential=accessToken?{accessToken}:{invitationAlias};const response=await fetch("/api/ticketing/paypal/create-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...payload,...invitationCredential,requestId:requestId.current})});const body=await response.json() as {orderId?:string;message?:string};if(!response.ok||!body.orderId)throw new Error(body.message||"Ordine non creato.");return body.orderId;},onApprove:async data=>{setStatus("processing");const response=await fetch("/api/ticketing/paypal/capture-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderId:data.orderID})});const body=await response.json() as {redirectPath?:string;message?:string};if(!response.ok||!body.redirectPath)throw new Error(body.message||"Pagamento non confermato.");window.location.assign(body.redirectPath);},onCancel:()=>{setStatus("cancelled");setMessage("Pagamento annullato. Nessun biglietto è stato emesso.");},onError:error=>{console.error("PayPal checkout error",error);setStatus("error");setMessage(error instanceof Error?error.message:"Non è stato possibile completare il pagamento. Riprova senza chiudere questa pagina.");}});await buttons.render(host.current);if(active)setStatus("ready");};start().catch(()=>{if(active){setStatus("error");setMessage("PayPal Sandbox non è disponibile. Riprova più tardi.");}});return()=>{active=false;void buttons?.close();};
  },[accessToken,invitationAlias,paypalClientId,payload]);

  function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();const result=readAndValidate(event.currentTarget,quantity,unitPrice);setErrors(result.errors);setMessage("");if(Object.keys(result.errors).length){const first=event.currentTarget.elements.namedItem(Object.keys(result.errors)[0]);if(first instanceof HTMLElement)first.focus();return;}requestId.current=crypto.randomUUID();setPayload(result.payload);}
  const clear=(name:string)=>errors[name]&&setErrors(current=>{const next={...current};delete next[name];return next;});const locked=payload!==null;

  return <form className="ticketing-purchase-form" noValidate onSubmit={submit}>
    <div className="ticketing-quantity-row"><label htmlFor="ticket-quantity">Numero di ingressi</label><select id="ticket-quantity" value={quantity} disabled={locked} onChange={event=>{setQuantity(Number(event.target.value));setErrors({});}}>{Array.from({length:maxQuantity},(_,index)=><option key={index+1} value={index+1}>{index+1}</option>)}</select><div><span>{formatPrice(unitPrice)} ciascuno</span><strong>Totale: {formatPrice(quantity*unitPrice)}</strong></div></div>
    <div className="ticketing-participants">{Array.from({length:quantity},(_,index)=><fieldset className="ticketing-participant" key={index}><legend>Partecipante {index+1}</legend><div className="ticketing-form-grid">
      <label className="ticketing-field"><span>Nome *</span><input name={`firstName-${index}`} autoComplete={index===0?"given-name":"off"} maxLength={80} required disabled={locked} aria-invalid={Boolean(errors[`firstName-${index}`])} onChange={()=>clear(`firstName-${index}`)}/>{errors[`firstName-${index}`]&&<small>{errors[`firstName-${index}`]}</small>}</label>
      <label className="ticketing-field"><span>Cognome *</span><input name={`lastName-${index}`} autoComplete={index===0?"family-name":"off"} maxLength={80} required disabled={locked} aria-invalid={Boolean(errors[`lastName-${index}`])} onChange={()=>clear(`lastName-${index}`)}/>{errors[`lastName-${index}`]&&<small>{errors[`lastName-${index}`]}</small>}</label>
      <label className="ticketing-field ticketing-field-full"><span>Email *</span><input name={`email-${index}`} type="email" inputMode="email" autoComplete={index===0?"email":"off"} maxLength={160} required disabled={locked} aria-invalid={Boolean(errors[`email-${index}`])} onChange={()=>clear(`email-${index}`)}/>{errors[`email-${index}`]&&<small>{errors[`email-${index}`]}</small>}</label>
      <label className="ticketing-field"><span>Telefono</span><input name={`phone-${index}`} type="tel" inputMode="tel" autoComplete={index===0?"tel":"off"} maxLength={40} disabled={locked}/></label><label className="ticketing-field"><span>Azienda</span><input name={`company-${index}`} autoComplete={index===0?"organization":"off"} maxLength={140} disabled={locked}/></label>
    </div></fieldset>)}</div>
    <div className="ticketing-privacy"><label><input name="privacy" type="checkbox" required disabled={locked} aria-invalid={Boolean(errors.privacy)} onChange={()=>clear("privacy")}/><span>Dichiaro di aver letto la <Link href="/privacy-policy">Privacy Policy</Link> e acconsento al trattamento dei dati necessario alla gestione dell'acquisto.</span></label>{errors.privacy&&<small>{errors.privacy}</small>}</div>
    {!payload&&<button className="btn btn-blue ticketing-submit" type="submit">Continua al pagamento</button>}{payload&&!paypalClientId&&<div className="ticketing-notice" role="alert">PayPal Sandbox non è configurato sul server.</div>}{payload&&paypalClientId&&<><div ref={host} className="ticketing-paypal-buttons" aria-label="Pagamento PayPal Sandbox"/>{(status==="loading"||status==="processing")&&<p className="ticketing-form-note" role="status">{status==="loading"?"Caricamento PayPal Sandbox...":"Conferma del pagamento in corso..."}</p>}</>}{message&&<div className="ticketing-notice" role="alert">{message}</div>}
  </form>;
}
