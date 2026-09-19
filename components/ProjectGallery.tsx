"use client";

import Image from "next/image";
import {useEffect,useRef,useState} from "react";

export type ProjectGalleryImage={
  src:string;
  width:number;
  height:number;
  alt:string;
};

export default function ProjectGallery({images}:{images:ProjectGalleryImage[]}){
  const [active,setActive]=useState<number|null>(null);
  const closeButton=useRef<HTMLButtonElement>(null);
  const triggers=useRef<Array<HTMLButtonElement|null>>([]);
  const touchStart=useRef<number|null>(null);

  const close=()=>setActive(null);
  const previous=()=>setActive(current=>current===null?null:(current-1+images.length)%images.length);
  const next=()=>setActive(current=>current===null?null:(current+1)%images.length);

  useEffect(()=>{
    if(active===null)return;
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    closeButton.current?.focus();

    const onKeyDown=(event:KeyboardEvent)=>{
      if(event.key==="Escape"){
        const triggerIndex=active;
        close();
        window.setTimeout(()=>triggers.current[triggerIndex]?.focus(),0);
      }
      if(event.key==="ArrowLeft")previous();
      if(event.key==="ArrowRight")next();
      if(event.key==="Tab"){
        const controls=Array.from(document.querySelectorAll<HTMLElement>(".gallery-lightbox button"));
        const first=controls[0];
        const last=controls[controls.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      }
    };
    window.addEventListener("keydown",onKeyDown);
    return ()=>{
      document.body.style.overflow=previousOverflow;
      window.removeEventListener("keydown",onKeyDown);
    };
  },[active]);

  const closeAndRestore=()=>{
    const triggerIndex=active;
    close();
    window.setTimeout(()=>{if(triggerIndex!==null)triggers.current[triggerIndex]?.focus();},0);
  };

  return <>
    <div className="battito-gallery">
      {images.map((image,index)=><figure key={image.src}>
        <button ref={element=>{triggers.current[index]=element;}} type="button" className="gallery-trigger" onClick={()=>setActive(index)} aria-label={`Apri immagine ${index+1} di ${images.length}: ${image.alt}`}>
          <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 720px) calc(100vw - 40px), 50vw"/>
          <span className="gallery-zoom" aria-hidden="true">+</span>
        </button>
      </figure>)}
    </div>

    {active!==null&&<div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`Immagine ${active+1} di ${images.length}`} onMouseDown={event=>{if(event.target===event.currentTarget)closeAndRestore();}} onTouchStart={event=>{touchStart.current=event.changedTouches[0].clientX;}} onTouchEnd={event=>{
      if(touchStart.current===null)return;
      const distance=event.changedTouches[0].clientX-touchStart.current;
      if(Math.abs(distance)>55)(distance>0?previous:next)();
      touchStart.current=null;
    }}>
      <button ref={closeButton} type="button" className="lightbox-close" onClick={closeAndRestore} aria-label="Chiudi galleria">&times;</button>
      <button type="button" className="lightbox-arrow lightbox-previous" onClick={previous} aria-label="Immagine precedente">&#8249;</button>
      <figure className="lightbox-figure">
        <Image src={images[active].src} alt={images[active].alt} width={images[active].width} height={images[active].height} sizes="96vw" priority/>
        <figcaption>{active+1} / {images.length}</figcaption>
      </figure>
      <button type="button" className="lightbox-arrow lightbox-next" onClick={next} aria-label="Immagine successiva">&#8250;</button>
    </div>}
  </>;
}
