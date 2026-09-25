import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {existsSync} from "node:fs";
import {join} from "node:path";
import ApplicationForm from "@/components/ApplicationForm";

export const metadata:Metadata={
  title:"Diventa socio NIS | Entra nella Community",
  description:"Invia la tua candidatura e scopri come entrare nella Community della Nazionale Italiana Sanitari attraverso il programma associativo NIS.",
  alternates:{canonical:"/diventa-socio"},
};

const programmePdf="/documenti/be-nis-be-nice-2026-2027.pdf";
const programmePdfAvailable=existsSync(join(process.cwd(),"public","documenti","be-nis-be-nice-2026-2027.pdf"));

const formulas=[
  {name:"NIS Settore",fee:"€120",description:"Vivi NIS attraverso lo sport.",items:["allenamenti ed eventi","attività di settore","community e convenzioni"]},
  {name:"NIS Medico",fee:"€100",description:"La competenza al servizio degli altri.",items:["community professionale","prevenzione e screening","eventi e formazione"]},
  {name:"NIS Sanitario",fee:"€50",description:"La professionalità sanitaria per la comunità.",items:["professioni sanitarie non mediche","educazione sanitaria","networking e territorio"]},
  {name:"NIS Medical Student",fee:"€25",description:"Il futuro della salute comincia da qui.",items:["mentoring","orientamento","volontariato e sport"]},
];

const supportFormulas=[
  {name:"NIS Sostenitore",fee:"€35",detail:null,description:"Sostieni chi si prende cura degli altri.",items:["community NIS","iniziative aperte ai sostenitori","aggiornamenti sui progetti","eventi e sostegno solidale"]},
  {name:"NIS Young Supporter",fee:"€25",detail:"18–25 anni",description:"Be NIS. Be NICE.",items:["eventi NIS","volontariato e sport","iniziative sociali","progetti per le nuove generazioni"]},
  {name:"NIS Little Supporter",fee:"€5",detail:"minorenni",description:"Piccoli sostenitori. Grandi valori.",items:["iniziative per famiglie","eventi sportivi e solidali","attività educative","campagne per bambini e ragazzi"]},
];

function ParticipationList({items}:{items:string[]}){
  return <ul>{items.map(item=><li key={item}>{item}</li>)}</ul>;
}

