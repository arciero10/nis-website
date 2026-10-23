"use client";

import Image from "next/image";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import GalaSponsorStrip from "@/components/GalaSponsorStrip";
import {galaPromotion} from "@/data/gala-promotion";

const STORAGE_KEY="nis-gala-takeover-dismissed-session-v1";

export default function GalaTakeover(){
  const [open,setOpen]=useState(false);
  const closeButton=useRef<HTMLButtonElement>(null);
  const dialog=useRef<HTMLElement>(null);

  useEffect(()=>{
    if(!galaPromotion.enabled)return;
    let dismissed=false;
    try{dismissed=window.sessionStorage.getItem(STORAGE_KEY)==="true";}catch{/* Mostra comunque il contenuto se lo storage non è disponibile. */}
    if(!dismissed)setOpen(true);
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
    try{window.sessionStorage.setItem(STORAGE_KEY,"true");}catch{/* La chiusura deve restare disponibile anche senza storage. */}
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
        <p className="gala-takeover-kicker">28 OTTOBRE 2026 · ROMA</p>
        <h2 id="gala-takeover-title"><span className="gala-takeover-title-line">THE NIS GALA</span><span className="gala-takeover-subtitle">CHARITY NIGHT</span></h2>
        <p id="gala-takeover-description">{galaPromotion.description}</p>
        <dl className="gala-takeover-details">
          <div><dt>Data</dt><dd><time dateTime={galaPromotion.dateIso}>{galaPromotion.date}</time></dd></div>
          <div><dt>Luogo</dt><dd>{galaPromotion.location}</dd></div>
        </dl>
        <div className="gala-takeover-actions">
          <Link href={galaPromotion.publicPath} className="btn btn-blue" onClick={dismiss}>SCOPRI L&apos;EVENTO</Link>
          <button type="button" className="gala-continue" onClick={dismiss}>CONTINUA AL SITO</button>
        </div>
      </div>
      <GalaSponsorStrip className="gala-takeover-sponsors"/>
    </section>
  </div>;
}

