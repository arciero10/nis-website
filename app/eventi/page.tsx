import Image from "next/image";
import PageHero from "@/components/PageHero";
import GalaSponsorStrip from "@/components/GalaSponsorStrip";
import {galaEventGalleryImages} from "@/data/gala-gallery";
import {createPageMetadata} from "@/lib/seo";
import {galaPromotion} from "@/data/gala-promotion";

// Keep the event listing fresh across deployments instead of caching its HTML as immutable.
export const dynamic="force-dynamic";

export const metadata=createPageMetadata({title:"Eventi NIS | Sport, salute e prevenzione",description:"Scopri gli eventi sportivi, le iniziative solidali e le giornate dedicate alla prevenzione organizzate dalla Nazionale Italiana Sanitari.",path:"/eventi"});

export default function Page(){return <>
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
  </div></section>
</>}
