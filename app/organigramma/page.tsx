import type {Metadata} from "next";
import Image from "next/image";

export const metadata:Metadata={
  title:"Organigramma | Nazionale Italiana Sanitari",
  description:"Scopri la struttura istituzionale, operativa, valoriale e medico-scientifica della Nazionale Italiana Sanitari.",
  alternates:{canonical:"/organigramma"},
};

const pdfPath="/documenti/organigramma-nis-2026.pdf";

const governanceRoles=[
  {role:"Presidente",name:"Joseph Fiore",details:["Socio Fondatore","Manager Sanitario"],description:"Rappresentanza istituzionale e indirizzo strategico dell’Associazione."},
  {role:"Vicepresidente",name:"Prof. Luca Cipriano",details:["Socio Fondatore • Presidente Onorario","Ginecologo"],description:"Supporto alla Presidenza e alle attività istituzionali dell’Associazione."},
  {role:"Tesoriere",name:"Edoardo Marcucci",details:["Socio Fondatore","Notaio"],description:"Presidio amministrativo e gestione economica dell’Associazione."},
  {role:"Direzione Generale",name:"Ludovica Rossetti",details:["Manager Sanitario"],description:"Coordina l’attuazione operativa degli indirizzi del Consiglio Direttivo."},
  {role:"Segreteria del Direttivo",name:"Denise Donniacuo",details:["Responsabile Segreteria del Direttivo"],description:"Assicura il supporto organizzativo e documentale al Consiglio Direttivo."},
];

const council=["Joseph Fiore","Prof. Luca Cipriano","Edoardo Marcucci","Ludovica Rossetti","Flavio Moretti","Patrizio Pasqualini","Dott.ssa Cristina Fiore"];

const eventTeam=[
  {role:"Direttore Organizzazione Eventi",name:"Flavio Moretti",details:["Membro del Consiglio Direttivo","Manager Food & Beverage"],description:"Sovrintende alla pianificazione, alla logistica e alla realizzazione degli eventi NIS."},
  {role:"Direzione Artistica — Eventi & Design",name:"Camilla Cardinali",details:[],description:"Cura l’identità visiva, gli allestimenti e la direzione artistica delle iniziative NIS."},
  {role:"Coordinamento Operativo",name:"Sara Mastracchio",details:["Coordinatrice Operativa Eventi & Produzione"],description:"Coordina la produzione e l’esecuzione operativa degli eventi."},
];

const mediaTeam=[
  {role:"Responsabile Ufficio Stampa",name:"Patrizio Pasqualini",details:["Membro del Consiglio Direttivo","Assicuratore e Giornalista"],description:"Coordina la comunicazione istituzionale e i rapporti con stampa e media."},
  {role:"IT Manager & Videomaker",name:"Alessandro Arciero",details:[],description:"Gestisce gli strumenti digitali e la produzione video per la comunicazione NIS."},
];

const sectors=[
  {name:"Calcio",roles:[{label:"Responsabile di Settore",name:"Dott. Alfonso D’Anna",detail:"Ginecologo"},{label:"Team Manager",name:"Dott. Giovanni Vozzi",detail:"Ginecologo"},{label:"Segreteria Operativa",name:"Lucia Del Ferraro",detail:"Ostetrica"}]},
  {name:"Running",roles:[{label:"Responsabile di Settore",name:"Marco Cerroni",detail:"Fisioterapista"},{label:"Team Manager",name:"Da nominare"},{label:"Segreteria Operativa",name:"Da nominare"}]},
  {name:"Tennis",roles:[{label:"Responsabile di Settore",name:"Dott.ssa Fabiana Monti",detail:"Neonatologa"},{label:"Team Manager",name:"Da nominare"},{label:"Segreteria Operativa",name:"Da nominare"}]},
  {name:"Pet Therapy & Equitazione",roles:[{label:"Responsabile di Settore",name:"Dott.ssa Novella Buscemi",detail:"Ginecologa"},{label:"Team Manager",name:"Eleni Pasqualini",detail:"Operatrice Didattica FISE UD1"},{label:"Segreteria Operativa",name:"Da nominare"}]},
  {name:"Golf",roles:[{label:"Responsabile di Settore",name:"Massimo Rossi",detail:"Consulente del lavoro specializzato nel settore sanitario"},{label:"Team Manager",name:"Da nominare"},{label:"Segreteria Operativa",name:"Da nominare"}]},
];

const scientific=[
  {area:"Oncologia",name:"Dott.ssa Cristina Fiore",detail:"Responsabile Medico - Pianificazione e Coordinamento Campagne di Screening"},
  {area:"Dermatologo",name:"Dott. Mauro La Pietra",detail:"Componente del Board Medico-Scientifico"},
  {area:"Chirurgo Senologo",name:"Dott. Dimitrios Varvaras",detail:"Componente del Board Medico-Scientifico"},
  {area:"Ginecologo",name:"Prof. Luca Cipriano",detail:"Componente del Board Medico-Scientifico"},
  {area:"Anatomopatologa",name:"Dott.ssa Antonella Rossetti",detail:"Componente del Board Medico-Scientifico"},
  {area:"Embriologa",name:"Dott.ssa Emilia Rega",detail:"Componente del Board Medico-Scientifico"},
  {area:"Altre Branche",name:"Board in evoluzione",detail:"Gli altri membri saranno inseriti nel corso dell’anno."},
];

