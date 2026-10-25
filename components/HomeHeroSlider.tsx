"use client";

import Image from "next/image";
import Link from "next/link";
import {useCallback,useEffect,useState,type FocusEvent,type KeyboardEvent} from "react";
import {newsItems,type NewsItem} from "@/data/news";
import {galaPromotion} from "@/data/gala-promotion";

const AUTO_ROTATION_MS=7000;
type HeroSlide={
  id:string;
  kind:"identity"|"editorial";
  eyebrow:string;
  title:string;
  description:string;
  href:string;
  cta:string;
  image:string;
  imageAlt:string;
  imageWidth:number;
  imageHeight:number;
  imageFit?:NewsItem["imageFit"];
  date?:string;
};

const identitySlide:HeroSlide={
  id:"nis-identity",
  kind:"identity",
  eyebrow:"Perché fare del bene è bello.",
  title:"In campo per la salute. Uniti per la vita.",
  description:"La Nazionale Italiana Sanitari unisce professionisti della salute, sport e solidarietà per costruire progetti che migliorano concretamente la vita delle persone.",
  href:"/dona",
  cta:"DONA ORA",
  image:"/images/hero-home.jpg",
  imageAlt:"Professionisti sanitari, sportivi e volontari NIS",
  imageWidth:1920,
  imageHeight:1080,
};

const galaSlide:HeroSlide={
  id:"nis-gala-2026",
  kind:"editorial",
  eyebrow:"Evento",
  title:`${galaPromotion.title} ${galaPromotion.subtitle}`,
  description:galaPromotion.description,
  href:galaPromotion.publicPath,
  cta:"SCOPRI L'EVENTO",
  image:galaPromotion.artwork,
  imageAlt:"The NIS Gala Charity Night, 28 ottobre 2026, Roma",
  imageWidth:1200,
  imageHeight:630,
  date:galaPromotion.dateIso,
};

const orderedNews=[...newsItems].sort((a,b)=>b.date.localeCompare(a.date));
const editorialSlides:HeroSlide[]=orderedNews.slice(0,3).map(item=>({
  id:item.id,
  kind:"editorial",
  eyebrow:item.category,
  title:item.title,
  description:item.excerpt,
  href:item.href,
  cta:item.linkLabel?.toUpperCase()??"SCOPRI",
  image:item.image,
  imageAlt:item.imageAlt,
  imageWidth:item.imageWidth,
  imageHeight:item.imageHeight,
  imageFit:item.imageFit,
  date:item.date,
}));
const slides=[identitySlide,...(galaPromotion.enabled?[galaSlide]:[]),...editorialSlides].slice(0,5);

function longDate(date:string){
  return new Intl.DateTimeFormat("it-IT",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"})
    .format(new Date(`${date}T00:00:00Z`));
}

export default function HomeHeroSlider(){
  const [activeIndex,setActiveIndex]=useState(0);
  const [isHovered,setIsHovered]=useState(false);
  const [hasFocus,setHasFocus]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(false);

  const showPrevious=useCallback(()=>setActiveIndex(current=>(current-1+slides.length)%slides.length),[]);
  const showNext=useCallback(()=>setActiveIndex(current=>(current+1)%slides.length),[]);

  useEffect(()=>{
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference=()=>setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change",updatePreference);
    return ()=>media.removeEventListener("change",updatePreference);
  },[]);

  useEffect(()=>{
    if(reducedMotion||isHovered||hasFocus||slides.length<2)return;
    const timer=window.setInterval(showNext,AUTO_ROTATION_MS);
    return ()=>window.clearInterval(timer);
  },[activeIndex,hasFocus,isHovered,reducedMotion,showNext]);

  function handleKeyDown(event:KeyboardEvent<HTMLElement>){
    if(event.key==="ArrowLeft"){event.preventDefault();showPrevious();}
    else if(event.key==="ArrowRight"){event.preventDefault();showNext();}
    else if(event.key==="Home"){event.preventDefault();setActiveIndex(0);}
    else if(event.key==="End"){event.preventDefault();setActiveIndex(slides.length-1);}
  }

  function handleBlur(event:FocusEvent<HTMLElement>){
    if(!event.currentTarget.contains(event.relatedTarget))setHasFocus(false);
  }

  return <section
    className="home-hero-slider"
    aria-label="NIS, notizie ed eventi in evidenza"
    aria-roledescription="carosello"
    onMouseEnter={()=>setIsHovered(true)}
    onMouseLeave={()=>setIsHovered(false)}
    onFocus={()=>setHasFocus(true)}
    onBlur={handleBlur}
    onKeyDown={handleKeyDown}
  >
    <div className="home-hero-slides">
      {slides.map((slide,index)=>{
        const isActive=index===activeIndex;
        const imageClass=[slide.imageFit==="contain"?"is-contained":"",slide.imageHeight>slide.imageWidth?"is-portrait":""].filter(Boolean).join(" ");
        return <article className={`home-hero-slide${isActive?" is-active":""}${slide.kind==="identity"?" is-identity":""}`} aria-hidden={!isActive} aria-label={`${index+1} di ${slides.length}`} aria-roledescription="slide" key={slide.id}>
          <Image className={imageClass} src={slide.image} alt={slide.imageAlt} fill priority={index===0} loading={index===0?undefined:"lazy"} sizes="100vw"/>
          <span className="home-hero-shade" aria-hidden="true"/>
          <div className="shell home-hero-slide-inner">
            <div className="home-hero-slide-copy">
              {slide.kind==="identity"?<>
                <p className="home-hero-brand"><strong>NIS</strong> is <em>NICE.</em></p>
                <p className="home-hero-tagline">{slide.eyebrow}</p>
              </>:<div className="home-hero-meta"><strong>{slide.eyebrow}</strong>{slide.date&&<time dateTime={slide.date}>{longDate(slide.date)}</time>}</div>}
              {slide.kind==="identity"?<h1>{slide.title}</h1>:<h2>{slide.title}</h2>}
              <p className="home-hero-description">{slide.description}</p>
              <Link href={slide.href} className="btn btn-blue home-hero-cta" tabIndex={isActive?0:-1}>{slide.cta}</Link>
            </div>
          </div>
        </article>;
      })}
    </div>
    <button className="home-hero-arrow is-previous" type="button" onClick={showPrevious} aria-label="Contenuto precedente"><span aria-hidden="true">←</span></button>
    <button className="home-hero-arrow is-next" type="button" onClick={showNext} aria-label="Contenuto successivo"><span aria-hidden="true">→</span></button>
    <div className="home-hero-indicators" aria-label="Seleziona un contenuto">
      {slides.map((slide,index)=><button type="button" key={slide.id} className={index===activeIndex?"is-active":undefined} aria-label={`Mostra contenuto ${index+1}: ${slide.title}`} aria-current={index===activeIndex?"true":undefined} onClick={()=>setActiveIndex(index)}><span/></button>)}
    </div>
    <div className="tricolor-swoosh" aria-hidden="true"/>
  </section>;
}
