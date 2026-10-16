"use client";

import Image from "next/image";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {galaPromotion} from "@/data/gala-promotion";

const STORAGE_KEY="nis-gala-takeover-dismissed-at-v2";
const DISPLAY_INTERVAL=24*60*60*1000;

export default function GalaTakeover(){
  const [open,setOpen]=useState(false);
  const closeButton=useRef<HTMLButtonElement>(null);
  const dialog=useRef<HTMLElement>(null);

  useEffect(()=>{
    if(!galaPromotion.enabled)return;
    let dismissedAt=0;
    try{dismissedAt=Number(window.localStorage.getItem(STORAGE_KEY)??0);}catch{/* Mostra comunque il contenuto se lo storage non è disponibile. */}
    if(!Number.isFinite(dismissedAt)||Date.now()-dismissedAt>=DISPLAY_INTERVAL)setOpen(true);
  },[]);

  useEffect(()=>{
    if(!open)return;
    const previousOverflow=document.body.style.overflow;
    const handleKeyDown=(event:KeyboardEvent)=>{
      if(event.key==="Escape"){dismiss();return;}
      if(event.key!=="Tab"||!dialog.current)return;
      const focusable=Array.from(dialog.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])"));
      if(!focusable.length)return;
      const first=focusable[0];const last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    };
    document.body.style.overflow="hidden";
    window.addEventListener("keydown",handleKeyDown);
    closeButton.current?.focus();
    return ()=>{document.body.style.overflow=previousOverflow;window.removeEventListener("keydown",handleKeyDown);};
  },[open]);

  function dismiss(){
    try{window.localStorage.setItem(STORAGE_KEY,String(Date.now()));}catch{/* La chiusura deve restare disponibile anche senza storage. */}
    setOpen(false);
  }

  if(!open)return null;

  return <div className="gala-takeover-backdrop" role="presentation" onMouseDown={event=>{if(event.currentTarget===event.target)dismiss();}}>
    <section ref={dialog} className="gala-takeover" role="dialog" aria-modal="true" aria-labelledby="gala-takeover-title" aria-describedby="gala-takeover-description">
      <button ref={closeButton} className="gala-takeover-close" type="button" onClick={dismiss} aria-label="Chiudi presentazione NIS Gala">×</button>
      <div className="gala-takeover-artwork">
        <Image src={galaPromotion.artwork} alt="The NIS Gala Charity Night, 28 ottobre 2026, Roma" fill priority sizes="(max-width: 720px) calc(100vw - 32px), 58vw"/>
      </div>
      <div className="gala-takeover-content">
        <div className="gala-takeover-event-meta" aria-label="Data e luogo dell'evento">
          <span>28 OTTOBRE 2026</span>
          <span>ANOTHER STUDIO · ROMA</span>
        </div>
        <h2 id="gala-takeover-title"><span className="gala-takeover-title-line">THE NIS GALA 2026</span><span className="gala-takeover-subtitle">CHARITY NIGHT</span></h2>
        <p id="gala-takeover-description">{galaPromotion.description}</p>
        <div className="gala-takeover-actions">
          <Link href="/i/gala-2026" className="btn gala-primary-cta" onClick={dismiss}>ACQUISTA IL BIGLIETTO</Link>
          <button type="button" className="gala-continue" onClick={dismiss}>CONTINUA AL SITO</button>
        </div>
      </div>
    </section>
  </div>;
}

