"use client";

import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import {newsCategories,newsItems,type NewsItem} from "@/data/news";

function formatDate(date:string){
  return new Intl.DateTimeFormat("it-IT",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(`${date}T00:00:00Z`));
}

function NewsCard({item}:{item:NewsItem}){
  return <article className="nis-news-card">
    <div className={`nis-news-media${item.imageFit==="contain"?" nis-news-media-contain":""}`}>
      <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 50vw, 33vw"/>
    </div>
    <div className="nis-news-content">
      <div className="nis-news-meta"><strong>{item.category}</strong><time dateTime={item.date}>{formatDate(item.date)}</time></div>
      <h2>{item.title}</h2>
      <p>{item.excerpt}</p>
      <Link className="nis-news-link" href={item.href}>Approfondisci <span aria-hidden="true">→</span></Link>
    </div>
  </article>;
}

export default function NewsArchive(){
  const [activeCategory,setActiveCategory]=useState<(typeof newsCategories)[number]>("Tutte");
  const items=newsItems.filter(item=>activeCategory==="Tutte"||item.category===activeCategory);

  return <section className="nis-news-section">
    <div className="shell">
      <header className="nis-news-heading">
        <div><p>DAL MONDO NIS</p><h2>Ultimi aggiornamenti</h2></div>
        <div className="nis-news-filters" aria-label="Filtra le news">
          {newsCategories.map(category=><button type="button" key={category} aria-pressed={activeCategory===category} onClick={()=>setActiveCategory(category)}>{category}</button>)}
        </div>
      </header>
      <div className="nis-news-grid">{items.map(item=><NewsCard key={item.id} item={item}/>)}</div>
    </div>
  </section>;
}
