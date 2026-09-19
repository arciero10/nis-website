import PageHero from "@/components/PageHero";
import SectorGrid from "@/components/SectorGrid";
import type {Metadata} from "next";
export const metadata:Metadata={title:"Settori | Nazionale Italiana Sanitari",description:"Sport, formazione, eventi e volontariato al servizio della salute e della solidarietà.",alternates:{canonical:"/settori"}};
export default function Page(){return <>
<PageHero eyebrow="SETTORI" title="Un’unica squadra." accent="Tanti modi di fare la differenza." intro="Sport, formazione, eventi e volontariato sono strumenti al servizio della salute e della solidarietà. Insieme trasformiamo la passione in progetti concreti per una vita migliore, per tutti." image="/images/hero-sectors.jpg"/>
<section className="section soft"><div className="shell"><SectorGrid/></div></section>
<section className="section"><div className="shell home-cards">
<div className="info-card"><div className="media" style={{backgroundImage:"url('/images/hero-events.jpg')"}}/><div className="body"><h2>Lo sport è un mezzo, non il fine.</h2><p>Attraverso lo sport promuoviamo salute, inclusione e solidarietà.</p></div></div>
<div className="info-card"><div className="media" style={{backgroundImage:"url('/images/hero-about.jpg')"}}/><div className="body"><h2>Professionisti e comunità.</h2><p>Sanitari, atleti, associazioni e cittadini lavorano insieme.</p></div></div>
<div className="info-card"><div className="media" style={{backgroundImage:"url('/images/hero-home.jpg')"}}/><div className="body"><h2>Partecipa ai settori NIS.</h2><p>Professionista, sportivo o sostenitore: c’è un modo per fare la differenza.</p></div></div>
</div></section></>}