export default function DiventaSocioPage(){return <>
  <header className="community-hero">
    <Image className="community-hero-image" src="/images/hero-membership.jpg" alt="La community della Nazionale Italiana Sanitari" fill priority sizes="100vw"/>
    <div className="community-hero-overlay"/>
    <div className="shell community-hero-content">
      <p className="community-kicker">PROGRAMMA ASSOCIATIVO NIS</p>
      <h1>BE NIS. <span>BE NICE.</span></h1>
      <h2>Programma associativo e di supporto NIS 2026–2027</h2>
      <p>In campo per la salute, uniti per la vita.</p>
    </div>
  </header>

  <main>
    <section className="community-intro section">
      <div className="shell">
        <div className="community-section-heading">
          <p className="eyebrow">PARTECIPARE A NIS</p>
          <h2>NIS è una Community</h2>
          <p>Un’unica community, tante possibilità di partecipare.</p>
        </div>
        <div className="community-paths">
          <article className="community-path community-path-member">
            <p className="community-path-label">ASSOCIATO NIS</p>
            <h3>Su candidatura e ammissione.</h3>
            <ParticipationList items={["domanda di candidatura","valutazione da parte dell’organo competente","ammissione secondo Statuto","iscrizione nel Libro degli Associati","diritto di voto"]}/>
            <strong>Non una semplice adesione. Una responsabilità.</strong>
          </article>
          <article className="community-path community-path-open">
            <p className="community-path-label">FORMULE APERTE DELLA COMMUNITY</p>
            <h3>Partecipare, sostenere, vivere NIS.</h3>
            <ParticipationList items={["settori sportivi","medici e professionisti sanitari","studenti e giovani","sostenitori e famiglie","nessun diritto di voto"]}/>
            <strong>Conoscenza <span>•</span> Opportunità <span>•</span> Relazioni <span>•</span> Impatto</strong>
          </article>
        </div>
      </div>
    </section>

    <section className="community-application section" id="candidatura">
      <div className="shell community-application-grid">
        <aside className="community-application-note">
          <p className="eyebrow">ASSOCIATO NIS</p>
          <h2>Un percorso istituzionale</h2>
          <p>La candidatura è il primo passo per entrare nell’Associazione. La domanda viene valutata dall’organo competente e l’ammissione avviene secondo quanto previsto dallo Statuto.</p>
          <p className="community-fee-note"><strong>Quota annuale: €300</strong><span>La quota associativa è dovuta esclusivamente dopo l’ammissione. Il suo versamento non determina automaticamente l’ingresso nell’Associazione.</span></p>
        </aside>
        <ApplicationForm eyebrow="ASSOCIATO NIS" title="Diventa parte della Community NIS" intro="Invia la tua candidatura come Associato NIS."/>
      </div>
    </section>

    <section className="community-formulas section">
      <div className="shell">
        <div className="community-section-heading">
          <p className="eyebrow">PARTECIPAZIONE</p>
          <h2>Le formule NIS</h2>
          <p>Competenze, sport e partecipazione nella community NIS.</p>
        </div>
        <div className="community-associate-row">
          <div><p className="community-formula-name">ASSOCIATO NIS</p><h3>Il livello istituzionale dell’Associazione.</h3><ParticipationList items={["su candidatura","valutazione e ammissione","diritto di voto"]}/></div>
          <div className="community-formula-action"><strong>€300 <small>/ anno</small></strong><span>Quota annuale dopo l’ammissione</span><Link href="#candidatura" className="btn btn-blue">CANDIDATI</Link></div>
        </div>
        <div className="community-formula-list">
          {formulas.map(formula=><article className="community-formula-row" key={formula.name}>
            <div className="community-formula-title"><p>{formula.name}</p><strong>{formula.fee}</strong></div>
            <div><h3>{formula.description}</h3><ParticipationList items={formula.items}/></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="community-support section">
      <div className="shell">
        <div className="community-section-heading">
          <p className="eyebrow">SOSTEGNO</p>
          <h2>Le quote di sostegno NIS</h2>
          <p>Sostenere NIS significa contribuire a progetti di salute, sport e solidarietà.</p>
        </div>
        <div className="community-support-list">
          {supportFormulas.map(formula=><article className="community-support-row" key={formula.name}>
            <div className="community-formula-title"><p>{formula.name}</p><strong>{formula.fee}</strong>{formula.detail&&<span>{formula.name.includes("Young")?"Età":"Destinatari"}: {formula.detail}</span>}</div>
            <div><h3>{formula.description}</h3><ParticipationList items={formula.items}/></div>
          </article>)}
        </div>
        <p className="community-donation-note">È sempre possibile effettuare ulteriori erogazioni liberali a sostegno dei progetti NIS.</p>
      </div>
    </section>

    <section className="community-document">
      <div className="shell community-document-panel">
        <div><p>DOCUMENTO ISTITUZIONALE</p><h2>Programma associativo e di supporto NIS 2026–2027</h2>{!programmePdfAvailable&&<span>Documento in attesa di pubblicazione.</span>}</div>
        <div className="community-document-actions">
          {programmePdfAvailable?<>
            <a className="btn btn-blue" href={programmePdf} target="_blank" rel="noopener noreferrer">VISUALIZZA DOCUMENTO</a>
            <a className="btn community-document-secondary" href={programmePdf} download>SCARICA PDF</a>
          </>:<>
            <span className="btn community-document-disabled" aria-disabled="true">VISUALIZZA DOCUMENTO</span>
            <span className="btn community-document-disabled" aria-disabled="true">SCARICA PDF</span>
          </>}
        </div>
      </div>
    </section>
  </main>
</>}
