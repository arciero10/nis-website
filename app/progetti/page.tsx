import PageHero from "@/components/PageHero";
import FundraisingCard from "@/components/FundraisingCard";
import Link from "next/link";
export default function Page(){return <>
<PageHero eyebrow="PROGETTI" title="Ogni progetto nasce" accent="per lasciare qualcosa." intro="Iniziative concrete, dedicate e verificabili per migliorare la salute delle persone, sostenere le fragilità e promuovere una società più sana e solidale." image="/images/hero-projects.jpg"><div className="hero-actions"><Link href="/dona" className="btn btn-blue">♡ DONA ORA</Link></div></PageHero>
<section className="section soft"><div className="shell project-highlight"><div className="photo"/><div className="project-text"><div className="eyebrow">PROGETTO IN EVIDENZA</div><h2>Il 1° Battito</h2><p>Il primo grande progetto benefico della NIS. Sport, emozione e solidarietà si uniscono per sostenere la salute di donne e bambini e promuovere percorsi di cura e prevenzione.</p><Link href="/progetti/il-1-battito" className="btn btn-blue">SCOPRI IL PROGETTO ›</Link></div><FundraisingCard/></div></section>
<section className="section"><div className="shell"><h2 className="section-title">Tutti i progetti</h2><div className="cards-4">
<Link href="/progetti/spirito-nis" className="mini-project"><div className="thumb" style={{backgroundImage:"url('/images/hero-sectors.jpg')",backgroundSize:"cover"}}/><div className="body"><h3>Spirito NIS</h3><p>Sport, scuola, valori e responsabilità per i giovani.</p><strong>SCOPRI IL PROGETTO →</strong></div></Link>
<Link href="/progetti/prevenzione" className="mini-project"><div className="thumb" style={{backgroundImage:"url('/images/hero-news.jpg')",backgroundSize:"cover"}}/><div className="body"><h3>Prevenzione</h3><p>Percorsi di prevenzione e divulgazione per una cultura della salute sempre più diffusa.</p><strong>SCOPRI IL PROGETTO →</strong></div></Link>
</div></div></section></>}
