import type {Metadata} from "next";
import Icon from "@/components/Icon";

export const metadata:Metadata={
  title:"Organigramma | Nazionale Italiana Sanitari",
  description:"Scopri la struttura istituzionale, operativa, valoriale e medico-scientifica della Nazionale Italiana Sanitari.",
  alternates:{canonical:"/organigramma"},
};

const pdfPath="/documenti/organigramma-nis-2026.pdf";

const leaders=[
  {role:"Presidente",name:"Joseph Fiore",details:["Socio Fondatore","Manager Sanitario"],tone:"blue"},
  {role:"Vicepresidente",name:"Prof. Luca Cipriano",details:["Socio Fondatore • Presidente Onorario","Ginecologia e Ostetricia"],tone:"green"},
  {role:"Tesoriere",name:"Edoardo Marcucci",details:["Socio Fondatore","Notaio"],tone:"red"},
];

const council=["Joseph Fiore","Prof. Luca Cipriano","Edoardo Marcucci","Ludovica Rossetti","Flavio Moretti","Patrizio Pasqualini","Dott.ssa Cristina Fiore"];

const eventTeam=[
  {role:"Direttore Organizzazione Eventi",name:"Flavio Moretti",details:["Membro del Consiglio Direttivo","Manager Food & Beverage"],description:"Responsabile dell’organizzazione complessiva degli eventi NIS."},
  {role:"Direzione Artistica — Eventi & Design",name:"Camilla Cardinali",details:[],description:"Concept, immagine, allestimenti e direzione artistica degli eventi e dei progetti di design."},
  {role:"Coordinamento Operativo",name:"Sara Mastracchio",details:["Coordinatrice Operativa Eventi & Produzione"],description:"Esecuzione pratica, produzioni e allestimenti."},
];

const mediaTeam=[
  {role:"Responsabile Ufficio Stampa",name:"Patrizio Pasqualini",details:["Membro del Consiglio Direttivo","Assicuratore e Giornalista"],description:"Coordina comunicazione istituzionale e rapporti con i media."},
  {role:"IT Manager & Videomaker",name:"Alessandro Arciero",details:[],description:"Supporto tecnologico, strumenti digitali e produzione video a supporto dell’Ufficio Stampa e della comunicazione NIS."},
];

const sectors=[
  {name:"Calcio",roles:[{label:"Responsabile di Settore",name:"Dott. Alfonso D’Anna",detail:"Ginecologo"},{label:"Team Manager",name:"Dott. Giovanni Vozzi",detail:"Ginecologo"},{label:"Segreteria Operativa",name:"Lucia Del Ferraro",detail:"Ostetrica"}]},
  {name:"Running",roles:[{label:"Responsabile di Settore",name:"Marco Cerrodu",detail:"Fisioterapista"},{label:"Team Manager",name:"Da nominare"},{label:"Segreteria Operativa",name:"Da nominare"}]},
  {name:"Tennis",roles:[{label:"Responsabile di Settore",name:"Dott.ssa Fabiana Monti",detail:"Neonatologa"},{label:"Team Manager",name:"Da nominare"},{label:"Segreteria Operativa",name:"Da nominare"}]},
  {name:"Pet Therapy & Equitazione",roles:[{label:"Responsabile di Settore",name:"Dott.ssa Novella Buscemi",detail:"Ginecologa"},{label:"Team Manager",name:"Eleni Pasqualini",detail:"Operatrice Didattica FISE UD1"},{label:"Segreteria Operativa",name:"Da nominare"}]},
  {name:"Golf",roles:[{label:"Responsabile di Settore",name:"Massimo Rossi",detail:"Consulente del lavoro specializzato nel settore sanitario"},{label:"Team Manager",name:"Da nominare"},{label:"Segreteria Operativa",name:"Da nominare"}]},
];

