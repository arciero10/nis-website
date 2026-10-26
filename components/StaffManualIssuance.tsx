"use client";

import Link from "next/link";
import {FormEvent,useRef,useState} from "react";
import type {CashCollectionStatus,StaffRole} from "@/types/ticketing";

type IssuanceKind="paypal-charity"|"cash"|"bank-transfer"|"admin";
type PaymentMethod="PAYPAL"|"CASH"|"BANK_TRANSFER"|"COMPLIMENTARY";
type Result={message:string;tickets?:{ticketCode:string}[]};

function TicketLinks({tickets}:Pick<Result,"tickets">){return tickets?.length?<ul className="staff-issued-tickets">{tickets.map(ticket=><li key={ticket.ticketCode}><strong>{ticket.ticketCode}</strong><Link href={`/staff/ticket/${ticket.ticketCode}`}>Apri dettaglio</Link></li>)}</ul>:null;}

const routeForMethod:Record<PaymentMethod,IssuanceKind>={PAYPAL:"paypal-charity",CASH:"cash",BANK_TRANSFER:"bank-transfer",COMPLIMENTARY:"admin"};

export default function StaffManualIssuance({role}:{role:StaffRole}){
  const [method,setMethod]=useState<PaymentMethod>("PAYPAL");const [cashStatus,setCashStatus]=useState<CashCollectionStatus>("DA_INCASSARE");const [busy,setBusy]=useState<IssuanceKind|null>(null);const [results,setResults]=useState<Partial<Record<IssuanceKind,Result>>>({});const keys=useRef<Partial<Record<IssuanceKind,string>>>({});
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const kind=routeForMethod[method];const form=event.currentTarget;setBusy(kind);setResults(current=>({...current,[kind]:undefined}));keys.current[kind]??=crypto.randomUUID();
    try{const response=await fetch(`/api/ticketing/staff/manual-issuance/${kind}`,{method:"POST",headers:{"Idempotency-Key":keys.current[kind]!},body:new FormData(form)});const body=await response.json() as {message?:string;tickets?:Result["tickets"]};if(!response.ok)throw new Error(body.message||"Emissione non riuscita.");setResults(current=>({...current,[kind]:{message:body.tickets?.length===1?"Biglietto emesso e invio email avviato.":`${body.tickets?.length??0} biglietti emessi e invio email avviato.`,tickets:body.tickets}}));delete keys.current[kind];form.reset();setCashStatus(role==="SUPERADMIN"?"DA_INCASSARE":"INCASSATO");}catch(error){setResults(current=>({...current,[kind]:{message:error instanceof Error?error.message:"Emissione non riuscita."}}));}finally{setBusy(null);}
  }
  const kind=routeForMethod[method];
  return <section className="staff-manual-grid">
    <article className="staff-manual-card is-wide"><header><span>EMISSIONE NOMINATIVA</span><h2>Emetti biglietto Gala</h2><p>Seleziona la modalità e registra soltanto lo stato amministrativo effettivo.</p></header><form onSubmit={submit}><div className="staff-manual-fields">
      <label className="is-wide">Modalità di pagamento *<select name="paymentMethod" value={method} onChange={event=>{const next=event.target.value as PaymentMethod;setMethod(next);if(next==="CASH")setCashStatus(role==="SUPERADMIN"?"DA_INCASSARE":"INCASSATO");}} required><option value="PAYPAL">PayPal</option><option value="CASH">Contanti</option><option value="BANK_TRANSFER">Bonifico bancario</option>{role==="SUPERADMIN"&&<option value="COMPLIMENTARY">Omaggio / autorizzato</option>}</select></label>
      {method==="COMPLIMENTARY"&&<><label>Tipo invito *<select name="invitationType" required defaultValue=""><option value="" disabled>Seleziona</option><option value="STAMPA">Stampa</option><option value="MEDIA">Media</option><option value="PRESS">Press</option><option value="OMAGGIO_NIS">Omaggio NIS</option><option value="SPONSOR">Sponsor</option></select></label><label>Numero biglietti *<input name="quantity" type="number" min={1} max={10} defaultValue={1} required/></label></>}
      {method!=="COMPLIMENTARY"&&<label>Numero biglietti *<input name="quantity" type="number" min={1} max={10} defaultValue={1} required/></label>}
      <label>Nome *<input name="firstName" required maxLength={80}/></label><label>Cognome *<input name="lastName" required maxLength={80}/></label><label>Email *<input name="email" type="email" required maxLength={254}/></label><label>Telefono<input name="phone" type="tel" maxLength={40}/></label>
      {method!=="COMPLIMENTARY"&&<label>Importo {method==="CASH"&&cashStatus==="DA_INCASSARE"?"previsto":"ricevuto"} *<input name="declaredAmount" type="number" min="0.01" max="1000000" step="0.01" defaultValue="200" required/></label>}
      {method==="PAYPAL"&&<><label>Data donazione<input name="donationDate" type="date"/></label><label className="is-wide">Riferimento PayPal *<input name="paypalReference" required minLength={4} maxLength={120}/></label></>}
      {method==="BANK_TRANSFER"&&<><label>Data bonifico<input name="transferDate" type="date"/></label><label>CRO / TRN<input name="transferReference" maxLength={120}/></label></>}
      {method==="CASH"&&<><label>Referente incaricato dell’incasso *<input name="cashCollector" required maxLength={120} placeholder="es. Mauro"/></label><label>Stato incasso *<select name="cashCollectionStatus" value={cashStatus} onChange={event=>setCashStatus(event.target.value as CashCollectionStatus)} required>{role==="SUPERADMIN"&&<option value="DA_INCASSARE">Da incassare</option>}<option value="INCASSATO">Incassato</option></select></label>{cashStatus==="DA_INCASSARE"&&role==="SUPERADMIN"&&<label className="is-wide staff-manual-confirm"><input name="pendingCashAuthorized" type="checkbox" required/>Autorizzo esplicitamente l’emissione prima dell’incasso. Il pagamento resta DA INCASSARE.</label>}</>}
      {method==="COMPLIMENTARY"&&<><label className="is-wide">Ente / testata / organizzazione<input name="organization" maxLength={180}/></label><label className="is-wide">Motivo / descrizione *<textarea name="reason" required maxLength={300} rows={3}/></label></>}
      <label className="is-wide">Nota amministrativa<textarea name="notes" maxLength={1000} rows={3}/></label>
    </div><button type="submit" disabled={busy!==null}>{busy===kind?"EMISSIONE IN CORSO...":method==="COMPLIMENTARY"?"CREA BIGLIETTO":"EMETTI BIGLIETTO"}</button>{results[kind]&&<div className="staff-form-result" role="status"><p>{results[kind]?.message}</p><TicketLinks tickets={results[kind]?.tickets}/></div>}</form></article>
  </section>;
}
