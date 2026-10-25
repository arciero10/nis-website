import Image from "next/image";
import Link from "next/link";
import type {Metadata} from "next";
import MetricStrip from "@/components/MetricStrip";
import ProjectFeature from "@/components/ProjectFeature";
import SectorGrid from "@/components/SectorGrid";
import StructuredData from "@/components/StructuredData";
import GalaTakeover from "@/components/GalaTakeover";
import HomeFeaturedSlider from "@/components/HomeFeaturedSlider";
import {createPageMetadata,organizationJsonLd,websiteJsonLd} from "@/lib/seo";

// Keep editorial homepage updates fresh across deployments instead of caching its HTML as immutable.
export const dynamic="force-dynamic";

export const metadata:Metadata=createPageMetadata({
  title:"Nazionale Italiana Sanitari | Sport, Salute e Solidarietà",
  description:"La Nazionale Italiana Sanitari unisce professionisti della salute, sport e solidarietà per sostenere progetti concreti di prevenzione, cura e inclusione.",
  path:"/",
});

export default function Home(){return <>
  <StructuredData data={[organizationJsonLd,websiteJsonLd]}/>
  <GalaTakeover/>
  <section className="home-hero">
    <Image className="home-bg-image" src="/images/hero-home.jpg" alt="Professionisti sanitari, sportivi e volontari NIS" fill priority sizes="100vw"/>
    <div className="home-overlay"/>
    <div className="shell home-content">
      <h1 className="brand-title"><span className="sr-only">Nazionale Italiana Sanitari. </span><b>NIS</b> is <em>NICE.</em></h1>
      <div className="brand-sub">Perché fare del bene è bello.</div>
      <h2 className="home-title">In campo per la salute.<br/>Uniti per la <span>vita.</span></h2>
      <p>La Nazionale Italiana Sanitari unisce professionisti della salute, sport e solidarietà per costruire progetti che migliorano concretamente la vita delle persone.</p>
      <div className="hero-actions hero-actions-single"><Link href="/dona" className="btn btn-blue hero-donate">DONA ORA</Link></div>
    </div>
    <div className="tricolor-swoosh"/>
  </section>

  <HomeFeaturedSlider/>

  <MetricStrip compact/>

  <section className="home-flow-section home-projects"><div className="shell">
    <div className="section-head home-flow-heading"><div><div className="eyebrow">PROGETTI</div><h2>La solidarietà diventa un risultato concreto.</h2></div><Link href="/progetti" className="section-link">Tutti i progetti <span aria-hidden="true">→</span></Link></div>
    <ProjectFeature/>
  </div></section>

  <section className="home-flow-section home-sectors"><div className="shell">
    <div className="section-head home-flow-heading"><div><div className="eyebrow">SETTORI</div><h2>Diversi sport. Un unico obiettivo.</h2></div><Link href="/settori" className="section-link">Tutti i settori <span aria-hidden="true">→</span></Link></div>
    <SectorGrid/>
  </div></section>

  <section className="home-closing"><div className="shell home-closing-inner">
    <div className="home-closing-copy"><div className="eyebrow white">BE NIS. BE NICE.</div><h2>Entra nella Community. Sostieni il cambiamento.</h2><p>Professionisti, sportivi, famiglie e sostenitori: insieme possiamo trasformare partecipazione e solidarietà in progetti concreti per la salute.</p></div>
    <div className="home-closing-actions"><Link href="/diventa-socio" className="btn home-closing-primary">ENTRA NELLA COMMUNITY</Link><Link href="/dona" className="btn home-closing-secondary">SOSTIENI I PROGETTI</Link></div>
  </div></section>
</>}

