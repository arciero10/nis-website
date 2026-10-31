"use client";

import Image from "next/image";
import {useCallback,useEffect,useRef,useState,type FocusEvent,type KeyboardEvent,type TouchEvent} from "react";
import {galaHeroImages} from "@/data/gala-gallery";

const AUTO_ROTATION_MS=6200;
const SWIPE_THRESHOLD=44;
const GALA_REEL_SRC="/videos/gala-2026/nis-gala-2026-reel.mp4";
const heroSlides=[
  {type:"video" as const,src:GALA_REEL_SRC,poster:galaHeroImages[0].src,key:GALA_REEL_SRC},
  ...galaHeroImages.map(image=>({type:"image" as const,image,key:image.src})),
];

export default function HomeHeroSlider(){
  const [activeIndex,setActiveIndex]=useState(0);
  const [isHovered,setIsHovered]=useState(false);
  const [hasFocus,setHasFocus]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(false);
  const [videoActivated,setVideoActivated]=useState(false);
  const touchStartX=useRef<number|null>(null);
  const videoRef=useRef<HTMLVideoElement>(null);

  const showPrevious=useCallback(()=>setActiveIndex(current=>(current-1+heroSlides.length)%heroSlides.length),[]);
  const showNext=useCallback(()=>setActiveIndex(current=>(current+1)%heroSlides.length),[]);

  useEffect(()=>{
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference=()=>setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change",updatePreference);
    return ()=>media.removeEventListener("change",updatePreference);
  },[]);

  useEffect(()=>{
    if(reducedMotion||isHovered||hasFocus||heroSlides.length<2)return;
    const timer=window.setInterval(showNext,AUTO_ROTATION_MS);
    return ()=>window.clearInterval(timer);
  },[activeIndex,hasFocus,isHovered,reducedMotion,showNext]);

  useEffect(()=>{
    const isVideoActive=heroSlides[activeIndex]?.type==="video";
    if(isVideoActive)setVideoActivated(true);
    const video=videoRef.current;
    if(!video)return;
    if(isVideoActive&&!reducedMotion)void video.play().catch(()=>{});
    else video.pause();
  },[activeIndex,reducedMotion,videoActivated]);

  function handleKeyDown(event:KeyboardEvent<HTMLElement>){
    if(event.key==="ArrowLeft"){event.preventDefault();showPrevious();}
    else if(event.key==="ArrowRight"){event.preventDefault();showNext();}
    else if(event.key==="Home"){event.preventDefault();setActiveIndex(0);}
    else if(event.key==="End"){event.preventDefault();setActiveIndex(heroSlides.length-1);}
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
      {heroSlides.map((slide,index)=>{
        const isActive=index===activeIndex;
        return <article className={`home-hero-slide${isActive?" is-active":""}`} aria-hidden={!isActive} aria-label={`${index+1} di ${heroSlides.length}`} aria-roledescription="slide" key={slide.key}>
          {slide.type==="image"?<Image src={slide.image.src} alt={isActive?slide.image.alt:""} fill priority={index===0} loading={index===0?undefined:"lazy"} sizes="100vw" style={{objectPosition:slide.image.objectPosition}}/>:<video ref={videoRef} muted playsInline loop preload="metadata" autoPlay={isActive&&!reducedMotion} poster={slide.poster} aria-label="Reel del NIS Gala Charity Night 2026" tabIndex={-1}>{videoActivated&&<source src={slide.src} type="video/mp4"/>}</video>}
        </article>;
      })}
    </div>
    <span className="home-hero-shade" aria-hidden="true"/>
    <div className="shell home-hero-slide-inner">
      <div className="home-hero-slide-copy">
        <h1>NIS Gala Charity Night 2026</h1>
        <a href="/eventi/nis-gala-2026" className="btn home-hero-cta">RIVIVI LA SERATA</a>
      </div>
    </div>
    <button className="home-hero-arrow is-previous" type="button" onClick={showPrevious} aria-label="Immagine precedente"><span aria-hidden="true">←</span></button>
    <button className="home-hero-arrow is-next" type="button" onClick={showNext} aria-label="Immagine successiva"><span aria-hidden="true">→</span></button>
    <div className="home-hero-indicators" aria-label="Seleziona un'immagine">
      {heroSlides.map((slide,index)=><button type="button" key={slide.key} className={index===activeIndex?"is-active":undefined} aria-label={`Mostra ${slide.type==="video"?"video":"immagine"} ${index+1} di ${heroSlides.length}`} aria-current={index===activeIndex?"true":undefined} onClick={()=>setActiveIndex(index)}><span/></button>)}
    </div>
    <div className="tricolor-swoosh" aria-hidden="true"/>
  </section>;
}
