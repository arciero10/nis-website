"use client";

import {useCallback,useEffect,useState} from "react";
import type {CharityRequest} from "@/lib/ticketing/charity-request-repository";
import {formatPersonFullName} from "@/lib/ticketing/name-format";

const dateTime=(value:string)=>new Intl.DateTimeFormat("it-IT",{dateStyle:"short",timeStyle:"short",timeZone:"Europe/Rome"}).format(new Date(value));
const money=(value:number)=>new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(value);

export default function StaffCharityRequests(){
  const [requests,setRequests]=useState<CharityRequest[]>([]);
  const [references,setReferences]=useState<Record<string,string>>({});
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState<string|null>(null);
  const [message,setMessage]=useState("");
  const load=useCallback(async()=>{setLoading(true);try{const response=await fetch("/api/ticketing/staff/charity-requests",{cache:"no-store"});if(response.status===401){window.location.assign("/checkin");return;}if(!response.ok)throw new Error();const body=await response.json() as {requests:CharityRequest[]};setRequests(body.requests);}catch{setMessage("Non è stato possibile caricare le richieste Charity.");}finally{setLoading(false);}},[]);
  useEffect(()=>{void load();},[load]);

  async function action(item:CharityRequest,type:"confirm"|"cancel"){
    const paypalReference=references[item.id]?.trim()??"";
    if(type==="confirm"&&paypalReference.length<4){setMessage("Inserisci il riferimento PayPal verificato prima di emettere i ticket.");return;}
    const prompt=type==="confirm"?(item.possibleDuplicate?"Questa richiesta è segnalata come possibile duplicato. Hai verificato identità, donazione e assenza di ticket già emessi?":"Confermi la donazione ed emetti tutti i ticket?"):"Annullare questa richiesta?";
    if(!window.confirm(prompt))return;
    setBusy(item.id);setMessage("");
    try{
      const response=await fetch(`/api/ticketing/staff/charity-requests/${item.id}/${type}`,{method:"POST",headers:type==="confirm"?{"Content-Type":"application/json"}:undefined,body:type==="confirm"?JSON.stringify({paypalReference}):undefined});
      const body=await response.json() as {message?:string};if(!response.ok)throw new Error(body.message||"Operazione non riuscita.");
      setMessage(body.message||"Operazione completata.");setReferences(current=>{const next={...current};delete next[item.id];return next;});await load();
    }catch(cause){setMessage(cause instanceof Error?cause.message:"Operazione non riuscita.");}finally{setBusy(null);}
  }

  return <section className="staff-charity-requests" aria-labelledby="pending-charity-title">
    <header><span>PAYPAL CHARITY</span><h2 id="pending-charity-title">Donazioni da verificare</h2><p>Conferma solo dopo aver verificato la donazione sulla piattaforma PayPal Charity.</p></header>
    {message&&<p className="staff-feedback" role="status">{message}</p>}
    {loading?<p className="staff-empty">Aggiornamento richieste...</p>:requests.length===0?<p className="staff-empty">Nessuna donazione in attesa di verifica.</p>:<div className="staff-charity-request-list">{requests.map(item=><article key={item.id}>
      <div><div className="staff-charity-badges"><span className="staff-source-badge">{item.status==="VERIFIED"?"VERIFICA IN CORSO":"DA VERIFICARE"}</span>{item.possibleDuplicate&&<span className="staff-duplicate-badge">POSSIBILE DUPLICATO</span>}</div><h3>{formatPersonFullName(item.firstName,item.lastName)}</h3><p><strong>Codice:</strong> {item.requestCode}</p><p><strong>Email:</strong> {item.email}</p><p><strong>Telefono:</strong> {item.phone||"—"}</p>{item.possibleDuplicate&&<p className="staff-duplicate-note">{item.duplicateReason||"Verificare i dati prima dell'emissione."}</p>}<div className="staff-charity-participants"><strong>Partecipanti</strong><ol>{item.participants.map(participant=><li key={participant.position}>{formatPersonFullName(participant.firstName,participant.lastName)}</li>)}</ol></div></div>
      <dl><div><dt>Ingressi</dt><dd>{item.quantity}</dd></div><div><dt>Importo atteso</dt><dd>{money(item.expectedAmount)}</dd></div><div><dt>Data richiesta</dt><dd>{dateTime(item.createdAt)}</dd></div></dl>
      <div className="staff-charity-request-actions"><label>Riferimento PayPal verificato *<input value={references[item.id]??""} onChange={event=>setReferences(current=>({...current,[item.id]:event.target.value}))} minLength={4} maxLength={120} autoComplete="off"/></label><button type="button" onClick={()=>action(item,"confirm")} disabled={busy!==null}>CONFERMA DONAZIONE ED EMETTI</button>{item.status==="PENDING_DONATION"&&<button className="is-danger" type="button" onClick={()=>action(item,"cancel")} disabled={busy!==null}>ANNULLA RICHIESTA</button>}</div>
    </article>)}</div>}
  </section>;
}
