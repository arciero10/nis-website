"use client";

import Image from "next/image";
import {FormEvent,useEffect,useRef,useState} from "react";
import type {IScannerControls} from "@zxing/browser";
import StaffNavigation from "@/components/StaffNavigation";

type CheckInResult={status:"AUTHORIZED"|"ALREADY_USED";firstName:string;lastName:string;ticketCode:string;category:string;companyName:string|null;sequenceNumber:number|null;totalQuantity:number|null;checkedInAt:string}|{status:"INVALID"};
type Screen="checking-session"|"login"|"scanner"|"checking-ticket"|"result"|"camera-error";
const formatTime=(value:string)=>new Intl.DateTimeFormat("it-IT",{hour:"2-digit",minute:"2-digit",second:"2-digit",timeZone:"Europe/Rome"}).format(new Date(value));

export default function CheckInScanner(){
  const [screen,setScreen]=useState<Screen>("checking-session");const [message,setMessage]=useState("");const [result,setResult]=useState<CheckInResult|null>(null);const videoRef=useRef<HTMLVideoElement>(null);const busyRef=useRef(false);

  useEffect(()=>{fetch("/api/ticketing/checkin/session",{cache:"no-store"}).then(response=>response.json()).then((body:{authenticated?:boolean})=>setScreen(body.authenticated?"scanner":"login")).catch(()=>{setMessage("Impossibile verificare la sessione staff.");setScreen("login");});},[]);

  useEffect(()=>{
    if(screen!=="scanner"||!videoRef.current)return;let active=true;let controls:IScannerControls|undefined;
    import("@zxing/browser").then(async({BrowserQRCodeReader})=>{const reader=new BrowserQRCodeReader();controls=await reader.decodeFromConstraints({audio:false,video:{facingMode:{ideal:"environment"}}},videoRef.current??undefined,(scanResult)=>{if(!active||!scanResult||busyRef.current)return;busyRef.current=true;controls?.stop();void verifyTicket(scanResult.getText());});}).catch(()=>{if(active){setMessage("Fotocamera non disponibile. Verifica i permessi del browser.");setScreen("camera-error");}});
    return()=>{active=false;controls?.stop();};
  },[screen]);

  async function login(event:FormEvent<HTMLFormElement>){event.preventDefault();setMessage("");const form=event.currentTarget;const pin=String(new FormData(form).get("pin")??"");const response=await fetch("/api/ticketing/checkin/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin})});if(!response.ok){setMessage(response.status===401?"PIN non valido.":"Accesso staff non disponibile.");return;}form.reset();setScreen("scanner");}
  async function verifyTicket(qrToken:string){setScreen("checking-ticket");setMessage("");try{const response=await fetch("/api/ticketing/checkin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({qrToken})});if(response.status===401){setScreen("login");setMessage("Sessione scaduta. Inserisci nuovamente il PIN.");return;}if(!response.ok)throw new Error();setResult(await response.json() as CheckInResult);setScreen("result");}catch{setMessage("Verifica non riuscita. Controlla la connessione e riprova.");setScreen("camera-error");}finally{busyRef.current=false;}}
  function nextScan(){setResult(null);setMessage("");busyRef.current=false;setScreen("scanner");}
  function manualCheck(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;const value=String(new FormData(form).get("manualToken")??"").trim();if(value){form.reset();busyRef.current=true;void verifyTicket(value);}}

  if(screen==="checking-session")return <div className="checkin-loading" role="status">Verifica sessione staff...</div>;
  if(screen==="login")return <section className="checkin-login"><Image src="/logo/nis-logo-square.png" width={92} height={92} alt="Nazionale Italiana Sanitari" priority/><span>AREA RISERVATA STAFF</span><h1>Controllo accessi</h1><p>Inserisci il PIN operatore per aprire lo scanner del NIS Gala.</p><form onSubmit={login}><label htmlFor="operator-pin">PIN operatore</label><input id="operator-pin" name="pin" type="password" inputMode="numeric" autoComplete="current-password" maxLength={128} required/><button className="btn btn-blue" type="submit">ACCEDI</button></form>{message&&<div className="checkin-login-error" role="alert">{message}</div>}</section>;

  if(screen==="result"&&result){const authorized=result.status==="AUTHORIZED";const alreadyUsed=result.status==="ALREADY_USED";const partner=result.status!=="INVALID"&&result.category==="PARTNER";return <div className="checkin-authenticated"><StaffNavigation/><section className={`checkin-outcome ${authorized?"checkin-outcome-authorized":"checkin-outcome-denied"}`} aria-live="assertive"><div className="checkin-outcome-symbol" aria-hidden="true">{authorized?"✓":"✕"}</div><span>{authorized?"ACCESSO AUTORIZZATO":"ACCESSO NEGATO"}</span>{result.status==="INVALID"?<h1>BIGLIETTO NON VALIDO</h1>:<><h1>{partner?result.companyName:`${result.firstName} ${result.lastName}`}</h1>{partner&&<p className="checkin-used-time">INVITO PARTNER · Ingresso {result.sequenceNumber??1} di {result.totalQuantity??1}</p>}{alreadyUsed&&<p className="checkin-used-time">Già utilizzato alle {formatTime(result.checkedInAt)}</p>} {authorized&&<p className="checkin-used-time">Registrato alle {formatTime(result.checkedInAt)}</p>}<dl><div><dt>Categoria</dt><dd>{partner?"INVITO PARTNER":result.category}</dd></div>{result.companyName&&<div><dt>Società</dt><dd>{result.companyName}</dd></div>}<div><dt>Codice ticket</dt><dd>{result.ticketCode}</dd></div></dl></>}<button type="button" onClick={nextScan}>SCANSIONA PROSSIMO</button></section></div>}

  return <div className="checkin-authenticated"><StaffNavigation/><section className="checkin-scanner"><header><div><span>NIS GALA CHARITY NIGHT</span><h1>Scanner ingressi</h1></div></header>{screen==="scanner"?<><div className="checkin-camera"><video ref={videoRef} muted playsInline/><span/><span/><span/><span/></div><p>Inquadra il QR Code del biglietto</p><form className="checkin-manual" onSubmit={manualCheck}><label htmlFor="manual-token">Inserimento manuale QR</label><div><input id="manual-token" name="manualToken" autoComplete="off" placeholder="Token o payload NIS"/><button type="submit">VERIFICA</button></div></form></>:screen==="checking-ticket"?<div className="checkin-loading" role="status">Verifica ticket in corso...</div>:<div className="checkin-camera-error" role="alert"><strong>Scanner non disponibile</strong><p>{message}</p><button type="button" onClick={nextScan}>RIPROVA</button></div>}</section></div>;
}
