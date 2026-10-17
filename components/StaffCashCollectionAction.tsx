"use client";

import {useState} from "react";

export default function StaffCashCollectionAction({ticketCode}:{ticketCode:string}){
  const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");
  async function confirm(){
    if(!window.confirm("Confermi che l’importo in contanti è stato effettivamente incassato?"))return;
    setBusy(true);setMessage("");
    try{const response=await fetch(`/api/ticketing/staff/tickets/${encodeURIComponent(ticketCode)}/cash-collection`,{method:"POST"});const body=await response.json() as {message?:string};if(!response.ok)throw new Error(body.message||"Conferma non riuscita.");setMessage(body.message??"Incasso confermato.");window.location.reload();}catch(error){setMessage(error instanceof Error?error.message:"Conferma non riuscita.");setBusy(false);}
  }
  return <div className="staff-cash-action"><button type="button" onClick={confirm} disabled={busy}>{busy?"CONFERMA IN CORSO...":"CONFERMA INCASSO"}</button>{message&&<p role="status">{message}</p>}</div>;
}
