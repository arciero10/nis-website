import Image from "next/image";
import Link from "next/link";
import type {Metadata} from "next";
import MetricStrip from "@/components/MetricStrip";
import ProjectFeature from "@/components/ProjectFeature";
import SectorGrid from "@/components/SectorGrid";
import StructuredData from "@/components/StructuredData";
import GalaTakeover from "@/components/GalaTakeover";
import GalaHomeBanner from "@/components/GalaHomeBanner";
import HomeLatestNews from "@/components/HomeLatestNews";
import HomeFeaturedSlider from "@/components/HomeFeaturedSlider";
import {ScuolaVivaHomeFeature} from "@/components/ScuolaVivaFeatures";
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

  <GalaHomeBanner/>

  <ScuolaVivaHomeFeature/>

  <MetricStrip/>

  <section className="home-section project-section"><div className="shell"><ProjectFeature/></div></section>

  <section className="brand-divider" aria-label="NIS is NICE">
    <div className="shell brand-divider-inner">
      <Image src="/images/brand/nis-is-nice.png" alt="NIS is NICE - Nazionale Italiana Sanitari" width={1942} height={809} sizes="(max-width: 720px) calc(100vw - 48px), 820px"/>
    </div>
  </section>

  <section className="home-section soft sectors-section"><div className="shell">
    <div className="section-head"><div><div className="eyebrow">I NOSTRI SETTORI</div><h2>Diversi sport. Un unico obiettivo.</h2></div><Link href="/settori" className="section-link">Tutti i settori <span aria-hidden="true">→</span></Link></div>
    <SectorGrid/>
  </div></section>

  <HomeLatestNews/>

  <section className="community-home-band"><div className="shell community-home-band-inner">
    <div><div className="eyebrow white">BE NIS. BE NICE.</div><h2>Entra nella Community NIS</h2><p>Medici, sanitari, sportivi, studenti, sostenitori e famiglie: scegli il modo più adatto per vivere e sostenere la community NIS.</p></div>
    <Link href="/diventa-socio" className="btn community-home-button">SCOPRI BE NIS. BE NICE.</Link>
  </div></section>

  <section className="donate-cta"><div className="shell donate-cta-inner"><div><div className="eyebrow white">SOSTIENI I PROGETTI NIS</div><h2>Ogni contributo può diventare cura, prevenzione e futuro.</h2></div><Link href="/dona" className="btn btn-blue">DONA ORA</Link></div></section>
</>}

