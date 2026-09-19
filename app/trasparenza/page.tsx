import type {Metadata} from "next";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import {site} from "@/data/site";

export const metadata:Metadata={
  title:"Trasparenza | Nazionale Italiana Sanitari",
  description:"Dati identificativi e documentazione di trasparenza della Nazionale Italiana Sanitari.",
  alternates:{canonical:"/trasparenza"},
};

const sections=[
  {title:"Organi sociali",icon:"people",text:"Nessun atto o documento ufficiale relativo agli organi sociali è attualmente pubblicato in questa sezione."},
  {title:"Documenti",icon:"document",text:"Nessun documento istituzionale è attualmente pubblicato in questa sezione."},
  {title:"Bilanci e rendiconti",icon:"document",text:"Nessun bilancio o rendiconto è attualmente pubblicato in questa sezione."},
  {title:"Contributi e liberalità",icon:"heart",text:"Nessun prospetto relativo a contributi o liberalità è attualmente pubblicato in questa sezione."},
  {title:"Adempimenti di trasparenza",icon:"shield",text:"La sezione sarà aggiornata con documenti verificati quando saranno disponibili o quando previsti dagli obblighi applicabili."},
];

export default function Page(){return <>
  <PageHero eyebrow="TRASPARENZA" title="Trasparenza." accent="Responsabilità." intro="Informazioni istituzionali e documenti verificati della Nazionale Italiana Sanitari." image="/images/hero-contact.jpg"/>
  <section className="section soft">
    <div className="shell transparency-identity">
      <div className="eyebrow">DATI IDENTIFICATIVI</div>
      <h2>NAZIONALE ITALIANA SANITARI</h2>
      <p><strong>Codice fiscale:</strong> {site.cf}</p>
    </div>
  </section>
  <section className="section"><div className="shell transparency-sections">
    {sections.map(section=><article className="transparency-section" key={section.title}>
      <Icon name={section.icon} size={38}/>
      <div><h2>{section.title}</h2><p>{section.text}</p></div>
    </article>)}
  </div></section>
</>}