const scientific=[
  {area:"Oncologia",name:"Dott.ssa Cristina Fiore",detail:"Responsabile Medico - Pianificazione e Coordinamento delle Campagne di Screening"},
  {area:"Dermatologia",name:"Dott. Mauro La Pietra",detail:"Componente del Board Medico-Scientifico"},
  {area:"Chirurgia Senologica",name:"Dott. Dimitrios Varvaras",detail:"Componente del Board Medico-Scientifico"},
  {area:"Ambito Ostetrico",name:"Prof. Luca Cipriano",detail:"Ginecologia e Ostetricia - componente del Board Medico-Scientifico"},
  {area:"Anatomia Patologica",name:"Dott.ssa Antonella Rossetti",detail:"Componente del Board Medico-Scientifico"},
  {area:"Altre Branche",name:"Board in evoluzione",detail:"Gli altri membri saranno inseriti nel corso dell’anno."},
];

function PdfActions(){return <div className="org-pdf-actions">
  <div className="org-pdf-identity">
    <span className="org-pdf-icon" aria-hidden="true"><Icon name="document" size={25}/></span>
    <div><span>Documento istituzionale</span><strong>Organigramma NIS 2026</strong></div>
  </div>
  <div className="org-pdf-buttons">
    <a className="btn btn-blue" href={pdfPath} target="_blank" rel="noopener noreferrer">Visualizza PDF</a>
    <a className="btn org-btn-light" href={pdfPath} download>Scarica PDF</a>
  </div>
</div>}

function PersonCard({role,name,details,description,tone="blue"}:{role:string;name:string;details:string[];description?:string;tone?:string}){return <article className={`org-person-card tone-${tone}`}>
  <span className="org-role">{role}</span>
  <h3>{name}</h3>
  {details.map(detail=><p className="org-detail" key={detail}>{detail}</p>)}
  {description&&<p className="org-description">{description}</p>}
</article>}

function SectionHeading({number,title,intro}:{number:string;title:string;intro:string}){return <div className="org-section-heading">
  <span aria-hidden="true">{number}</span><div><h2>{title}</h2><p>{intro}</p></div>
</div>}

