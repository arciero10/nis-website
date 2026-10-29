import Image from "next/image";
import type {Metadata} from "next";
import GalaEventArchive from "@/components/GalaEventArchive";
import StructuredData from "@/components/StructuredData";
import {galaEventGalleryImages} from "@/data/gala-gallery";
import {galaPromotion} from "@/data/gala-promotion";
import {createBreadcrumbJsonLd,createPageMetadata,SITE_URL} from "@/lib/seo";

const title="NIS Gala Charity Night 2026 | Nazionale Italiana Sanitari";
const description="Rivivi il NIS Gala Charity Night del 28 ottobre 2026 a Roma: immagini, progetti, testimonianze e momenti di una serata dedicata alla solidarietà.";
const heroImage=galaEventGalleryImages[0];

export const metadata:Metadata=createPageMetadata({title,description,path:galaPromotion.publicPath,image:heroImage.src});

const eventJsonLd={
  "@context":"https://schema.org",
  "@type":"Event",
  name:"NIS Gala Charity Night",
  description,
  startDate:"2026-10-28",
  endDate:"2026-10-28",
  eventStatus:"https://schema.org/EventCompleted",
  eventAttendanceMode:"https://schema.org/OfflineEventAttendanceMode",
  url:`${SITE_URL}${galaPromotion.publicPath}`,
  image:[`${SITE_URL}${heroImage.src}`],
  location:{"@type":"Place",name:"Another Studio",address:{"@type":"PostalAddress",streetAddress:"Via di Pietralata 183",postalCode:"00158",addressLocality:"Roma",addressRegion:"RM",addressCountry:"IT"}},
  organizer:{"@type":"Organization",name:"Nazionale Italiana Sanitari",url:SITE_URL},
  performer:[
    {"@type":"Person",name:"Alessandro Ristori"},
    {"@type":"MusicGroup",name:"The Portofinos"},
  ],
  offers:{
    "@type":"Offer",
    url:`${SITE_URL}${galaPromotion.publicPath}`,
    price:"200",
    priceCurrency:"EUR",
    availability:"https://schema.org/SoldOut",
  },
};

export default function GalaPublicPage(){return <>
  <StructuredData data={[eventJsonLd,createBreadcrumbJsonLd([{name:"Home",path:"/"},{name:"Eventi",path:"/eventi"},{name:"NIS Gala Charity Night",path:galaPromotion.publicPath}])]}/>
  <article className="gala-public-page">
    <section className="gala-archive-hero">
      <div className="gala-archive-hero-image"><Image src={heroImage.src} alt={heroImage.alt} fill priority sizes="100vw" style={{objectPosition:heroImage.objectPosition}}/></div>
      <div className="gala-archive-hero-overlay"/>
      <div className="shell gala-archive-hero-content">
        <p className="eyebrow white">ARCHIVIO EVENTO</p>
        <h1>NIS Gala Charity Night 2026</h1>
        <p className="gala-archive-subtitle">Una serata di solidarietà, salute e sport</p>
        <div className="gala-archive-event-meta"><span>28 ottobre 2026</span><span>Another Studio, Roma</span></div>
      </div>
    </section>
    <GalaEventArchive/>
  </article>
</>}

