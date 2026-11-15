"use client";

import Image from "next/image";
import {FormEvent,useEffect,useState} from "react";
import {useRouter} from "next/navigation";
import Icon from "@/components/Icon";

export default function AdminAccess(){
  const router=useRouter();
  const [checking,setChecking]=useState(true);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");

  useEffect(()=>{
    fetch("/api/ticketing/checkin/session",{cache:"no-store"})
      .then(response=>response.json())
      .then((body:{authenticated?:boolean})=>{if(body.authenticated)router.replace("/admin/dashboard");else setChecking(false);})
      .catch(()=>{setMessage("Impossibile verificare la sessione.");setChecking(false);});
  },[router]);

  async function login(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setBusy(true);setMessage("");
    const form=event.currentTarget;
    const pin=String(new FormData(form).get("pin")??"");
    try{
      const response=await fetch("/api/ticketing/checkin/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin})});
      if(!response.ok){setMessage(response.status===401?"Codice non valido.":"Accesso non disponibile.");return;}
      form.reset();router.replace("/admin/dashboard");router.refresh();
    }catch{setMessage("Accesso non disponibile. Riprova.");}
    finally{setBusy(false);}
  }

  if(checking)return <div className="management-login-loading" role="status"><span/>Verifica sessione...</div>;
  return <section className="management-login-card">
    <div className="management-login-brand"><Image src="/logo/nis-logo-square.png" width={112} height={112} alt="Nazionale Italiana Sanitari" priority/><span>NAZIONALE ITALIANA SANITARI</span><h1 aria-label="NIS Management">NIS<br/>Management</h1><p>Il punto operativo per eventi, partecipanti, ingressi e attività solidali NIS.</p></div>
    <div className="management-login-form"><div className="management-login-lock"><Icon name="shield" size={22}/></div><span>AREA RISERVATA</span><h2>Accedi al gestionale</h2><p>Usa il codice assegnato al tuo profilo. Vedrai esclusivamente le funzioni autorizzate.</p>
      <form onSubmit={login}>
        <label htmlFor="management-code">Codice di accesso</label>
        <input id="management-code" name="pin" type="password" inputMode="numeric" autoComplete="current-password" maxLength={128} placeholder="Inserisci il codice" required/>
        <button type="submit" disabled={busy}>{busy?"ACCESSO IN CORSO...":"ACCEDI A NIS MANAGEMENT"}</button>
      </form>
      {message&&<div className="checkin-login-error" role="alert">{message}</div>}
      <small>Sessione protetta e accesso basato sul ruolo.</small>
    </div>
  </section>;
}
