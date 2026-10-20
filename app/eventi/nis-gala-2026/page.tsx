import Image from "next/image";
import Link from "next/link";
import type {Metadata} from "next";
import GalaSponsorStrip from "@/components/GalaSponsorStrip";
import StructuredData from "@/components/StructuredData";
import {galaPromotion} from "@/data/gala-promotion";
import {createBreadcrumbJsonLd,createPageMetadata,SITE_URL} from "@/lib/seo";

const title="NIS Gala Charity Night 2026 | Nazionale Italiana Sanitari";
const description="Il 28 ottobre 2026 a Roma il NIS Gala Charity Night: una serata di beneficenza a sostegno dei progetti della Nazionale Italiana Sanitari.";

export const metadata:Metadata=createPageMetadata({title,description,path:galaPromotion.publicPath,image:galaPromotion.artwork});

const eventJsonLd={
  "@context":"https://schema.org",
  "@type":"Event",
  name:"The NIS Gala Charity Night",
  description,
  startDate:"2026-10-28",
  eventStatus:"https://schema.org/EventScheduled",
  eventAttendanceMode:"https://schema.org/OfflineEventAttendanceMode",
  url:`${SITE_URL}${galaPromotion.publicPath}`,
  image:[`${SITE_URL}${galaPromotion.artwork}`],
  location:{"@type":"Place",name:"Another Studio",address:{"@type":"PostalAddress",addressLocality:"Roma",addressCountry:"IT"}},
  organizer:{"@type":"Organization",name:"Nazionale Italiana Sanitari",url:SITE_URL},
};

export default function GalaPublicPage(){return <>
  <StructuredData data={[eventJsonLd,createBreadcrumbJsonLd([{name:"Home",path:"/"},{name:"Eventi",path:"/eventi"},{name:"NIS Gala Charity Night",path:galaPromotion.publicPath}])]}/>
  <article className="gala-public-page">
    <section className="gala-public-hero">
      <div className="shell gala-public-hero-inner">
        <div className="gala-public-artwork"><Image src={galaPromotion.artwork} alt="The NIS Gala Charity Night, 28 ottobre 2026, Another Studio Roma" fill priority sizes="(max-width: 900px) calc(100vw - 40px), 58vw"/></div>
        <div className="gala-public-copy">
          <p className="gala-kicker">28 OTTOBRE 2026 · ROMA</p>
          <h1>THE NIS GALA<span>CHARITY NIGHT</span></h1>
          <p className="gala-public-lead">{galaPromotion.description}</p>
          <dl><div><dt>Quando</dt><dd>28 ottobre 2026</dd></div><div><dt>Dove</dt><dd>Another Studio, Roma</dd></div></dl>
          <Link href={galaPromotion.checkoutPath} className="btn gala-primary-cta">RICHIEDI IL TUO INVITO</Link>
        </div>
      </div>
    </section>
    <section className="gala-public-details"><div className="shell gala-public-details-inner">
      <div><p className="eyebrow">UNA SERATA CHE LASCIA IL SEGNO</p><h2>Insieme, per trasformare la partecipazione in sostegno concreto.</h2></div>
      <p>Il NIS Gala Charity Night riunisce la comunità della Nazionale Italiana Sanitari per sostenere progetti dedicati alla salute, alla prevenzione e alla solidarietà.</p>
    </div></section>
    <div className="shell gala-public-sponsors"><GalaSponsorStrip/></div>
  </article>
</>}

