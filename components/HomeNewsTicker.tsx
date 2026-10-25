import Link from "next/link";
import {newsItems,type NewsItem} from "@/data/news";

const orderedNews=[...newsItems].sort((a,b)=>b.date.localeCompare(a.date));

function shortDate(date:string){
  return new Intl.DateTimeFormat("it-IT",{day:"2-digit",month:"short",timeZone:"UTC"})
    .format(new Date(`${date}T00:00:00Z`))
    .replace(".","")
    .toUpperCase();
}

function NewsSequence({items,duplicate=false}:{items:readonly NewsItem[];duplicate?:boolean}){
  return <div className="home-news-ticker-sequence" aria-hidden={duplicate||undefined}>
    {items.map(item=><Link
      className="home-news-ticker-item"
      href={item.href}
      key={`${duplicate?"duplicate-":""}${item.id}`}
      tabIndex={duplicate?-1:undefined}
    >
      <time dateTime={item.date}>{shortDate(item.date)}</time>
      <span>{item.title}</span>
      <b aria-hidden="true">→</b>
    </Link>)}
  </div>;
}

export default function HomeNewsTicker(){
  return <section className="home-news-ticker" aria-label="Ultime notizie NIS">
    <div className="home-news-ticker-label">ULTIME NEWS</div>
    <div className="home-news-ticker-viewport">
      <div className="home-news-ticker-track">
        <NewsSequence items={orderedNews}/>
        <NewsSequence items={orderedNews} duplicate/>
      </div>
    </div>
  </section>;
}
