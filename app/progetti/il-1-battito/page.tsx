import PageHero from "@/components/PageHero";
import MetricStrip from "@/components/MetricStrip";
import FundraisingCard from "@/components/FundraisingCard";
import Icon from "@/components/Icon";
import Link from "next/link";
export default function Page(){return <>
<PageHero eyebrow="IL 1° BATTITO" title="Il primo battito di un percorso" accent="di cura e solidarietà." intro="Un progetto della Nazionale Italiana Sanitari per la salute della donna, del bambino e delle persone più fragili. Perché ogni vita merita un inizio sano e un futuro migliore." image="/images/hero-battito.jpg"><div className="hero-actions"><Link href="/dona" className="btn btn-blue">♡ DONA AL PROGETTO</Link><Link href="/progetti" className="btn btn-outline">SCOPRI TUTTI I PROGETTI ›</Link></div></PageHero>
<MetricStrip/>
<section className="section soft"><div className="shell project-highlight"><div className="photo"/><div className="project-text"><div className="eyebrow">IL PROGETTO</div><h2>Il 1° Battito</h2><p>“Il 1° Battito” è il primo grande progetto benefico della NIS. Nasce con un duplice obiettivo: creare un evento sportivo di alto valore simbolico e sociale e dare vita a un percorso stabile di supporto a progetti di cura e prevenzione in ambito sanitario.</p><p>Il titolo richiama l’inizio di un percorso di vita, speranza e rinascita: il battito rappresenta emozione, forza e volontà di prendersi cura degli altri, soprattutto delle donne e dei più piccoli.</p><strong>“Un piccolo battito oggi, un grande domani per tutti.”</strong></div><FundraisingCard/></div></section>
<section className="section"><div className="shell value-grid">
{[["Perché nasce","heart","Rispondere a reali bisogni di salute e sostenere la donna, il bambino e le persone più fragili."],["Obiettivi","run","Promuovere prevenzione e sostenere percorsi di cura con interventi concreti."],["Impatto","people","Generare un impatto riconoscibile nelle comunità e nella qualità della vita."],["Rendicontazione","document","Trasparenza e fiducia attraverso obiettivi, risultati e destinazione dei fondi."]].map(x=><div className="value-card" key={x[0]}><div className="orb"><Icon name={x[1]}/></div><div><h3>{x[0]}</h3><p>{x[2]}</p></div></div>)}
</div></section>
</>}
