import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import {founders,values,site} from "@/data/site";
import Link from "next/link";
export default function Page(){return <>
<PageHero eyebrow="CHI SIAMO" title="Professionisti nella cura." accent="Persone nella solidarietà." intro="La Nazionale Italiana Sanitari è un’Associazione del Terzo Settore nata per unire competenze, persone e professionalità del mondo della salute e trasformarle in progetti concreti di prevenzione, solidarietà e inclusione." image="/images/hero-about.jpg"/>
<section className="section soft"><div className="shell story-grid"><div className="story-copy"><div className="eyebrow">LA NOSTRA STORIA</div><h2 className="section-title">Un percorso che nasce da persone, per le persone.</h2><p>La Nazionale Italiana Sanitari (NIS) è stata fondata il <strong>{site.founded}</strong> come Associazione del Terzo Settore, con l’obiettivo di mettere a sistema le competenze e la passione dei professionisti della salute per generare un impatto positivo nella società.</p></div><div className="story-image"/></div></section>
<section className="section"><div className="shell"><div className="eyebrow">I NOSTRI FONDATORI</div><div className="founders">{founders.map(f=><div className="founder founder-text" key={f.name}><div><h3>{f.name}</h3><p>{f.role}</p></div></div>)}</div></div></section>
<section className="section soft"><div className="shell"><div className="eyebrow">I NOSTRI VALORI</div><div className="value-grid">{values.map(v=><div className="value-card" key={v.title}><div className="orb"><Icon name={v.icon}/></div><div><h3>{v.title}</h3><p>{v.text}</p></div></div>)}</div></div></section>
<section className="section"><div className="shell dark-band"><div><h2>Be NIS Be Nice</h2><p>Il programma associativo e di supporto della Nazionale Italiana Sanitari.</p><Link href="/be-nis-be-nice" className="btn btn-blue">SCOPRI IL PROGRAMMA</Link></div><div className="dark-image"/><div><h2>Più valore alle persone.</h2><p>Più salute per il domani.</p></div></div></section>
</>}
