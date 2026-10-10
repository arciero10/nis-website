"use client";

import {FormEvent,useState} from "react";
import type {StaffCheckInResponse,StaffTicketSearchResult} from "@/lib/ticketing/repository";

const formatDateTime=(value:string)=>new Intl.DateTimeFormat("it-IT",{dateStyle:"short",timeStyle:"medium",timeZone:"Europe/Rome"}).format(new Date(value));

export default function StaffTicketSearch(){
  const [results,setResults]=useState<StaffTicketSearchResult[]>([]);
  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState(false);
  const [checkingCode,setCheckingCode]=useState<string|null>(null);

  async function search(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setMessage("");setLoading(true);
    const query=String(new FormData(event.currentTarget).get("query")??"").trim();
    if(query.length<2){setMessage("Inserisci almeno 2 caratteri.");setLoading(false);return;}
    try{
      const response=await fetch(`/api/ticketing/staff/tickets?q=${encodeURIComponent(query)}`,{cache:"no-store"});
      if(response.status===401){window.location.assign("/checkin");return;}
      if(!response.ok)throw new Error();
      const body=await response.json() as {results:StaffTicketSearchResult[]};setResults(body.results);if(body.results.length===0)setMessage("Nessun biglietto trovato.");
    }catch{setMessage("Ricerca non disponibile. Riprova tra poco.");}finally{setLoading(false);}
  }

  async function checkIn(ticketCode:string){
    setCheckingCode(ticketCode);setMessage("");
    try{
      const response=await fetch("/api/ticketing/checkin/manual",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ticketCode})});
      if(response.status===401){window.location.assign("/checkin");return;}
      if(!response.ok)throw new Error();
      const result=await response.json() as StaffCheckInResponse;
      if(result.status==="INVALID"){setMessage("Il biglietto non è valido.");return;}
      setResults(current=>current.map(ticket=>ticket.ticketCode===ticketCode?{...ticket,status:"USED",checkedInAt:result.checkedInAt}:ticket));
      const holder=result.category==="PARTNER"?result.companyName:`${result.firstName} ${result.lastName}`;setMessage(result.status==="AUTHORIZED"?`Ingresso registrato per ${holder}.`:`Biglietto già utilizzato da ${holder}.`);
    }catch{setMessage("Non è stato possibile registrare l'ingresso.");}finally{setCheckingCode(null);}
  }

  return <div className="staff-search">
    <form onSubmit={search} role="search"><label htmlFor="staff-ticket-query">Nome, cognome o codice ticket</label><div><input id="staff-ticket-query" name="query" type="search" minLength={2} maxLength={100} autoComplete="off" placeholder="Es. Rossi o NIS26-..." required/><button type="submit" disabled={loading}>{loading?"RICERCA...":"CERCA"}</button></div></form>
    {message&&<p className="staff-feedback" role="status">{message}</p>}
    <div className="staff-search-results">
      {results.map(ticket=><article key={ticket.ticketCode}><div><span className={`staff-ticket-state ${ticket.status==="VALID"?"is-valid":"is-used"}`}>{ticket.status==="VALID"?"VALIDO":"GIÀ UTILIZZATO"}</span><h2>{ticket.source==="PARTNER"?ticket.companyName:`${ticket.firstName} ${ticket.lastName}`}</h2><p>{ticket.ticketCode} · {ticket.source==="PARTNER"?`INVITO PARTNER · Ingresso ${ticket.sequenceNumber??1} di ${ticket.totalQuantity??1}`:ticket.category}</p>{ticket.checkedInAt&&<time dateTime={ticket.checkedInAt}>Ingresso: {formatDateTime(ticket.checkedInAt)}</time>}</div>{ticket.status==="VALID"&&<button type="button" onClick={()=>checkIn(ticket.ticketCode)} disabled={checkingCode===ticket.ticketCode}>{checkingCode===ticket.ticketCode?"REGISTRAZIONE...":"REGISTRA INGRESSO"}</button>}</article>)}
    </div>
  </div>;
}
