"use client";

import Link from "next/link";
import {Suspense,useEffect,useRef,useState} from "react";
import GoogleAnalytics,{initializeConsentMode,updateAnalyticsConsent} from "./GoogleAnalytics";

const consentKey="nis_cookie_consent";
const consentVersion="2026-09-ga4-v1";

type StoredConsent={version:string;analytics:boolean};

function readStoredConsent():StoredConsent|null{
  try{
    const value=localStorage.getItem(consentKey);
    if(!value) return null;
    const parsed=JSON.parse(value) as StoredConsent;
    return parsed.version===consentVersion&&typeof parsed.analytics==="boolean"?parsed:null;
  }catch{
    return null;
  }
}

function deleteAnalyticsCookies(){
  document.cookie.split(";").forEach(cookie=>{
    const name=cookie.split("=")[0].trim();
    if(!name.startsWith("_ga")) return;
    const expiry="=; Max-Age=0; path=/; SameSite=Lax";
    document.cookie=`${name}${expiry}`;
    document.cookie=`${name}${expiry}; domain=.nazionaleitalianasanitari.com`;
  });
}

export default function CookieSettings(){
  const [ready,setReady]=useState(false);
  const [analytics,setAnalytics]=useState<boolean|null>(null);
  const [draftAnalytics,setDraftAnalytics]=useState(false);
  const [open,setOpen]=useState(false);
  const closeButton=useRef<HTMLButtonElement>(null);
  const opener=useRef<HTMLElement|null>(null);

  useEffect(()=>{
    initializeConsentMode();
    const stored=readStoredConsent();
    if(stored){
      setAnalytics(stored.analytics);
      updateAnalyticsConsent(stored.analytics);
    }
    setReady(true);
  },[]);

  useEffect(()=>{
    if(!open) return;
    closeButton.current?.focus();
    function handleKeyDown(event:KeyboardEvent){
      if(event.key==="Escape") closePreferences();
      if(event.key==="Tab"){
        const dialog=closeButton.current?.closest<HTMLElement>("[role='dialog']");
        const focusable=dialog?.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input:not([disabled])");
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

  function openPreferences(element:HTMLElement){
    opener.current=element;
    setDraftAnalytics(analytics===true);
    setOpen(true);
  }

  function closePreferences(){
    setOpen(false);
    requestAnimationFrame(()=>opener.current?.focus());
  }

  function saveConsent(nextAnalytics:boolean){
    const wasGranted=analytics===true;
    localStorage.setItem(consentKey,JSON.stringify({version:consentVersion,analytics:nextAnalytics}));
    updateAnalyticsConsent(nextAnalytics);
    setAnalytics(nextAnalytics);
    setOpen(false);
    if(!nextAnalytics){
      deleteAnalyticsCookies();
      if(wasGranted) window.location.reload();
    }
  }

  return <>
    <button type="button" className="footer-cookie-button" onClick={event=>openPreferences(event.currentTarget)}>Gestisci cookie</button>

    {ready&&analytics===null&&<aside className="cookie-banner" role="region" aria-label="Preferenze cookie">
      <div className="cookie-banner-copy">
        <strong>La tua privacy sul sito NIS</strong>
        <p>Utilizziamo cookie necessari al funzionamento del sito e, previo consenso, cookie analitici per comprendere come viene utilizzato il sito e migliorare i nostri servizi.</p>
      </div>
      <div className="cookie-banner-actions">
        <button type="button" className="btn btn-blue" onClick={()=>saveConsent(true)}>ACCETTA TUTTI</button>
        <button type="button" className="btn cookie-secondary" onClick={()=>saveConsent(false)}>SOLO NECESSARI</button>
        <button type="button" className="cookie-manage" onClick={event=>openPreferences(event.currentTarget)}>GESTISCI PREFERENZE</button>
      </div>
    </aside>}

    {open&&<div className="cookie-modal-backdrop" role="presentation" onMouseDown={event=>{
      if(event.target===event.currentTarget) closePreferences();
    }}>
      <section className="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title" aria-describedby="cookie-settings-description">
        <button ref={closeButton} type="button" className="cookie-modal-close" aria-label="Chiudi impostazioni cookie" onClick={closePreferences}>×</button>
        <div className="eyebrow">PREFERENZE COOKIE</div>
        <h2 id="cookie-settings-title">Gestisci le preferenze</h2>
        <p id="cookie-settings-description">Scegli quali cookie facoltativi autorizzare. I cookie necessari sono sempre attivi.</p>
        <div className="cookie-category">
          <div><strong>Cookie necessari</strong><span>Necessari al funzionamento, alla sicurezza e alla memorizzazione delle preferenze del sito.</span></div>
          <span className="cookie-always-on">Sempre attivi</span>
        </div>
        <div className="cookie-category cookie-category-analytics">
          <div><strong>Cookie analitici</strong><span>Google Analytics 4, utilizzato per statistiche aggregate solo previo consenso.</span></div>
          <label className="cookie-toggle">
            <input type="checkbox" checked={draftAnalytics} onChange={event=>setDraftAnalytics(event.target.checked)}/>
            <span aria-hidden="true"/>
            <b>{draftAnalytics?"Attivi":"Non attivi"}</b>
          </label>
        </div>
        <div className="cookie-modal-links"><Link href="/cookie-policy" onClick={closePreferences}>Cookie Policy</Link><Link href="/privacy-policy" onClick={closePreferences}>Privacy Policy</Link></div>
        <button type="button" className="btn btn-blue cookie-modal-done" onClick={()=>saveConsent(draftAnalytics)}>SALVA PREFERENZE</button>
      </section>
    </div>}

    {analytics===true&&<Suspense fallback={null}><GoogleAnalytics/></Suspense>}
  </>;
}
