"use client";

import Image from "next/image";
import Link from "next/link";
import {useCallback,useEffect,useState,type FocusEvent,type KeyboardEvent} from "react";
import {newsItems} from "@/data/news";

const AUTO_ROTATION_MS=7000;
const featuredItems=[...newsItems].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);

function longDate(date:string){
  return new Intl.DateTimeFormat("it-IT",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"})
    .format(new Date(`${date}T00:00:00Z`));
}

export default function HomeFeaturedSlider(){
  const [activeIndex,setActiveIndex]=useState(0);
  const [isHovered,setIsHovered]=useState(false);
  const [hasFocus,setHasFocus]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(false);

  const showPrevious=useCallback(()=>{
    setActiveIndex(current=>(current-1+featuredItems.length)%featuredItems.length);
  },[]);
  const showNext=useCallback(()=>{
    setActiveIndex(current=>(current+1)%featuredItems.length);
  },[]);

  useEffect(()=>{
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference=()=>setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change",updatePreference);
    return ()=>media.removeEventListener("change",updatePreference);
  },[]);

  useEffect(()=>{
    if(reducedMotion||isHovered||hasFocus||featuredItems.length<2)return;
    const timer=window.setInterval(showNext,AUTO_ROTATION_MS);
    return ()=>window.clearInterval(timer);
  },[activeIndex,hasFocus,isHovered,reducedMotion,showNext]);

  function handleKeyDown(event:KeyboardEvent<HTMLElement>){
    if(event.key==="ArrowLeft"){
      event.preventDefault();
      showPrevious();
    }else if(event.key==="ArrowRight"){
      event.preventDefault();
      showNext();
    }else if(event.key==="Home"){
      event.preventDefault();
      setActiveIndex(0);
    }else if(event.key==="End"){
      event.preventDefault();
      setActiveIndex(featuredItems.length-1);
    }
  }

  function handleBlur(event:FocusEvent<HTMLElement>){
    if(!event.currentTarget.contains(event.relatedTarget))setHasFocus(false);
  }

  return <section
    className="home-featured-slider"
    aria-label="Notizie ed eventi in evidenza"
    aria-roledescription="carosello"
    onMouseEnter={()=>setIsHovered(true)}
    onMouseLeave={()=>setIsHovered(false)}
    onFocus={()=>setHasFocus(true)}
    onBlur={handleBlur}
    onKeyDown={handleKeyDown}
  >
    <div className="shell home-featured-slider-shell">
      <div className="home-featured-slider-frame">
        <div className="home-featured-slides">
          {featuredItems.map((item,index)=>{
            const isActive=index===activeIndex;
            const isPortrait=item.imageHeight>item.imageWidth;
            return <article
              className={`home-featured-slide${isActive?" is-active":""}`}
              aria-hidden={!isActive}
              aria-label={`${index+1} di ${featuredItems.length}`}
              aria-roledescription="slide"
              key={item.id}
            >
              <Link href={item.href} className="home-featured-slide-link" tabIndex={isActive?0:-1}>
                <Image
                  className={isPortrait?"is-portrait":""}
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  priority={index===0}
                  loading={index===0?undefined:"lazy"}
                  sizes="(max-width: 720px) 100vw, (max-width: 1280px) calc(100vw - 72px), 1200px"
                />
                <span className="home-featured-slide-shade" aria-hidden="true"/>
                <div className="home-featured-slide-copy">
                  <div className="home-featured-slide-meta">
                    <strong>{item.category}</strong>
                    <time dateTime={item.date}>{longDate(item.date)}</time>
                  </div>
                  <h2>{item.title}</h2>
                  <span className="home-featured-slide-cta">
                    {item.category==="Interviste"?"LEGGI":"SCOPRI"} <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </article>;
          })}
        </div>

        <button className="home-featured-arrow is-previous" type="button" onClick={showPrevious} aria-label="Notizia precedente">
          <span aria-hidden="true">←</span>
        </button>
        <button className="home-featured-arrow is-next" type="button" onClick={showNext} aria-label="Notizia successiva">
          <span aria-hidden="true">→</span>
        </button>

        <div className="home-featured-indicators" aria-label="Seleziona una notizia">
          {featuredItems.map((item,index)=><button
            type="button"
            key={item.id}
            className={index===activeIndex?"is-active":undefined}
            aria-label={`Mostra notizia ${index+1}: ${item.title}`}
            aria-current={index===activeIndex?"true":undefined}
            onClick={()=>setActiveIndex(index)}
          ><span/></button>)}
        </div>
      </div>
    </div>
  </section>;
}
