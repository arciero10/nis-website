import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import GalaSponsorStrip from "@/components/GalaSponsorStrip";
import {createPageMetadata} from "@/lib/seo";
import {galaPromotion} from "@/data/gala-promotion";

// Keep the event listing fresh across deployments instead of caching its HTML as immutable.
export const dynamic="force-dynamic";

export const metadata=createPageMetadata({title:"Eventi NIS | Sport, salute e prevenzione",description:"Scopri gli eventi sportivi, le iniziative solidali e le giornate dedicate alla prevenzione organizzate dalla Nazionale Italiana Sanitari.",path:"/eventi"});

export default function Page(){return <>
  <PageHero eyebrow="EVENTI" title="Incontrarsi per" accent="generare impatto." intro="Eventi sportivi, iniziative solidali, giornate di prevenzione e appuntamenti associativi. Occasioni per condividere valori, costruire reti e fare la differenza, insieme." image="/images/hero-events.jpg" path="/eventi"/>
  <section className="section soft"><div className="shell">
    <div className="section-head gala-events-heading"><div><div className="eyebrow">EVENTO IN EVIDENZA</div><h2>Il prossimo appuntamento NIS.</h2></div></div>
    <article className="gala-event-card">
      <Link href={galaPromotion.publicPath} className="gala-event-card-artwork" aria-label="Scopri The NIS Gala Charity Night">
        <Image src={galaPromotion.artwork} alt="The NIS Gala Charity Night, 28 ottobre 2026, Another Studio Roma" fill sizes="(max-width: 720px) calc(100vw - 40px), 56vw"/>
      </Link>
      <div className="gala-event-card-copy">
        <p className="gala-kicker">28 OTTOBRE 2026 · ROMA</p>
        <h2>THE NIS GALA<span>CHARITY NIGHT</span></h2>
        <p>{galaPromotion.description}</p>
        <dl><div><dt>Data</dt><dd>28 ottobre 2026</dd></div><div><dt>Luogo</dt><dd>Another Studio, Roma</dd></div></dl>
        <Link href={galaPromotion.publicPath} className="btn btn-blue">SCOPRI L&apos;EVENTO</Link>
      </div>
      <GalaSponsorStrip className="gala-event-card-sponsors"/>
    </article>
  </div></section>
</>}
