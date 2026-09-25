"use client";

import Image from "next/image";
import {useState} from "react";
import {pressArticles,pressCategories,type PressArticle} from "@/data/press";

function formatDate(date:string){
  return new Intl.DateTimeFormat("it-IT",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(`${date}T00:00:00Z`));
}

function PressCard({article}:{article:PressArticle}){
  const logoClass=article.logoTreatment?` press-card-source-logo-${article.logoTreatment}`:"";
  return <article className="press-card">
    <div className={`press-card-source${article.sourceLogo?"":" press-card-source-fallback"}`}>
      {article.sourceLogo
        ?<span className={`press-card-source-logo${logoClass}`}><Image src={article.sourceLogo} alt={`Logo ${article.sourceName}`} fill sizes="(max-width: 720px) 55vw, 260px"/></span>
        :<span>{article.sourceName}</span>}
    </div>
    <div className="press-card-content">
      <div className="press-card-meta"><strong>{article.sourceName}</strong><time dateTime={article.date}>{formatDate(article.date)}</time></div>
      <h2>{article.title}</h2>
      <p>{article.excerpt}</p>
      <a className="press-card-link" href={article.url} target="_blank" rel="noopener noreferrer" aria-label={`Leggi l’articolo su ${article.sourceName}`}>
        Leggi l’articolo <span aria-hidden="true">↗</span>
      </a>
    </div>
  </article>;
}

export default function PressArchive(){
  const [activeCategory,setActiveCategory]=useState<(typeof pressCategories)[number]>("Tutte");
  const articles=pressArticles.filter(article=>activeCategory==="Tutte"||article.category===activeCategory);

  return <section className="press-section press-archive-section">
    <div className="shell">
      <header className="press-section-heading press-archive-heading">
        <div><p>RASSEGNA STAMPA</p><h2>Le fonti che raccontano NIS</h2></div>
        <div className="press-filters" aria-label="Filtra gli articoli">
          {pressCategories.map(category=><button type="button" key={category} aria-pressed={activeCategory===category} onClick={()=>setActiveCategory(category)}>{category}</button>)}
        </div>
      </header>
      {articles.length>0?<div className="press-archive-grid">
        {articles.map(article=><PressCard key={article.id} article={article}/>) }
      </div>:<p className="press-empty" role="status">Non sono presenti articoli per questa categoria.</p>}
    </div>
  </section>;
}
