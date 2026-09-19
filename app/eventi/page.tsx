import Link from "next/link";
import PageHero from "@/components/PageHero";
import type {Metadata} from "next";

export const metadata:Metadata={title:"Eventi | Nazionale Italiana Sanitari",description:"Gli eventi sportivi, solidali e di prevenzione della Nazionale Italiana Sanitari.",alternates:{canonical:"/eventi"}};

export default function Page(){return <>
  <PageHero eyebrow="EVENTI" title="Incontrarsi per" accent="generare impatto." intro="Eventi sportivi, iniziative solidali, giornate di prevenzione e appuntamenti associativi. Occasioni per condividere valori, costruire reti e fare la differenza, insieme." image="/images/hero-events.jpg"/>
  <section className="section soft"><div className="shell empty-state"><div className="eyebrow">PROSSIMI APPUNTAMENTI</div><h2 className="section-title">Il calendario NIS è in aggiornamento.</h2><p className="section-lead">I prossimi eventi saranno pubblicati qui non appena confermati.</p><Link href="/contatti" className="btn btn-blue">CONTATTACI</Link></div></section>
</>}
