"use client";

import Link from "next/link";
import {FormEvent,useCallback,useEffect,useMemo,useState} from "react";
import {allocationTypeLabel} from "@/lib/ticketing/presentation";
import type {PartnerAllocationSummary} from "@/lib/ticketing/repository";
import type {AllocationType} from "@/types/ticketing";

type AllocationFilter="ALL"|AllocationType;
const allocationFilters:AllocationFilter[]=["ALL","SPONSOR","DONATORE","AZIENDA","OSPITE"];
const formatAmount=(value:number|null)=>value===null?"Importo non indicato":new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(value/100);

export default function StaffPartnerDashboard(){
  const [allocations,setAllocations]=useState<PartnerAllocationSummary[]>([]);
  const [filter,setFilter]=useState<AllocationFilter>("ALL");
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [sendingAllocationId,setSendingAllocationId]=useState<string|null>(null);
  const [message,setMessage]=useState("");
  const [nominative,setNominative]=useState(true);
  const [quantity,setQuantity]=useState(1);
  const [nominees,setNominees]=useState([{firstName:"",lastName:""}]);
  const visibleAllocations=useMemo(()=>filter==="ALL"?allocations:allocations.filter(item=>item.allocationType===filter),[allocations,filter]);

  const load=useCallback(async(preserveMessage=false)=>{setLoading(true);try{const response=await fetch("/api/ticketing/staff/partner",{cache:"no-store"});if(response.status===401){window.location.assign("/checkin");return;}if(!response.ok)throw new Error();const body=await response.json() as {allocations:PartnerAllocationSummary[]};setAllocations(body.allocations);if(!preserveMessage)setMessage("");}catch{setMessage("Non è stato possibile caricare le assegnazioni aziendali.");}finally{setLoading(false);}},[]);
  useEffect(()=>{void load();},[load]);

  async function create(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setSaving(true);setMessage("");const form=event.currentTarget;const data=new FormData(form);
    try{
      const contactEmail=String(data.get("contactEmail")||"");
      const response=await fetch("/api/ticketing/staff/partner",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({companyName:data.get("companyName"),contactEmail,allocationType:data.get("allocationType"),packageName:data.get("packageName"),partnershipAmount:data.get("partnershipAmount"),allocatedQuantity:quantity,notes:data.get("notes"),nominees:nominative?nominees.map(nominee=>({...nominee,email:contactEmail})):undefined})});
      if(response.status===401){window.location.assign("/checkin");return;}
      const body=await response.json() as {message?:string};if(!response.ok)throw new Error(body.message||"Creazione non riuscita.");form.reset();setQuantity(1);setNominees([{firstName:"",lastName:""}]);setNominative(true);setMessage(body.message||"Assegnazione aziendale creata.");await load(true);
    }catch(error){setMessage(error instanceof Error?error.message:"Non è stato possibile creare l'assegnazione.");}finally{setSaving(false);}
  }

  async function sendInvites(allocation:PartnerAllocationSummary){
    setSendingAllocationId(allocation.id);setMessage("");
    try{
      const response=await fetch(`/api/ticketing/staff/partner/${allocation.id}/resend`,{method:"POST"});
      if(response.status===401){window.location.assign("/checkin");return;}
      const body=await response.json() as {message?:string};
      if(!response.ok)throw new Error(body.message||"Invio non riuscito.");
      setMessage(body.message||"Inviti aziendali inviati.");await load(true);
    }catch(error){setMessage(error instanceof Error?error.message:"Non è stato possibile inviare gli inviti.");}
    finally{setSendingAllocationId(null);}
  }

  return <div className="staff-partner-layout"><section className="staff-partner-form"><h2>Nuova assegnazione aziendale</h2><form onSubmit={create}>
    <label><span>Società *</span><input name="companyName" maxLength={160} required/></label>
    <label><span>Email referente *</span><input name="contactEmail" type="email" maxLength={160} required/></label>
    <label><span>Tipo assegnazione *</span><select name="allocationType" defaultValue="AZIENDA" required><option value="SPONSOR">Sponsor</option><option value="DONATORE">Donatore</option><option value="AZIENDA">Azienda</option><option value="OSPITE">Ospite</option></select></label>
    <label><span>Pacchetto / descrizione</span><input name="packageName" maxLength={120}/></label>
    <div><label><span>Importo partnership</span><input name="partnershipAmount" type="number" inputMode="decimal" min="0" step="0.01"/></label><label><span>Biglietti inclusi *</span><input name="allocatedQuantity" type="number" inputMode="numeric" min="1" max={nominative?100:10000} value={quantity} onChange={event=>{const next=Math.max(1,Math.min(nominative?100:10000,Number(event.target.value)||1));setQuantity(next);setNominees(current=>Array.from({length:next},(_,index)=>current[index]??{firstName:"",lastName:""}));}} required/></label></div>
    <label className="staff-partner-nominative-toggle"><input type="checkbox" checked={nominative} onChange={event=>setNominative(event.target.checked)}/><span>Crea biglietti nominativi</span></label>
    {nominative&&<fieldset className="staff-partner-nominative-list"><legend>Intestatari dei biglietti</legend>{nominees.map((nominee,index)=><div key={index} className="staff-partner-nominative-row"><strong>Ingresso {index+1}</strong><label><span>Nome *</span><input value={nominee.firstName} maxLength={80} onChange={event=>setNominees(current=>current.map((item,itemIndex)=>itemIndex===index?{...item,firstName:event.target.value}:item))} required/></label><label><span>Cognome *</span><input value={nominee.lastName} maxLength={80} onChange={event=>setNominees(current=>current.map((item,itemIndex)=>itemIndex===index?{...item,lastName:event.target.value}:item))} required/></label></div>)}</fieldset>}
    <label><span>Note</span><textarea name="notes" maxLength={2000} rows={4}/></label>
    <button type="submit" disabled={saving}>{saving?"CREAZIONE TICKET...":"CREA ASSEGNAZIONE E TICKET"}</button>
  </form></section>{message&&<p className="staff-feedback" role="status">{message}</p>}
  <div className="staff-allocation-filters" aria-label="Filtra per tipo assegnazione">{allocationFilters.map(value=><button key={value} type="button" className={filter===value?"is-active":""} aria-pressed={filter===value} onClick={()=>setFilter(value)}>{value==="ALL"?"Tutti":allocationTypeLabel(value)}</button>)}</div>
  <section className="staff-partner-list" aria-label="Assegnazioni aziendali">{loading?<p className="staff-empty">Aggiornamento assegnazioni...</p>:visibleAllocations.length===0?<p className="staff-empty">Nessuna assegnazione presente per questo filtro.</p>:visibleAllocations.map(allocation=><article key={allocation.id} className={allocation.status==="CANCELLED"?"is-cancelled":""}><div><span>{allocation.status==="ACTIVE"?"ATTIVO":"ANNULLATO"}</span><h2>{allocation.companyName}</h2><p><strong>Tipo:</strong> {allocationTypeLabel(allocation.allocationType)}</p><p>{allocation.contactEmail||"Email referente non disponibile"}</p><p>{allocation.packageName||"Nessuna descrizione"} · {formatAmount(allocation.partnershipAmountCents)}</p></div><dl><div><dt>Assegnati</dt><dd>{allocation.allocatedQuantity}</dd></div><div><dt>Utilizzati</dt><dd>{allocation.usedCount}</dd></div><div><dt>Ancora validi</dt><dd>{allocation.validCount}</dd></div></dl><p className="staff-partner-email-state">Email: {allocation.emailDeliveryStatus==="SENT"?"INVIATA":allocation.emailDeliveryStatus==="FAILED"?"INVIO FALLITO":"DA INVIARE"}</p><div className="staff-partner-list-actions">{allocation.status==="ACTIVE"&&allocation.contactEmail&&allocation.ticketCount>0&&<button type="button" onClick={()=>void sendInvites(allocation)} disabled={sendingAllocationId!==null}>{sendingAllocationId===allocation.id?"INVIO...":allocation.emailDeliveryStatus==="SENT"?"REINVIA INVITI":"INVIA INVITI"}</button>}<Link href={`/staff/partner/${allocation.id}`}>GESTISCI</Link></div></article>)}</section></div>;
}
