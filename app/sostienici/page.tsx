import PageHero from "@/components/PageHero";
import FundraisingCard from "@/components/FundraisingCard";
import Icon from "@/components/Icon";
import Link from "next/link";
import type {Metadata} from "next";
export const metadata:Metadata={title:"Sostienici | Nazionale Italiana Sanitari",description:"Sostieni i progetti NIS con una donazione, una collaborazione o il volontariato.",alternates:{canonical:"/sostienici"}};
export default function Page(){return <>
<PageHero eyebrow="SOSTIENICI" title="Il tuo gesto. Il nostro impegno." accent="Un risultato concreto." intro="Sostieni la Nazionale Italiana Sanitari con una donazione, una partnership, l’associazione o il volontariato. Insieme possiamo fare la differenza per la salute, lo sport e una società più solidale." image="/images/hero-support.jpg"/>
<section className="section soft"><div className="shell support-grid">
<Link href="/dona" className="support-card"><Icon name="heart" size={52}/><h2>Dona</h2><p>Il tuo contributo sostiene progetti concreti per la salute e la solidarietà.</p></Link>
<Link href="/diventa-socio" className="support-card"><Icon name="people" size={52}/><h2>Diventa associato</h2><p>Unisciti alla nostra comunità di professionisti e sostenitori.</p></Link>
<Link href="/partner" className="support-card"><Icon name="handshake" size={52}/><h2>Diventa partner</h2><p>Costruiamo insieme progetti ad alto impatto sociale.</p></Link>
<div className="support-card"><Icon name="heart" size={52}/><h2>Volontariato</h2><p>Metti a disposizione tempo, competenze e passione.</p></div>
</div></section>
<section className="section"><div className="shell project-highlight"><div className="photo"/><div className="project-text"><div className="eyebrow">IL 1° BATTITO</div><h2>Un gesto concreto per la salute.</h2><p>Scopri il primo grande progetto benefico della NIS e i risultati raggiunti grazie alla raccolta fondi.</p><Link href="/progetti/il-1-battito" className="btn btn-blue">SCOPRI IL PROGETTO</Link></div><FundraisingCard/></div></section>
</>}