function PdfPanel(){return <div className="org-pdf-panel">
  <p className="org-pdf-title"><span>Documento ufficiale</span><strong>Organigramma NIS 2026</strong></p>
  <div className="org-pdf-links">
    <a className="btn btn-blue" href={pdfPath} target="_blank" rel="noopener noreferrer">Visualizza PDF</a>
    <a className="btn org-button-secondary" href={pdfPath} download>Scarica PDF</a>
  </div>
</div>}

function PersonEntry({role,name,details,description}:{role:string;name:string;details:string[];description?:string}){return <article className="org-person-entry">
  <h3>{name}</h3>
  <p className="org-entry-role">{role}</p>
  {details.length>0&&<p className="org-entry-details">{details.join(" · ")}</p>}
  {description&&<p className="org-entry-description">{description}</p>}
</article>}

function SectionHeader({title,intro}:{title:string;intro:string}){return <header className="org-section-header">
  <h2>{title}</h2><p>{intro}</p>
</header>}

export default function OrganigrammaPage(){return <>
  <header className="org-page-header">
    <Image className="org-page-header-image" src="/images/brand/nis-is-nice.png" alt="" fill priority sizes="100vw"/>
    <div className="org-page-header-overlay" aria-hidden="true"/>
    <div className="shell org-page-header-inner">
      <h1>Organigramma</h1>
    </div>
  </header>

  <div className="org-main">
    <div className="shell org-pdf-wrap"><PdfPanel/></div>

    <section className="org-editorial-section" id="governance">
      <div className="shell org-content-width">
        <SectionHeader title="Presidenza e Consiglio Direttivo" intro="Il vertice istituzionale della Nazionale Italiana Sanitari."/>
        <div className="org-entry-grid org-governance-leaders">{governanceRoles.slice(0,3).map(person=><PersonEntry key={person.role} {...person}/>)}</div>
        <div className="org-council">
          <div className="org-subheading"><p>Consiglio Direttivo</p><h3>Componenti</h3></div>
          <ul>{council.map(name=><li key={name}>{name}</li>)}</ul>
        </div>
        <div className="org-entry-grid org-management-grid">{governanceRoles.slice(3).map(person=><PersonEntry key={person.role} {...person}/>)}</div>
        <div className="org-committee-section">
          <div className="org-subsection-heading"><h3>Comitato Spirito e Valori NIS</h3><p>Il Comitato custodisce e promuove i valori, i comportamenti e lo spirito che identificano la NIS.</p></div>
          <div className="org-entry-grid org-committee-list">
            <PersonEntry role="Presidente" name="Dott. Alfonso D’Anna" details={["Ginecologo"]}/>
            <PersonEntry role="Componente" name="Dott. Giovanni Vozzi" details={["Ginecologo"]}/>
            <PersonEntry role="Composizione in corso" name="3 componenti da nominare" details={["Nomine in via di definizione"]}/>
          </div>
        </div>
      </div>
    </section>

    <section className="org-editorial-section org-section-tinted" id="direzione">
      <div className="shell org-content-width">
        <SectionHeader title="Direzione e funzioni operative" intro="Le funzioni che trasformano gli indirizzi associativi in attività, eventi e comunicazione."/>
        <div className="org-operations-columns">
          <div className="org-subsection org-operation-column">
            <h3>Area Eventi</h3>
            <div className="org-entry-grid">{eventTeam.map(person=><PersonEntry key={person.name} {...person}/>)}</div>
          </div>
          <div className="org-subsection org-operation-column">
            <h3>Comunicazione &amp; Media</h3>
            <div className="org-entry-grid">{mediaTeam.map(person=><PersonEntry key={person.name} {...person}/>)}</div>
          </div>
        </div>
      </div>
    </section>

    <section className="org-editorial-section" id="settori">
      <div className="shell org-content-width">
        <SectionHeader title="Board dei Settori NIS" intro="La struttura operativa dei settori sportivi della Nazionale Italiana Sanitari."/>
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
        <SectionHeader title="Board Medico-Scientifico" intro="L’organo tecnico-consultivo che contribuisce a definire la strategia medico-scientifica dell’Associazione."/>
        <p className="org-science-objective"><strong>Obiettivo</strong><span>Rappresentanza di almeno 15 branche specialistiche</span></p>
        <div className="org-scientific-register">
          {scientific.map(item=><article key={item.area}><p>{item.area}</p><h3>{item.name}</h3><span>{item.detail}</span></article>)}
        </div>
        <div className="org-mandate-note"><h3>Mandato del Board</h3><p>Definire gli indirizzi medico-scientifici delle iniziative NIS, contribuire alla programmazione delle campagne di prevenzione e garantire rigore, appropriatezza e multidisciplinarietà nei contenuti sanitari dell’Associazione.</p></div>
      </div>
    </section>
  </div>

</>}
