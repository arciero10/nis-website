"use client";

import Image from "next/image";
import {useState} from "react";
import {newsArticles,newsCategories,type NewsArticle} from "@/data/news";

function formatDate(date:string){
  return new Intl.DateTimeFormat("it-IT",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(`${date}T00:00:00Z`));
}

function ArticleCard({article,featured=false}:{article:NewsArticle;featured?:boolean}){
  return <article className={`press-card${featured?" press-card-featured":""}`}>
    <div className={`press-card-source${article.sourceLogo?"":" press-card-source-fallback"}`}>
      {article.sourceLogo
        ?<Image src={article.sourceLogo} alt={`Logo ${article.sourceName}`} width={260} height={90} sizes="(max-width: 720px) 55vw, 220px"/>
        :<span>{article.sourceName}</span>}
    </div>
    <div className="press-card-content">
      <div className="press-card-meta"><strong>{article.sourceName}</strong><time dateTime={article.date}>{formatDate(article.date)}</time></div>
      <h3>{article.title}</h3>
      <p>{article.excerpt}</p>
      <a className="press-card-link" href={article.url} target="_blank" rel="noopener noreferrer" aria-label={`Leggi l’articolo su ${article.sourceName}`}>
        Leggi l’articolo <span aria-hidden="true">↗</span>
      </a>
    </div>
  </article>;
}

export default function NewsArchive(){
  const [activeCategory,setActiveCategory]=useState<(typeof newsCategories)[number]>("Tutte");
  const featuredArticles=newsArticles.filter(article=>article.featured);
  const archiveArticles=newsArticles.filter(article=>!article.featured&&(
    activeCategory==="Tutte"||article.category===activeCategory
  ));

  return <>
    <section className="press-section press-featured-section">
      <div className="shell">
        <header className="press-section-heading">
          <p>SELEZIONE EDITORIALE</p>
          <h2>In evidenza</h2>
        </header>
        <div className="press-feature-grid">
          {featuredArticles.map(article=><ArticleCard key={article.id} article={article} featured/>)}
        </div>
      </div>
    </section>

    <section className="press-section press-archive-section">
      <div className="shell">
        <header className="press-section-heading press-archive-heading">
          <div><p>PARLANO DI NIS</p><h2>Rassegna stampa</h2></div>
          <div className="press-filters" aria-label="Filtra gli articoli">
            {newsCategories.map(category=><button type="button" key={category} aria-pressed={activeCategory===category} onClick={()=>setActiveCategory(category)}>{category}</button>)}
          </div>
        </header>
        {archiveArticles.length>0?<div className="press-archive-grid">
          {archiveArticles.map(article=><ArticleCard key={article.id} article={article}/>)}
        </div>:<p className="press-empty" role="status">Non sono presenti articoli per questa categoria.</p>}
      </div>
    </section>
  </>;
}
