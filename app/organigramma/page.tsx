import type {Metadata} from "next";
import Link from "next/link";
import Icon from "@/components/Icon";

export const metadata:Metadata={
  title:"Organigramma | Nazionale Italiana Sanitari",
  description:"Scopri la struttura istituzionale, operativa, valoriale e medico-scientifica della Nazionale Italiana Sanitari.",
  alternates:{canonical:"/organigramma"},
};

const pdfPath="/documenti/organigramma-nis-2026.pdf";

const governanceRoles=[
  {role:"Presidente",name:"Joseph Fiore",details:["Socio Fondatore","Manager Sanitario"]},
  {role:"Vicepresidente",name:"Prof. Luca Cipriano",details:["Socio Fondatore • Presidente Onorario","Ginecologia e Ostetricia"]},
  {role:"Tesoriere",name:"Edoardo Marcucci",details:["Socio Fondatore","Notaio"]},
  {role:"Direzione Generale",name:"Ludovica Rossetti",details:["Manager Sanitario"],description:"Riceve gli indirizzi del Consiglio Direttivo e ne coordina l’attuazione operativa."},
  {role:"Segreteria del Direttivo",name:"Denise Donniacuo",details:["Responsabile Segreteria del Direttivo"],description:"Supporto organizzativo e documentale al Consiglio Direttivo."},
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

function PdfPanel(){return <div className="org-pdf-panel">
  <div className="org-pdf-title">
    <span className="org-document-icon" aria-hidden="true"><Icon name="document" size={22}/></span>
    <div><span>Documento istituzionale</span><strong>Organigramma NIS 2026</strong></div>
  </div>
  <div className="org-pdf-links">
    <a className="btn btn-blue" href={pdfPath} target="_blank" rel="noopener noreferrer">Visualizza PDF</a>
    <a className="btn org-button-secondary" href={pdfPath} download>Scarica PDF</a>
  </div>
</div>}

function PersonEntry({role,name,details,description}:{role:string;name:string;details:string[];description?:string}){return <article className="org-person-entry">
  <p className="org-entry-role">{role}</p>
  <h3>{name}</h3>
  {details.length>0&&<p className="org-entry-details">{details.join(" · ")}</p>}
  {description&&<p className="org-entry-description">{description}</p>}
</article>}

function SectionHeader({number,title,intro}:{number:string;title:string;intro:string}){return <header className="org-section-header">
  <p className="org-section-number">{number}</p>
  <div><h2>{title}</h2><p>{intro}</p></div>
</header>}

export default function OrganigrammaPage(){return <>
  <header className="org-page-header">
    <div className="shell org-page-header-inner">
      <nav className="org-breadcrumb" aria-label="Percorso di navigazione">
        <Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Organigramma</span>
      </nav>
      <p className="org-page-kicker">Struttura NIS</p>
      <h1>Organigramma</h1>
      <h2>Nazionale Italiana Sanitari ETS</h2>
      <p className="org-page-intro">Struttura istituzionale, operativa, valoriale e medico-scientifica.</p>
      <nav className="org-anchor-nav" aria-label="Sezioni dell’organigramma">
        <a href="#governance">Governance</a><a href="#direzione">Direzione</a><a href="#valori">Valori</a><a href="#settori">Settori</a><a href="#scienza">Scienza</a>
      </nav>
    </div>
  </header>

  <div className="org-main">
    <div className="shell org-pdf-wrap"><PdfPanel/></div>

    <section className="org-editorial-section" id="governance">
      <div className="shell org-content-width">
        <SectionHeader number="01" title="Presidenza e Consiglio Direttivo" intro="Il vertice istituzionale della Nazionale Italiana Sanitari."/>
        <div className="org-entry-grid">{governanceRoles.map(person=><PersonEntry key={person.role} {...person}/>)}</div>
        <div className="org-council">
          <div className="org-subheading"><p>Consiglio Direttivo</p><h3>Componenti</h3></div>
          <ul>{council.map(name=><li key={name}>{name}</li>)}</ul>
        </div>
      </div>
    </section>

    <section className="org-editorial-section org-section-tinted" id="direzione">
      <div className="shell org-content-width">
        <SectionHeader number="02" title="Direzione e funzioni operative" intro="Le funzioni che trasformano gli indirizzi associativi in attività, eventi e comunicazione."/>
        <div className="org-subsection">
          <h3>Area Eventi</h3>
          <div className="org-entry-grid">{eventTeam.map(person=><PersonEntry key={person.name} {...person}/>)}</div>
          <p className="org-coordination-note"><strong>Coordinamento area eventi:</strong> Flavio Moretti, Camilla Cardinali, Sara Mastracchio</p>
        </div>
        <div className="org-subsection">
          <h3>Comunicazione &amp; Media</h3>
          <div className="org-entry-grid">{mediaTeam.map(person=><PersonEntry key={person.name} {...person}/>)}</div>
        </div>
      </div>
    </section>

    <section className="org-editorial-section" id="valori">
      <div className="shell org-content-width">
        <SectionHeader number="03" title="Comitato Spirito e Valori NIS" intro="Il presidio dei valori, dei comportamenti e dello spirito che identificano la NIS."/>
        <div className="org-values-layout">
          <div className="org-entry-grid">
            <PersonEntry role="Presidente" name="Dott. Alfonso D’Anna" details={["Ginecologo"]}/>
            <PersonEntry role="Componente" name="Dott. Giovanni Vozzi" details={["Ginecologo"]}/>
            <PersonEntry role="Composizione in corso" name="3 componenti da nominare" details={[]}/>
          </div>
          <p>Il Comitato custodisce e promuove i valori, i comportamenti e lo spirito che identificano la NIS.</p>
        </div>
      </div>
    </section>

    <section className="org-editorial-section org-section-tinted" id="settori">
      <div className="shell org-content-width">
        <SectionHeader number="04" title="Board dei Settori NIS" intro="Presidente, Vicepresidente, Direttore Generale e Responsabili di Settore condividono programmi e attività."/>
        <div className="org-board-composition">
          <div><p>Composizione del Board</p><h3>Joseph Fiore · Prof. Luca Cipriano · Ludovica Rossetti</h3><span>Responsabili di tutti i Settori NIS</span></div>
          <div><p>Ruoli</p><span>Presidente · Vicepresidente · Direttore Generale · Responsabili di Settore</span></div>
        </div>
        <div className="org-standard-structure"><strong>Struttura standard</strong><span>Responsabile di Settore → Team Manager → Segreteria Operativa</span></div>
        <div className="org-sector-register">
          {sectors.map(sector=><article className="org-sector-row" key={sector.name}>
            <h3>{sector.name}</h3>
            {sector.roles.map(role=><div key={role.label}><p>{role.label}</p><strong className={role.name==="Da nominare"?"org-unassigned":""}>{role.name}</strong>{role.detail&&<span>{role.detail}</span>}</div>)}
          </article>)}
        </div>
      </div>
    </section>

    <section className="org-editorial-section" id="scienza">
      <div className="shell org-content-width">
        <SectionHeader number="05" title="Board Medico-Scientifico" intro="L’organo tecnico-consultivo che contribuisce a definire la strategia medico-scientifica dell’Associazione."/>
        <p className="org-science-objective"><strong>Obiettivo</strong><span>Rappresentanza di almeno 15 branche specialistiche</span></p>
        <div className="org-scientific-register">
          {scientific.map(item=><article key={item.area}><p>{item.area}</p><h3>{item.name}</h3><span>{item.detail}</span></article>)}
        </div>
        <div className="org-mandate-note"><h3>Mandato del Board</h3><p>Definire gli indirizzi medico-scientifici delle iniziative NIS, contribuire alla programmazione delle campagne di prevenzione e garantire rigore, appropriatezza e multidisciplinarietà nei contenuti sanitari dell’Associazione.</p></div>
      </div>
    </section>
  </div>

  <section className="org-document-footer">
    <div className="shell org-content-width">
      <div className="org-document-footer-title"><strong>BE NIS. BE NICE.</strong><span>PERSONE • SALUTE • VALORI • COMUNITÀ</span></div>
      <PdfPanel/>
    </div>
  </section>
</>}
