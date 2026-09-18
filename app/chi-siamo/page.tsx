import type {Metadata} from "next";
import PageHero from "@/components/PageHero";

export const metadata:Metadata={
  title:"Chi siamo | Nazionale Italiana Sanitari",
  description:"La Nazionale Italiana Sanitari unisce professionisti della salute, sport e solidarietà per sostenere progetti concreti.",
};

const founderStatements = [
  {
    name:"Prof. Dott. Luca Cipriano",
    role:"Presidente Onorario e Socio Fondatore NIS",
    paragraphs:[
      "Ogni giorno, come medici, viviamo la cura come una missione. Con la NIS abbiamo scelto di portare questa missione anche fuori dagli ospedali, indossando una maglia che unisce tutti gli operatori sanitari italiani.",
      "La NIS rappresenta un segno di fiducia nella vita, un inno all’unione e alla speranza.",
    ],
  },
  {
    name:"Dott. Joseph Fiore",
    role:"Manager Sanitario, Presidente Esecutivo e Socio Fondatore NIS",
    paragraphs:[
      "La Nazionale Italiana Sanitari è nata dal desiderio profondo di fare qualcosa di positivo e concreto, mettendo in campo la parte più bella di noi: la capacità di prenderci cura.",
      "Vogliamo trasmettere e coltivare valori autentici — l’impegno, la solidarietà, il rispetto, la speranza — perché solo così possiamo costruire qualcosa che resti.",
      "Il 26 settembre non è solo una data: è il primo battito di un sogno che appartiene a tutti.",
    ],
  },
  {
    name:"Notaio Edoardo Marcucci",
    role:"Tesoriere e Socio Fondatore NIS",
    paragraphs:[
      "Questo progetto è un atto d’amore verso la vita e verso chi la difende ogni giorno.",
      "Partecipare alla sua nascita come socio fondatore è un privilegio che porta con sé un impegno etico e concreto: garantire che ogni iniziativa sia trasparente, sostenibile e realmente utile a chi ne ha più bisogno.",
    ],
  },
];

export default function Page(){return <>
  <PageHero
    eyebrow="CHI SIAMO"
    title="Professionisti nella cura."
    accent="Persone nella solidarietà."
    intro="Sport, competenze sanitarie e impegno sociale uniti sotto un unico simbolo di vita, unione e speranza."
    image="/images/hero-about.jpg"
  />

  <section className="section about-intro">
    <div className="shell about-copy">
      <div className="eyebrow">LA NOSTRA IDENTITÀ</div>
      <h2 className="section-title">La cura continua anche fuori dagli ospedali.</h2>
      <p>Dalla passione per il calcio e dal desiderio di fare del bene nasce ufficialmente la Nazionale Italiana Sanitari (NIS), una squadra formata da medici, infermieri, operatori sanitari, volontari e manager del settore salute che hanno scelto di unire le proprie forze dentro e fuori dal campo con un unico obiettivo: promuovere la cultura della salute e sostenere progetti di solidarietà attraverso lo sport.</p>
      <p>La Nazionale Italiana Sanitari è un’associazione senza scopo di lucro che si propone di portare la cura e l’attenzione per gli altri anche oltre gli ospedali, promuovendo iniziative benefiche, eventi sportivi e campagne di sensibilizzazione.</p>
      <aside className="funds-pledge" aria-label="Destinazione dei fondi raccolti">
        <span aria-hidden="true">100%</span>
        <strong>Il 100% dei fondi raccolti verrà destinato a progetti concreti di cura e sostegno psico-fisico delle persone più fragili.</strong>
      </aside>
    </div>
  </section>

  <section className="section soft founder-section">
    <div className="shell">
      <div className="founder-heading">
        <div className="eyebrow">LE DICHIARAZIONI DEI FONDATORI</div>
        <h2 className="section-title">Un progetto nato per unire.</h2>
        <p>Il progetto, ideato dal Dott. Joseph Fiore e dal Prof. Dott. Luca Cipriano, e condiviso fin dal principio con il Notaio Edoardo Marcucci e con tutto il Direttivo dell’Associazione, rappresenta un nuovo modo di intendere la solidarietà: unire la sanità italiana sotto un unico simbolo di vita, unione e speranza.</p>
        <p>I soci fondatori hanno sottolineato il valore umano e simbolico dell’iniziativa.</p>
      </div>
      <div className="founder-statements">
        {founderStatements.map(founder=><article className="founder-statement" key={founder.name}>
          <blockquote>
            <span className="quote-mark" aria-hidden="true">“</span>
            {founder.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}
          </blockquote>
          <footer>
            <h3>{founder.name}</h3>
            <p>{founder.role}</p>
          </footer>
        </article>)}
      </div>
    </div>
  </section>
</>}
