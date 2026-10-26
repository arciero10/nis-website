"use client";

import Image from "next/image";
import {FormEvent,useEffect,useRef,useState} from "react";
import type {IScannerControls} from "@zxing/browser";
import StaffNavigation from "@/components/StaffNavigation";
import {allocationTypeLabel} from "@/lib/ticketing/presentation";
import {formatPersonFullName} from "@/lib/ticketing/name-format";
import type {CheckInOperationalStatus} from "@/lib/ticketing/checkin-window";
import type {StaffCheckInResponse} from "@/lib/ticketing/repository";
import type {StaffRole} from "@/lib/ticketing/checkin-rules";

type Screen="checking-session"|"login"|"scanner"|"checking-ticket"|"confirm"|"result"|"camera-error";
const formatTime=(value:string)=>new Intl.DateTimeFormat("it-IT",{dateStyle:"short",timeStyle:"medium",timeZone:"Europe/Rome"}).format(new Date(value));
const formatClock=(value:string)=>new Intl.DateTimeFormat("it-IT",{hour:"2-digit",minute:"2-digit",second:"2-digit",timeZone:"Europe/Rome"}).format(new Date(value));
const formatOpening=(value:string)=>new Intl.DateTimeFormat("it-IT",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",timeZone:"Europe/Rome"}).format(new Date(value));
const AUTHORIZED_RETURN_DELAY=1400;
const DENIED_RETURN_DELAY=2800;

export default function CheckInScanner(){
  const [screen,setScreen]=useState<Screen>("checking-session");const [message,setMessage]=useState("");const [result,setResult]=useState<StaffCheckInResponse|null>(null);const [scannedToken,setScannedToken]=useState("");const [role,setRole]=useState<StaffRole>("STAFF");const [checkInWindow,setCheckInWindow]=useState<CheckInOperationalStatus|null>(null);const [windowBusy,setWindowBusy]=useState(false);const videoRef=useRef<HTMLVideoElement>(null);const busyRef=useRef(false);

  async function loadCheckInWindow(){
    const response=await fetch("/api/ticketing/staff/checkin-window",{cache:"no-store"});
    if(response.status===401){setScreen("login");return null;}
    if(!response.ok)throw new Error("Stato check-in non disponibile.");
    const body=await response.json() as {window:CheckInOperationalStatus};setCheckInWindow(body.window);return body.window;
  }

  useEffect(()=>{fetch("/api/ticketing/checkin/session",{cache:"no-store"}).then(response=>response.json()).then(async(body:{authenticated?:boolean;role?:StaffRole})=>{if(body.role)setRole(body.role);if(body.authenticated){await loadCheckInWindow();setScreen("scanner");}else setScreen("login");}).catch(()=>{setMessage("Impossibile verificare la sessione staff.");setScreen("login");});},[]);

  useEffect(()=>{
    if(screen!=="scanner")return;
    const timer=window.setInterval(()=>{void loadCheckInWindow().catch(()=>setMessage("Impossibile aggiornare lo stato del check-in."));},30_000);
    return()=>window.clearInterval(timer);
  },[screen]);

  useEffect(()=>{
    if(screen!=="scanner"||checkInWindow?.effectiveState!=="OPEN"||!videoRef.current)return;let active=true;let controls:IScannerControls|undefined;
    import("@zxing/browser").then(async({BrowserQRCodeReader})=>{const reader=new BrowserQRCodeReader();controls=await reader.decodeFromConstraints({audio:false,video:{facingMode:{ideal:"environment"}}},videoRef.current??undefined,(scanResult)=>{if(!active||!scanResult||busyRef.current)return;busyRef.current=true;controls?.stop();void checkInScannedTicket(scanResult.getText());});}).catch(()=>{if(active){setMessage("Fotocamera non disponibile. Verifica i permessi del browser.");setScreen("camera-error");}});
    return()=>{active=false;controls?.stop();};
  },[screen,checkInWindow?.effectiveState]);

  useEffect(()=>{
    if(screen!=="result"||!result)return;
    const authorized=result.status==="AUTHORIZED";
    if("vibrate" in navigator)navigator.vibrate(authorized?80:[100,80,100]);
    const timer=window.setTimeout(nextScan,authorized?AUTHORIZED_RETURN_DELAY:DENIED_RETURN_DELAY);
    return()=>window.clearTimeout(timer);
  },[screen,result]);

  async function login(event:FormEvent<HTMLFormElement>){event.preventDefault();setMessage("");const form=event.currentTarget;const pin=String(new FormData(form).get("pin")??"");const response=await fetch("/api/ticketing/checkin/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin})});if(!response.ok){setMessage(response.status===401?"PIN non valido.":"Accesso staff non disponibile.");return;}const body=await response.json() as {role?:StaffRole};if(body.role)setRole(body.role);form.reset();try{await loadCheckInWindow();setScreen("scanner");}catch{setMessage("Stato check-in non disponibile.");}}
  async function checkInScannedTicket(rawToken:string){setScreen("checking-ticket");setMessage("");setScannedToken("");try{const response=await fetch("/api/ticketing/checkin",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({qrToken:rawToken})});if(response.status===401){setScreen("login");setMessage("Sessione scaduta. Inserisci nuovamente il PIN.");return;}if(!response.ok)throw new Error();setResult(await response.json() as StaffCheckInResponse);setScreen("result");}catch{setMessage("Registrazione non riuscita. Controlla la connessione e riprova.");busyRef.current=false;setScreen("camera-error");}}
  async function inspectTicket(rawToken:string){setScreen("checking-ticket");setMessage("");setScannedToken(rawToken);try{const response=await fetch("/api/ticketing/checkin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({qrToken:rawToken})});if(response.status===401){setScreen("login");setMessage("Sessione scaduta. Inserisci nuovamente il PIN.");return;}if(!response.ok)throw new Error();const lookup=await response.json() as StaffCheckInResponse;setResult(lookup);setScreen(lookup.status==="VALID"?"confirm":"result");}catch{setMessage("Verifica non riuscita. Controlla la connessione e riprova.");setScreen("camera-error");}finally{busyRef.current=false;}}
  async function confirmTicket(){setScreen("checking-ticket");try{const response=await fetch("/api/ticketing/checkin",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({qrToken:scannedToken})});if(response.status===401){setScreen("login");return;}if(!response.ok)throw new Error();setResult(await response.json() as StaffCheckInResponse);setScreen("result");}catch{setMessage("Registrazione non riuscita. Riprova.");setScreen("camera-error");}}
  async function changeCheckInWindow(action:"OPEN"|"CLOSE"){
    const prompt=action==="OPEN"?"Aprire manualmente il check-in adesso?":"Chiudere manualmente il check-in? Nessun nuovo ingresso potrà essere registrato.";
    if(!window.confirm(prompt))return;
    setWindowBusy(true);setMessage("");
    try{const response=await fetch("/api/ticketing/staff/checkin-window",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action})});if(response.status===401){setScreen("login");return;}if(!response.ok)throw new Error();const body=await response.json() as {window:CheckInOperationalStatus};setCheckInWindow(body.window);setMessage(action==="OPEN"?"Check-in aperto manualmente.":"Check-in chiuso manualmente.");}
    catch{setMessage("Non è stato possibile aggiornare lo stato del check-in.");}finally{setWindowBusy(false);}
  }
  function nextScan(){setResult(null);setScannedToken("");setMessage("");busyRef.current=false;setScreen("scanner");}
  function manualCheck(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;const value=String(new FormData(form).get("manualToken")??"").trim();if(value){form.reset();busyRef.current=true;void inspectTicket(value);}}

  if(screen==="checking-session")return <div className="checkin-loading" role="status">Verifica sessione staff...</div>;
  if(screen==="login")return <section className="checkin-login"><Image src="/logo/nis-logo-square.png" width={92} height={92} alt="Nazionale Italiana Sanitari" priority/><span>AREA RISERVATA STAFF</span><h1>Controllo accessi</h1><p>Inserisci il PIN operatore per aprire lo scanner del NIS Gala.</p><form onSubmit={login}><label htmlFor="operator-pin">PIN operatore</label><input id="operator-pin" name="pin" type="password" inputMode="numeric" autoComplete="current-password" maxLength={128} required/><button className="btn btn-blue" type="submit">ACCEDI</button></form>{message&&<div className="checkin-login-error" role="alert">{message}</div>}</section>;

  if(screen==="confirm"&&result&&result.status==="VALID"){const companyInvitation=result.category==="PARTNER";const invitationType=allocationTypeLabel(result.allocationType??"AZIENDA");return <div className="checkin-authenticated"><StaffNavigation/><section className="checkin-confirm" aria-live="polite"><span>TICKET VALIDO</span><h1>{companyInvitation?result.companyName:formatPersonFullName(result.firstName,result.lastName)}</h1>{companyInvitation&&<p>INVITO {invitationType.toUpperCase()} · Ingresso {result.sequenceNumber??1} di {result.totalQuantity??1}</p>}<dl><div><dt>Codice</dt><dd>{result.ticketCode}</dd></div><div><dt>{companyInvitation?"Tipo invito":"Categoria"}</dt><dd>{companyInvitation?invitationType:result.category}</dd></div></dl><div className="checkin-confirm-actions"><button type="button" className="is-primary" onClick={confirmTicket}>CONFERMA INGRESSO</button><button type="button" onClick={nextScan}>ANNULLA / SCANSIONA ALTRO</button></div></section></div>}

  if(screen==="result"&&result){const authorized=result.status==="AUTHORIZED";const alreadyUsed=result.status==="ALREADY_USED";const windowBlocked=result.status==="NOT_OPEN"||result.status==="CLOSED";const identified=result.status!=="INVALID";const holder=identified?formatPersonFullName(result.firstName,result.lastName):"";return <div className="checkin-authenticated"><StaffNavigation/><section className={`checkin-outcome ${authorized?"checkin-outcome-authorized":"checkin-outcome-denied"}`} aria-live="assertive"><div className="checkin-outcome-symbol" aria-hidden="true">{authorized?"✓":"✕"}</div><span>{authorized?"ACCESSO AUTORIZZATO":"ACCESSO NEGATO"}</span>{result.status==="INVALID"?<h1>BIGLIETTO NON VALIDO</h1>:windowBlocked?<><h1>{result.status==="NOT_OPEN"?"CHECK-IN NON ANCORA APERTO":"CHECK-IN CHIUSO"}</h1><p className="checkin-used-time">Il ticket resta valido.</p></>:alreadyUsed?<><h1>GIÀ UTILIZZATO</h1><p className="checkin-outcome-holder">{holder}</p><p className="checkin-used-time">Registrato il {formatTime(result.checkedInAt)}{result.operatorName?` da ${result.operatorName}`:""}</p></>:authorized?<><h1>{holder}</h1><p className="checkin-used-time">Registrato alle {formatClock(result.checkedInAt)}</p></>:<h1>TICKET VALIDO</h1>}<button type="button" onClick={nextScan}>SCANSIONA PROSSIMO</button></section></div>}

  const isOpen=checkInWindow?.effectiveState==="OPEN";
  const statusLabel=isOpen?(checkInWindow?.source==="MANUAL"?"CHECK-IN APERTO MANUALMENTE":"CHECK-IN APERTO"):"CHECK-IN CHIUSO";
  return <div className="checkin-authenticated"><StaffNavigation/><section className="checkin-scanner"><header><div><span>NIS GALA CHARITY NIGHT</span><h1>Scanner ingressi</h1></div></header><section className={`checkin-window-status ${isOpen?"is-open":"is-closed"}`} aria-live="polite"><div><strong>{statusLabel}</strong>{!isOpen&&checkInWindow?.effectiveState==="SCHEDULED"&&checkInWindow.opensAt&&<span>Apertura automatica: {formatOpening(checkInWindow.opensAt)}</span>}{checkInWindow?.source==="MANUAL"&&checkInWindow.changedBy&&<small>Ultima modifica: {checkInWindow.changedBy}{checkInWindow.changedAt?` · ${formatTime(checkInWindow.changedAt)}`:""}</small>}</div>{role==="SUPERADMIN"&&checkInWindow&&<button type="button" onClick={()=>changeCheckInWindow(isOpen?"CLOSE":"OPEN")} disabled={windowBusy}>{windowBusy?"AGGIORNAMENTO...":isOpen?"CHIUDI CHECK-IN":"APRI CHECK-IN ORA"}</button>}</section>{message&&<p className="staff-feedback" role="status">{message}</p>}{screen==="scanner"?(isOpen?<><div className="checkin-camera"><video ref={videoRef} muted playsInline/><span/><span/><span/><span/></div><p>Inquadra il QR Code del biglietto</p><form className="checkin-manual" onSubmit={manualCheck}><label htmlFor="manual-token">Inserimento manuale QR</label><div><input id="manual-token" name="manualToken" autoComplete="off" placeholder="Token o payload NIS"/><button type="submit">VERIFICA</button></div></form></>:<div className="checkin-window-closed"><strong>{checkInWindow?.effectiveState==="SCHEDULED"?"Check-in non ancora aperto":"Check-in chiuso"}</strong><p>Lo scanner e la registrazione manuale degli ingressi sono disattivati.</p></div>):screen==="checking-ticket"?<div className="checkin-loading" role="status">Verifica ticket in corso...</div>:<div className="checkin-camera-error" role="alert"><strong>Scanner non disponibile</strong><p>{message}</p><button type="button" onClick={nextScan}>RIPROVA</button></div>}</section></div>;
}
