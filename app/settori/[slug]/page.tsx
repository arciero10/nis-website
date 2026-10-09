import {notFound} from "next/navigation";
import {sectors} from "@/data/site";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import type {Metadata} from "next";
import {createPageMetadata} from "@/lib/seo";
export function generateStaticParams(){return sectors.map(s=>({slug:s.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const sector=sectors.find(item=>item.slug===slug);if(!sector)return {};return createPageMetadata({title:`${sector.title} NIS | Sport, salute e solidarietà`,description:`${sector.text} Scopri attività e obiettivi del settore ${sector.title} della Nazionale Italiana Sanitari.`,path:`/settori/${sector.slug}`})}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const s=sectors.find(x=>x.slug===slug);if(!s)return notFound();return <>
<PageHero eyebrow={`SETTORE NIS · ${s.title.toUpperCase()}`} title={s.title} accent="NIS" intro={s.text+" Il settore sviluppa iniziative sportive, di aggregazione e solidarietà coerenti con la missione dell’Associazione."} image="/images/hero-sectors.jpg" path={`/settori/${s.slug}`} parents={[{name:"Settori",path:"/settori"}]}/>
<section className="section soft"><div className="shell story-grid"><div className="story-copy"><div className="eyebrow">IL SETTORE</div><h2 className="section-title">{s.title}</h2><p>{s.text}</p></div><div className="value-card"><div className="orb"><Icon name={s.icon}/></div><div><h3>Obiettivo</h3><p>Usare {s.title.toLowerCase()} come strumento per creare comunità, salute e opportunità concrete di solidarietà.</p></div></div></div></section></>}