export default function OrganigrammaPage(){return <>
  <section className="org-hero">
    <div className="org-hero-accent" aria-hidden="true"/>
    <div className="org-hero-lines" aria-hidden="true"/>
    <div className="shell org-hero-content">
      <div className="eyebrow white">STRUTTURA NIS</div>
      <h1>Organigramma</h1>
      <h2>Nazionale Italiana Sanitari ETS</h2>
      <p>Struttura istituzionale, operativa, valoriale e medico-scientifica.</p>
      <div className="org-pillars" aria-label="Governance, Direzione, Valori, Settori, Scienza">
        <span>Governance</span><span>Direzione</span><span>Valori</span><span>Settori</span><span>Scienza</span>
      </div>
    </div>
  </section>

  <div className="shell org-pdf-top"><PdfActions/></div>

  <section className="section org-section">
    <div className="shell">
      <SectionHeading number="01" title="Presidenza e Consiglio Direttivo" intro="Il vertice istituzionale della Nazionale Italiana Sanitari."/>
      <div className="org-leaders">{leaders.map(person=><PersonCard key={person.role} {...person}/>)}</div>
      <div className="org-governance-grid">
        <article className="org-list-card">
          <span className="org-role">Consiglio Direttivo</span>
          <h3>Componenti</h3>
          <ul>{council.map(name=><li key={name}>{name}</li>)}</ul>
        </article>
        <div className="org-stack">
          <PersonCard role="Direzione Generale" name="Ludovica Rossetti" details={["Manager Sanitario"]} description="Riceve gli indirizzi del Consiglio Direttivo e ne coordina l’attuazione operativa."/>
          <PersonCard role="Segreteria del Direttivo" name="Denise Donniacuo" details={["Responsabile Segreteria del Direttivo"]} description="Supporto organizzativo e documentale al Consiglio Direttivo." tone="green"/>
        </div>
        <article className="org-values-card">
          <span className="org-role">Comitato Spirito e Valori NIS</span>
          <div><h3>Dott. Alfonso D’Anna</h3><p>Presidente • Ginecologo</p></div>
          <div><h3>Dott. Giovanni Vozzi</h3><p>Ginecologo</p></div>
          <div><h3 className="org-pending">3 componenti da nominare</h3></div>
          <p className="org-description">Il Comitato custodisce e promuove i valori, i comportamenti e lo spirito che identificano la NIS.</p>
        </article>
      </div>
    </div>
  </section>

  <section className="section org-section org-soft">
    <div className="shell">
      <SectionHeading number="02" title="Direzione e funzioni operative" intro="Le funzioni che trasformano gli indirizzi associativi in attività, eventi e comunicazione."/>
      <h3 className="org-group-title">Area Eventi</h3>
      <div className="org-card-grid three">{eventTeam.map(person=><PersonCard key={person.name} {...person}/>)}</div>
      <div className="org-chain"><span>Filiera Eventi</span><strong>Flavio Moretti</strong><i>→</i><strong>Camilla Cardinali</strong><i>→</i><strong>Sara Mastracchio</strong></div>
      <h3 className="org-group-title">Comunicazione & Media</h3>
      <div className="org-card-grid two">{mediaTeam.map(person=><PersonCard key={person.name} {...person}/>)}</div>
    </div>
  </section>

  <section className="section org-section">
    <div className="shell">
      <SectionHeading number="03" title="Board dei Settori NIS" intro="Presidente, Vicepresidente, Direttore Generale e Responsabili di Settore condividono programmi e attività."/>
      <div className="org-board-summary">
        <div><span className="org-role">Composizione del Board</span><h3>Joseph Fiore • Prof. Luca Cipriano • Ludovica Rossetti</h3><p>Responsabili di tutti i Settori NIS</p></div>
        <p><strong>Ruoli</strong> Presidente • Vicepresidente • Direttore Generale • Responsabili di Settore</p>
      </div>
      <div className="org-structure-header"><span>Struttura standard</span><div><strong>Responsabile di Settore</strong><i>→</i><strong>Team Manager</strong><i>→</i><strong>Segreteria Operativa</strong></div></div>
      <div className="org-sector-cards">{sectors.map(sector=><article key={sector.name}><h3>{sector.name}</h3>{sector.roles.map(role=><div key={role.label}><span>{role.label}</span><strong className={role.name==="Da nominare"?"org-pending":""}>{role.name}</strong>{role.detail&&<p>{role.detail}</p>}</div>)}</article>)}</div>
    </div>
  </section>

  <section className="section org-section org-science">
    <div className="shell">
      <SectionHeading number="04" title="Board Medico-Scientifico" intro="L’organo tecnico-consultivo che contribuisce a definire la strategia medico-scientifica dell’Associazione."/>
      <div className="org-science-goal"><span>Obiettivo</span><strong>Rappresentanza di almeno 15 branche specialistiche</strong></div>
      <div className="org-card-grid three org-science-grid">{scientific.map(item=><article className={`org-science-card${item.name==="Board in evoluzione"?" is-evolving":""}`} key={item.area}><span>{item.area}</span><h3>{item.name}</h3><p>{item.detail}</p></article>)}</div>
      <div className="org-mandate"><span>Mandato del Board</span><p>Definire gli indirizzi medico-scientifici delle iniziative NIS, contribuire alla programmazione delle campagne di prevenzione e garantire rigore, appropriatezza e multidisciplinarietà nei contenuti sanitari dell’Associazione.</p></div>
    </div>
  </section>

  <section className="org-closing">
    <div className="shell"><p>BE NIS. BE NICE.</p><strong>PERSONE • SALUTE • VALORI • COMUNITÀ</strong><PdfActions/></div>
  </section>
</>}
