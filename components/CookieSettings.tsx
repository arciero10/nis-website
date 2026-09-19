"use client";

import Link from "next/link";
import {useEffect,useRef,useState} from "react";

export default function CookieSettings(){
  const [open,setOpen]=useState(false);
  const closeButton=useRef<HTMLButtonElement>(null);
  const triggerButton=useRef<HTMLButtonElement>(null);

  useEffect(()=>{
    if(!open) return;
    closeButton.current?.focus();
    function handleKeyDown(event:KeyboardEvent){
      if(event.key==="Escape"){
        setOpen(false);
        triggerButton.current?.focus();
      }
      if(event.key==="Tab"){
        const dialog=closeButton.current?.closest<HTMLElement>("[role='dialog']");
        const focusable=dialog?.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
        if(!focusable?.length) return;
        const first=focusable[0];
        const last=focusable[focusable.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
        if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
      }
    }
    document.addEventListener("keydown",handleKeyDown);
    return ()=>document.removeEventListener("keydown",handleKeyDown);
  },[open]);

  function close(){
    setOpen(false);
    triggerButton.current?.focus();
  }

  return <>
    <button ref={triggerButton} type="button" className="footer-cookie-button" onClick={()=>setOpen(true)}>Gestisci cookie</button>
    {open&&<div className="cookie-modal-backdrop" role="presentation" onMouseDown={event=>{
      if(event.target===event.currentTarget) close();
    }}>
      <section className="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title" aria-describedby="cookie-settings-description">
        <button ref={closeButton} type="button" className="cookie-modal-close" aria-label="Chiudi impostazioni cookie" onClick={close}>×</button>
        <div className="eyebrow">PREFERENZE COOKIE</div>
        <h2 id="cookie-settings-title">Cookie utilizzati dal sito</h2>
        <p id="cookie-settings-description">Al momento il sito non utilizza cookie analytics, pubblicitari o di profilazione e non incorpora servizi di terze parti. Non è quindi necessario esprimere o memorizzare un consenso.</p>
        <div className="cookie-category">
          <div><strong>Cookie tecnici essenziali</strong><span>Il codice del sito non imposta attualmente cookie applicativi. Questa categoria resta riservata alle sole funzionalità strettamente necessarie.</span></div>
          <span className="cookie-always-on">Sempre attivi</span>
        </div>
        <div className="cookie-modal-links"><Link href="/cookie-policy" onClick={close}>Cookie Policy</Link><Link href="/privacy-policy" onClick={close}>Privacy Policy</Link></div>
        <button type="button" className="btn btn-blue cookie-modal-done" onClick={close}>CHIUDI</button>
      </section>
    </div>}
  </>;
}
