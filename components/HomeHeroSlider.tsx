"use client";

import Image from "next/image";
import {useCallback,useEffect,useRef,useState,type FocusEvent,type KeyboardEvent,type TouchEvent} from "react";
import {galaGalleryImages} from "@/data/gala-gallery";

const AUTO_ROTATION_MS=6200;
const SWIPE_THRESHOLD=44;

export default function HomeHeroSlider(){
  const [activeIndex,setActiveIndex]=useState(0);
  const [isHovered,setIsHovered]=useState(false);
  const [hasFocus,setHasFocus]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(false);
  const touchStartX=useRef<number|null>(null);

  const showPrevious=useCallback(()=>setActiveIndex(current=>(current-1+galaGalleryImages.length)%galaGalleryImages.length),[]);
  const showNext=useCallback(()=>setActiveIndex(current=>(current+1)%galaGalleryImages.length),[]);

  useEffect(()=>{
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference=()=>setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change",updatePreference);
    return ()=>media.removeEventListener("change",updatePreference);
  },[]);

  useEffect(()=>{
    if(reducedMotion||isHovered||hasFocus||galaGalleryImages.length<2)return;
    const timer=window.setInterval(showNext,AUTO_ROTATION_MS);
    return ()=>window.clearInterval(timer);
  },[activeIndex,hasFocus,isHovered,reducedMotion,showNext]);

  function handleKeyDown(event:KeyboardEvent<HTMLElement>){
    if(event.key==="ArrowLeft"){event.preventDefault();showPrevious();}
    else if(event.key==="ArrowRight"){event.preventDefault();showNext();}
    else if(event.key==="Home"){event.preventDefault();setActiveIndex(0);}
    else if(event.key==="End"){event.preventDefault();setActiveIndex(galaGalleryImages.length-1);}
  }

  function handleBlur(event:FocusEvent<HTMLElement>){
    if(!event.currentTarget.contains(event.relatedTarget))setHasFocus(false);
  }

  function handleTouchStart(event:TouchEvent<HTMLElement>){
    touchStartX.current=event.changedTouches[0]?.clientX??null;
  }

  function handleTouchEnd(event:TouchEvent<HTMLElement>){
    if(touchStartX.current===null)return;
    const distance=(event.changedTouches[0]?.clientX??touchStartX.current)-touchStartX.current;
    touchStartX.current=null;
    if(Math.abs(distance)<SWIPE_THRESHOLD)return;
    if(distance>0)showPrevious();
    else showNext();
  }

  return <section
    className="home-hero-slider"
    aria-label="Le immagini del NIS Gala Charity Night 2026"
    aria-roledescription="carosello"
    onMouseEnter={()=>setIsHovered(true)}
    onMouseLeave={()=>setIsHovered(false)}
    onFocus={()=>setHasFocus(true)}
    onBlur={handleBlur}
    onKeyDown={handleKeyDown}
    onTouchStart={handleTouchStart}
    onTouchEnd={handleTouchEnd}
  >
    <div className="home-hero-slides">
      {galaGalleryImages.map((image,index)=>{
        const isActive=index===activeIndex;
        return <article className={`home-hero-slide${isActive?" is-active":""}`} aria-hidden={!isActive} aria-label={`${index+1} di ${galaGalleryImages.length}`} aria-roledescription="slide" key={image.src}>
          <Image src={image.src} alt={isActive?image.alt:""} fill priority={index===0} loading={index===0?undefined:"lazy"} sizes="100vw" style={{objectPosition:image.objectPosition}}/>
        </article>;
      })}
    </div>
    <span className="home-hero-shade" aria-hidden="true"/>
    <div className="shell home-hero-slide-inner">
      <div className="home-hero-slide-copy">
        <p className="home-hero-meta"><strong>28 OTTOBRE 2026 · ROMA</strong></p>
        <h1>NIS Gala Charity Night 2026</h1>
        <p className="home-hero-kicker">Le immagini della serata</p>
        <p className="home-hero-description">Una serata di partecipazione e solidarietà che ha riunito la comunità NIS a sostegno di progetti concreti per la salute.</p>
      </div>
    </div>
    <button className="home-hero-arrow is-previous" type="button" onClick={showPrevious} aria-label="Immagine precedente"><span aria-hidden="true">←</span></button>
    <button className="home-hero-arrow is-next" type="button" onClick={showNext} aria-label="Immagine successiva"><span aria-hidden="true">→</span></button>
    <div className="home-hero-indicators" aria-label="Seleziona un'immagine">
      {galaGalleryImages.map((image,index)=><button type="button" key={image.src} className={index===activeIndex?"is-active":undefined} aria-label={`Mostra immagine ${index+1} di ${galaGalleryImages.length}`} aria-current={index===activeIndex?"true":undefined} onClick={()=>setActiveIndex(index)}><span/></button>)}
    </div>
    <div className="tricolor-swoosh" aria-hidden="true"/>
  </section>;
}
