import Image from "next/image";
import Link from "next/link";
import {newsItems} from "@/data/news";

const latestNews=[...newsItems].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);

function longDate(date:string){
  return new Intl.DateTimeFormat("it-IT",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"})
    .format(new Date(`${date}T00:00:00Z`));
}

export default function HomeLatestNews(){
  return <section className="home-section home-latest-news"><div className="shell">
    <div className="section-head home-latest-news-heading">
      <div><div className="eyebrow">ULTIME DALLA NIS</div><h2>Notizie, progetti e storie dalla nostra comunità.</h2></div>
      <Link href="/news" className="section-link">Tutte le news <span aria-hidden="true">→</span></Link>
    </div>
    <div className="nis-news-grid home-latest-news-grid">
      {latestNews.map(item=><Link className="nis-news-card home-latest-news-card" href={item.href} key={item.id}>
        <div className={`nis-news-media${item.imageFit==="contain"?" nis-news-media-contain":""}`}>
          <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 50vw, 33vw"/>
        </div>
        <div className="nis-news-content">
          <div className="nis-news-meta"><strong>{item.category}</strong><time dateTime={item.date}>{longDate(item.date)}</time></div>
          <h2>{item.title}</h2>
          <p>{item.excerpt}</p>
          <span className="nis-news-link">{item.linkLabel??"Leggi la notizia"} <span aria-hidden="true">→</span></span>
        </div>
      </Link>)}
    </div>
  </div></section>;
}
