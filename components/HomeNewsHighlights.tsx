import Image from "next/image";
import Link from "next/link";
import {newsItems} from "@/data/news";

const dateFormatter=new Intl.DateTimeFormat("it-IT",{day:"2-digit",month:"long",year:"numeric",timeZone:"Europe/Rome"});

export default function HomeNewsHighlights(){
  const highlights=[...newsItems].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);

  return <section className="home-news-highlights" aria-labelledby="home-news-title"><div className="shell">
    <div className="section-head home-news-heading">
      <div><div className="eyebrow">DAL MONDO NIS</div><h2 id="home-news-title">Ultime dalla NIS</h2></div>
      <Link href="/news" className="section-link">Tutte le news <span aria-hidden="true">→</span></Link>
    </div>
    <div className="home-news-grid">
      {highlights.map(item=><article className="home-news-card" key={item.id}>
        <Link href={item.href} className={`home-news-media${item.imageFit==="contain"?" is-contained":""}`} aria-label={item.title}>
          <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 33vw, 380px" style={{objectFit:item.imageFit??"cover"}}/>
        </Link>
        <div className="home-news-content">
          <p><span>{item.category}</span><time dateTime={item.date}>{dateFormatter.format(new Date(`${item.date}T12:00:00Z`))}</time></p>
          <h3><Link href={item.href}>{item.title}</Link></h3>
          <Link href={item.href} className="home-news-link">{item.linkLabel??"Leggi la notizia"} <span aria-hidden="true">→</span></Link>
        </div>
      </article>)}
    </div>
  </div></section>;
}
