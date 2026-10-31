import Image from "next/image";
import PageHero from "@/components/PageHero";
import GalaSponsorStrip from "@/components/GalaSponsorStrip";
import {galaEventGalleryImages} from "@/data/gala-gallery";
import {createPageMetadata} from "@/lib/seo";
import {galaPromotion} from "@/data/gala-promotion";
import {listPublicEvents} from "@/lib/ticketing/public-events";

// Keep the event listing fresh across deployments instead of caching its HTML as immutable.
export const dynamic="force-dynamic";

export const metadata=createPageMetadata({title:"Eventi NIS | Sport, salute e prevenzione",description:"Scopri gli eventi sportivi, le iniziative solidali e le giornate dedicate alla prevenzione organizzate dalla Nazionale Italiana Sanitari.",path:"/eventi"});

const eventDate=(value:string|null)=>value?new Intl.DateTimeFormat("it-IT",{dateStyle:"long",timeStyle:"short",timeZone:"Europe/Rome"}).format(new Date(value)):"Data da definire";

export default async function Page(){const events=(await listPublicEvents()).filter(event=>event.slug!=="nis-gala-2026");return <>
  <PageHero eyebrow="EVENTI" title="Incontrarsi per" accent="generare impatto." intro="Eventi sportivi, iniziative solidali, giornate di prevenzione e appuntamenti associativi. Occasioni per condividere valori, costruire reti e fare la differenza, insieme." image="/images/hero-events.jpg" path="/eventi"/>
  <section className="section soft"><div className="shell">
    <div className="section-head gala-events-heading"><div><div className="eyebrow">ARCHIVIO EVENTI</div><h2>Rivivi gli appuntamenti NIS.</h2></div></div>
    <article className="gala-event-card is-concluded">
      <a href={galaPromotion.publicPath} className="gala-event-card-artwork" aria-label="Rivivi il NIS Gala Charity Night 2026">
        <Image src={galaEventGalleryImages[0].src} alt={galaEventGalleryImages[0].alt} fill sizes="(max-width: 720px) calc(100vw - 40px), 56vw" style={{objectPosition:galaEventGalleryImages[0].objectPosition}}/>
      </a>
      <div className="gala-event-card-copy">
        <p className="gala-kicker">EVENTO CONCLUSO</p>
        <h2>NIS Gala Charity Night 2026</h2>
        <p>Rivivi la serata attraverso il racconto editoriale, le immagini, i progetti sostenuti e le testimonianze della comunità NIS.</p>
        <dl><div><dt>Data</dt><dd>28 ottobre 2026</dd></div><div><dt>Luogo</dt><dd>Another Studio, Roma</dd></div></dl>
        <a href={galaPromotion.publicPath} className="btn btn-blue">RIVIVI L&apos;EVENTO</a>
      </div>
      <GalaSponsorStrip className="gala-event-card-sponsors"/>
    </article>
    {events.length>0&&<div className="public-events-grid" aria-label="Altri eventi NIS">{events.map(event=><article className="public-event-list-card" key={event.id}>{event.coverImage&&<a className="public-event-list-cover" href={`/eventi/${event.slug}`} aria-label={`Scopri ${event.title}`}><Image src={event.coverImage} alt="" fill sizes="(max-width: 720px) calc(100vw - 40px), 42vw"/></a>}<div><span>{event.status==="OPEN"?"ISCRIZIONI APERTE":event.status}</span><h3>{event.title}</h3><p>{event.description}</p><dl><div><dt>Quando</dt><dd>{eventDate(event.eventDate)}</dd></div><div><dt>Dove</dt><dd>{event.location||"Da definire"}</dd></div></dl><a className="btn btn-blue" href={`/eventi/${event.slug}`}>DETTAGLI EVENTO</a></div></article>)}</div>}
  </div></section>
</>}
