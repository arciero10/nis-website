"use client";

import {FormEvent,useState} from "react";

type CheckInState="idle"|"checking"|"unavailable"|"error";

export default function CheckInPanel(){
  const [state,setState]=useState<CheckInState>("idle");
  const [message,setMessage]=useState("In attesa di un codice ticket.");

  async function handleSubmit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const form=event.currentTarget;
    const data=new FormData(form);
    const credential=String(data.get("credential")??"").trim();

    if(!credential){
      setState("error");
      setMessage("Inserisci un codice ticket.");
      return;
    }

    setState("checking");
    setMessage("Verifica ticket in corso...");

    try{
      const response=await fetch("/api/ticketing/check-in",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({credential}),
      });
      const result=await response.json() as {message?:string};
      setState(response.ok?"idle":"unavailable");
      setMessage(result.message??"Il servizio di verifica non è ancora disponibile.");
    }catch{
      setState("error");
      setMessage("Non è stato possibile contattare il servizio di verifica.");
    }
  }

  return <div className="checkin-console">
    <form onSubmit={handleSubmit} className="checkin-code-form">
      <label htmlFor="ticket-credential">Codice ticket</label>
      <div>
        <input id="ticket-credential" name="credential" autoComplete="off" maxLength={160} placeholder="NIS26-XXXXXXXX" onChange={()=>{if(state!=="idle"){setState("idle");setMessage("In attesa di un codice ticket.");}}}/>
        <button className="btn btn-blue" type="submit" disabled={state==="checking"}>{state==="checking"?"VERIFICA...":"VERIFICA"}</button>
      </div>
    </form>

    <section className="checkin-scanner-placeholder" aria-labelledby="scanner-title">
      <div className="checkin-scan-frame" aria-hidden="true"><span/><span/><span/><span/></div>
      <div>
        <h2 id="scanner-title">Scanner QR</h2>
        <p>L'attivazione della fotocamera e la lettura dei QR saranno collegate in un blocco successivo.</p>
      </div>
    </section>

    <div className={`checkin-result checkin-result-${state}`} aria-live="polite">
      <strong>Risultato verifica</strong>
      <span>{message}</span>
    </div>
  </div>;
}
