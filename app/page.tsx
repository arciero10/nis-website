import Image from "next/image";
import Link from "next/link";
import type {Metadata} from "next";
import MetricStrip from "@/components/MetricStrip";
import ProjectFeature from "@/components/ProjectFeature";
import SectorGrid from "@/components/SectorGrid";

export const metadata:Metadata={alternates:{canonical:"/"}};

export default function Home(){return <>
  <section className="home-hero">
    <Image className="home-bg-image" src="/images/hero-home.jpg" alt="Professionisti sanitari, sportivi e volontari NIS" fill priority sizes="100vw"/>
    <div className="home-overlay"/>
    <div className="shell home-content">
      <h1 className="brand-title"><b>NIS</b> is <em>NICE.</em></h1>
      <div className="brand-sub">Perché fare del bene è bello.</div>
      <h2 className="home-title">In campo per la salute.<br/>Uniti per la <span>vita.</span></h2>
      <p>La Nazionale Italiana Sanitari unisce professionisti della salute, sport e solidarietà per costruire progetti che migliorano concretamente la vita delle persone.</p>
      <div className="hero-actions hero-actions-single"><Link href="https://www.paypal.com/fundraiser/charity/6169624" target="_blank" rel="noopener noreferrer" className="btn btn-blue hero-donate">DONA ORA</Link></div>
    </div>
    <div className="tricolor-swoosh"/>
  </section>

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

  <section className="home-section updates-section"><div className="shell">
    <div className="section-head"><div><div className="eyebrow">NEWS ED EVENTI</div><h2>Le attività della nostra squadra.</h2></div></div>
    <div className="home-cards home-cards-essential">
      <Link href="/progetti/il-1-battito" className="info-card">
        <div className="media"><Image className="battito-card-image" src="/images/progetti/il-primo-battito/consegna-policlinico-2.jpg" alt="Consegna del contributo del progetto Il 1° Battito al Policlinico Umberto I" fill sizes="(max-width: 720px) calc(100vw - 40px), 50vw"/></div>
        <div className="body"><div className="eyebrow">PROGETTI</div><h3>Il 1° Battito</h3><p>Il progetto NIS dedicato alla salute di donne e bambini.</p><strong>Scopri il progetto <span aria-hidden="true">→</span></strong></div>
      </Link>
      <Link href="/eventi" className="info-card">
        <div className="media"><Image src="/images/hero-events.jpg" alt="Eventi e iniziative NIS" fill sizes="(max-width: 720px) calc(100vw - 40px), 50vw"/></div>
        <div className="body"><div className="eyebrow">EVENTI</div><h3>In campo, insieme.</h3><p>Sport, prevenzione e solidarietà nelle iniziative NIS.</p><strong>Vai agli eventi <span aria-hidden="true">→</span></strong></div>
      </Link>
    </div>
  </div></section>

  <section className="community-home-band"><div className="shell community-home-band-inner">
    <div><div className="eyebrow white">BE NIS. BE NICE.</div><h2>Entra nella Community NIS</h2><p>Medici, sanitari, sportivi, studenti, sostenitori e famiglie: scegli il modo più adatto per vivere e sostenere la community NIS.</p></div>
    <Link href="/diventa-socio" className="btn community-home-button">SCOPRI BE NIS. BE NICE.</Link>
  </div></section>

  <section className="donate-cta"><div className="shell donate-cta-inner"><div><div className="eyebrow white">SOSTIENI I PROGETTI NIS</div><h2>Ogni contributo può diventare cura, prevenzione e futuro.</h2></div><Link href="https://www.paypal.com/fundraiser/charity/6169624" target="_blank" rel="noopener noreferrer" className="btn btn-blue">DONA ORA</Link></div></section>
</>}

