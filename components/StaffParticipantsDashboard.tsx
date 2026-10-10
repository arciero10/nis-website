"use client";

import {useCallback,useEffect,useState} from "react";
import type {StaffCheckInResponse,StaffParticipantsDashboard as Dashboard} from "@/lib/ticketing/repository";

type Filter="ALL"|"PENDING"|"ENTERED";
type SourceFilter="ALL"|"STANDARD"|"PARTNER";
const formatTime=(value:string)=>new Intl.DateTimeFormat("it-IT",{hour:"2-digit",minute:"2-digit",second:"2-digit",timeZone:"Europe/Rome"}).format(new Date(value));
const emptyDashboard:Dashboard={capacity:null,participants:0,entered:0,pending:0,available:null,standardTickets:0,partnerReserved:0,partnerIssued:0,partnerUnassigned:0,results:[]};

export default function StaffParticipantsDashboard(){
  const [dashboard,setDashboard]=useState<Dashboard>(emptyDashboard);const [filter,setFilter]=useState<Filter>("ALL");const [sourceFilter,setSourceFilter]=useState<SourceFilter>("ALL");const [query,setQuery]=useState("");const [loading,setLoading]=useState(true);const [message,setMessage]=useState("");const [checkingCode,setCheckingCode]=useState<string|null>(null);const [resendingCode,setResendingCode]=useState<string|null>(null);

  const load=useCallback(async(silent=false)=>{
    if(!silent)setLoading(true);
    try{const response=await fetch(`/api/ticketing/staff/participants?filter=${filter}&source=${sourceFilter}&q=${encodeURIComponent(query.trim())}`,{cache:"no-store"});if(response.status===401){window.location.assign("/checkin");return;}if(!response.ok)throw new Error();setDashboard(await response.json() as Dashboard);if(!silent)setMessage("");}
    catch{if(!silent)setMessage("Non è stato possibile aggiornare l'elenco partecipanti.");}
    finally{if(!silent)setLoading(false);}
  },[filter,sourceFilter,query]);

  useEffect(()=>{const initial=window.setTimeout(()=>void load(),250);const polling=window.setInterval(()=>void load(true),7000);return()=>{window.clearTimeout(initial);window.clearInterval(polling);};},[load]);

  async function checkIn(ticketCode:string){
    setCheckingCode(ticketCode);setMessage("");
    try{const response=await fetch("/api/ticketing/checkin/manual",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ticketCode})});if(response.status===401){window.location.assign("/checkin");return;}if(!response.ok)throw new Error();const result=await response.json() as StaffCheckInResponse;if(result.status==="INVALID"){setMessage("Il biglietto non è valido.");return;}if(result.status==="AUTHORIZED")setDashboard(current=>({...current,entered:current.entered+1,pending:Math.max(0,current.pending-1),results:filter==="PENDING"?current.results.filter(item=>item.ticketCode!==ticketCode):current.results.map(item=>item.ticketCode===ticketCode?{...item,status:"ENTERED",checkedInAt:result.checkedInAt}:item)}));const holder=result.category==="PARTNER"?result.companyName:`${result.firstName} ${result.lastName}`;setMessage(result.status==="AUTHORIZED"?`Ingresso registrato per ${holder}.`:`${holder} risulta già entrato.`);await load(true);}
    catch{setMessage("Non è stato possibile registrare l'ingresso.");}finally{setCheckingCode(null);}
  }

  async function resend(ticketCode:string){
    setResendingCode(ticketCode);setMessage("");
    try{const response=await fetch("/api/ticketing/staff/resend-ticket",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ticketCode})});if(response.status===401){window.location.assign("/checkin");return;}const body=await response.json() as {message?:string};if(!response.ok)throw new Error(body.message||"Reinvio non riuscito.");setMessage(body.message||"Biglietto inviato nuovamente.");}
    catch(error){setMessage(error instanceof Error?error.message:"Non è stato possibile reinviare il biglietto.");}finally{setResendingCode(null);}
  }

  const filters:[Filter,string,number][]=[["ALL","Tutti",dashboard.participants],["PENDING","Da arrivare",dashboard.pending],["ENTERED","Entrati",dashboard.entered]];
  return <>
    <section className="staff-dashboard-metrics staff-dashboard-metrics-extended" aria-label="Riepilogo partecipanti"><article><span>Capienza</span><strong>{dashboard.capacity??"—"}</strong></article><article><span>Partecipanti</span><strong>{dashboard.participants}</strong></article><article><span>Entrati</span><strong>{dashboard.entered}</strong></article><article><span>Da arrivare</span><strong>{dashboard.pending}</strong></article><article><span>Posti disponibili</span><strong>{dashboard.available??"—"}</strong></article><article><span>Ticket standard</span><strong>{dashboard.standardTickets}</strong></article><article><span>Posti partner riservati</span><strong>{dashboard.partnerReserved}</strong></article><article><span>Ticket partner emessi</span><strong>{dashboard.partnerIssued}</strong></article><article><span>Partner da nominare</span><strong>{dashboard.partnerUnassigned}</strong></article></section>
    <section className="staff-participant-controls"><label htmlFor="participant-search">Cerca partecipante</label><input id="participant-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} maxLength={100} autoComplete="off" placeholder="Nome, cognome, email o codice ticket"/><div className="staff-filter-bar" aria-label="Filtra partecipanti">{filters.map(([value,label,count])=><button key={value} type="button" className={filter===value?"is-active":""} aria-pressed={filter===value} onClick={()=>setFilter(value)}>{label} <span>{count}</span></button>)}</div><div className="staff-source-filters" aria-label="Filtra origine biglietto">{([["ALL","Tutti"],["STANDARD","Standard"],["PARTNER","Partner"]] as [SourceFilter,string][]).map(([value,label])=><button key={value} type="button" className={sourceFilter===value?"is-active":""} aria-pressed={sourceFilter===value} onClick={()=>setSourceFilter(value)}>{label}</button>)}</div></section>
    {message&&<p className="staff-feedback" role="status">{message}</p>}
    <section className="staff-participant-list" aria-label="Elenco partecipanti">{loading?<p className="staff-empty">Aggiornamento partecipanti...</p>:dashboard.results.length===0?<p className="staff-empty">Nessun partecipante trovato.</p>:dashboard.results.map(person=><article key={person.ticketCode} className={person.status==="ENTERED"?"is-entered":"is-pending"}><div className="staff-participant-main"><span className={`staff-ticket-state ${person.status==="ENTERED"?"is-entered":"is-valid"}`}>{person.status==="ENTERED"?"ENTRATO":"DA ARRIVARE"}</span><h2>{person.source==="PARTNER"?person.companyName:`${person.firstName} ${person.lastName}`}</h2><p>{person.source==="PARTNER"?`Partner - Ingresso ${person.sequenceNumber??1} di ${person.totalQuantity??1}`:person.category} · {person.ticketCode}</p>{person.checkedInAt&&<time dateTime={person.checkedInAt}>Entrato alle {formatTime(person.checkedInAt)}</time>}</div><div className="staff-participant-actions">{person.status==="PENDING"&&<button type="button" onClick={()=>checkIn(person.ticketCode)} disabled={checkingCode===person.ticketCode}>{checkingCode===person.ticketCode?"REGISTRAZIONE...":"REGISTRA INGRESSO"}</button>}{person.source!=="PARTNER"&&<button className="is-secondary" type="button" onClick={()=>resend(person.ticketCode)} disabled={resendingCode===person.ticketCode}>{resendingCode===person.ticketCode?"INVIO...":"REINVIA BIGLIETTO"}</button>}</div></article>)}</section>
  </>;
}
