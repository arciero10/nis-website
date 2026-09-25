"use client";

import {useEffect} from "react";
import {usePathname} from "next/navigation";

const revealGroups=[
  ".metric",
  ".project-feature > *",
  ".sector-card",
  ".info-card",
  ".community-home-band-inner > *",
  ".donate-cta-inner > *",
  ".project-highlight > *",
  ".cards-4 > *",
  ".support-card",
  ".org-person-entry",
  ".org-sector-row",
  ".org-scientific-register article",
];

const singleRevealSelectors=[
  ".impact-heading",
  ".section-head",
  ".brand-divider-inner",
  ".org-pdf-panel",
  ".org-section-header",
  ".org-council",
  ".org-committee-section",
  ".org-science-objective",
  ".community-section-heading",
  ".community-paths",
];

const introSelectors=[
  ".home-content > *",
  ".page-hero .hero-content > *",
  ".battito-hero-content > *",
  ".community-hero-content > *",
  ".org-page-header h1",
];

export default function RevealOnScroll(){
  const pathname=usePathname();

  useEffect(()=>{
    const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealElements=new Set<HTMLElement>();

    revealGroups.forEach(selector=>{
      document.querySelectorAll<HTMLElement>(selector).forEach((element,index)=>{
        element.classList.add("reveal-item");
        element.style.setProperty("--reveal-delay",`${Math.min(index%4,3)*90}ms`);
        revealElements.add(element);
      });
    });

    singleRevealSelectors.forEach(selector=>{
      document.querySelectorAll<HTMLElement>(selector).forEach(element=>{
        element.classList.add("reveal-item");
        revealElements.add(element);
      });
    });

    document.querySelectorAll<HTMLElement>(".org-operation-column").forEach((element,index)=>{
      element.classList.add("reveal-item",index===0?"reveal-from-left":"reveal-from-right");
      revealElements.add(element);
    });

    const introElements=Array.from(document.querySelectorAll<HTMLElement>(introSelectors.join(",")));
    introElements.forEach((element,index)=>{
      element.classList.add("reveal-item","reveal-intro");
      element.style.setProperty("--reveal-delay",`${Math.min(index,5)*100}ms`);
    });

    if(reduceMotion){
      [...revealElements,...introElements].forEach(element=>element.classList.add("is-visible"));
      return;
    }

    document.body.classList.add("motion-ready");
    requestAnimationFrame(()=>introElements.forEach(element=>element.classList.add("is-visible")));

    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting) return;
        const element=entry.target as HTMLElement;
        element.classList.add("is-visible");
        observer.unobserve(element);
      });
    },{threshold:.12,rootMargin:"0px 0px -7%"});

    revealElements.forEach(element=>observer.observe(element));
    return ()=>{
      observer.disconnect();
      document.body.classList.remove("motion-ready");
    };
  },[pathname]);

  return null;
}
