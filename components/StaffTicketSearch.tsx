"use client";

import {FormEvent,useState} from "react";
import {allocationTypeLabel} from "@/lib/ticketing/presentation";
import {formatPersonFullName} from "@/lib/ticketing/name-format";
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

  async function checkIn(ticket:StaffTicketSearchResult){
    const holder=ticket.source==="PARTNER"?`${ticket.companyName} - Ingresso ${ticket.sequenceNumber??1} di ${ticket.totalQuantity??1}`:formatPersonFullName(ticket.firstName,ticket.lastName);
    if(!window.confirm(`Confermi l'ingresso di ${holder}?`))return;
    const ticketCode=ticket.ticketCode;setCheckingCode(ticketCode);setMessage("");
    try{
      const inspection=await fetch("/api/ticketing/checkin/manual",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ticketCode})});
      if(inspection.status===401){window.location.assign("/checkin");return;}if(!inspection.ok)throw new Error();const preview=await inspection.json() as StaffCheckInResponse;
      if(preview.status!=="VALID"){setMessage(preview.status==="ALREADY_USED"?`Biglietto già utilizzato da ${holder}.`:preview.status==="NOT_OPEN"?"Check-in non ancora aperto.":preview.status==="CLOSED"?"Check-in chiuso.":"Il biglietto non è valido.");return;}
      const response=await fetch("/api/ticketing/checkin/manual",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({ticketCode})});if(!response.ok)throw new Error();const result=await response.json() as StaffCheckInResponse;
      if(result.status==="AUTHORIZED")setResults(current=>current.map(item=>item.ticketCode===ticketCode?{...item,status:"USED",checkedInAt:result.checkedInAt,checkinMethod:result.method,checkedInBy:result.operatorName}:item));
      setMessage(result.status==="AUTHORIZED"?`Ingresso registrato per ${holder}.`:`Biglietto già utilizzato da ${holder}.`);
    }catch{setMessage("Non è stato possibile registrare l'ingresso.");}finally{setCheckingCode(null);}
  }

  return <div className="staff-search">
    <form onSubmit={search} role="search"><label htmlFor="staff-ticket-query">Nome, cognome o codice ticket</label><div><input id="staff-ticket-query" name="query" type="search" minLength={2} maxLength={100} autoComplete="off" placeholder="Es. Rossi o NIS26-..." required/><button type="submit" disabled={loading}>{loading?"RICERCA...":"CERCA"}</button></div></form>
    {message&&<p className="staff-feedback" role="status">{message}</p>}
    <div className="staff-search-results">
      {results.map(ticket=><article key={ticket.ticketCode}><div><span className={`staff-ticket-state ${ticket.status==="VALID"?"is-valid":"is-used"}`}>{ticket.status==="VALID"?"VALIDO":"GIÀ UTILIZZATO"}</span><h2>{ticket.source==="PARTNER"?ticket.companyName:formatPersonFullName(ticket.firstName,ticket.lastName)}</h2><p>{ticket.ticketCode} · {ticket.source==="PARTNER"?`INVITO ${allocationTypeLabel(ticket.allocationType??"AZIENDA").toUpperCase()} · Ingresso ${ticket.sequenceNumber??1} di ${ticket.totalQuantity??1}`:ticket.category}</p>{ticket.checkedInAt&&<time dateTime={ticket.checkedInAt}>Ingresso: {formatDateTime(ticket.checkedInAt)}{ticket.checkinMethod?` · ${ticket.checkinMethod}`:""}{ticket.checkedInBy?` · ${ticket.checkedInBy}`:""}</time>}</div>{ticket.status==="VALID"&&<button type="button" onClick={()=>checkIn(ticket)} disabled={checkingCode===ticket.ticketCode}>{checkingCode===ticket.ticketCode?"REGISTRAZIONE...":"REGISTRA INGRESSO"}</button>}</article>)}
    </div>
  </div>;
}
