import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import MetricStrip from "@/components/MetricStrip";

const paypalUrl="https://www.paypal.com/fundraiser/charity/6169624";
const imageBase="/images/progetti/il-primo-battito";

const galleryImages=[
  {src:`${imageBase}/consegna-policlinico-1.jpg`,width:1600,height:900,alt:"Rappresentanti della Nazionale Italiana Sanitari e del Policlinico Umberto I durante la consegna del contributo"},
  {src:`${imageBase}/consegna-policlinico-2.jpg`,width:1600,height:900,alt:"Momento istituzionale della consegna del contributo al Policlinico Umberto I di Roma"},
  {src:`${imageBase}/firma-assegno-1.jpg`,width:900,height:1600,alt:"Firma dell’assegno simbolico destinato al reparto pediatrico dell’Umberto I"},
  {src:`${imageBase}/firma-assegno-2.jpg`,width:900,height:1600,alt:"Seconda firma sull’assegno simbolico da 50.000 euro del progetto Il 1° Battito"},
];

export const metadata:Metadata={
  title:"Il 1° Battito | Nazionale Italiana Sanitari",
  description:"Il progetto NIS che ha raccolto 50.000 euro per l’Oncoematologia Pediatrica dell’Ospedale Umberto I di Roma.",
  alternates:{canonical:"/progetti/il-1-battito"},
};

export default function Page(){return <>
  <section className="battito-hero">
    <Image src={`${imageBase}/consegna-policlinico-1.jpg`} alt="Consegna del contributo del progetto Il 1° Battito al Policlinico Umberto I di Roma" fill priority sizes="100vw"/>
    <div className="battito-hero-overlay"/>
    <div className="shell battito-hero-content">
      <div className="eyebrow white">PROGETTO NIS</div>
      <h1>Il 1° Battito</h1>
      <p className="battito-concept">Quando lo sport diventa cura</p>
      <p>Un progetto concreto nato per trasformare partecipazione, sport e solidarietà in un intervento dedicato ai bambini e alle loro famiglie.</p>
    </div>
    <div className="tricolor-swoosh"/>
  </section>

  <MetricStrip/>

  <section className="section battito-result">
    <div className="shell battito-result-grid">
      <div>
        <div className="eyebrow">IL RISULTATO CONCRETO</div>
        <h2 className="section-title">Dal campo alla cura</h2>
      </div>
      <div className="battito-result-copy">
        <p>Il 15 novembre 2025 la Nazionale Italiana Sanitari ha dato vita al quadrangolare benefico “CRAI Charity Award”, nell’ambito del progetto “Il 1° Battito”.</p>
        <p>L’iniziativa ha permesso di raccogliere <strong>50.000 euro</strong>, destinati al reparto di Oncoematologia Pediatrica dell’Ospedale Umberto I di Roma.</p>
        <p>Il contributo sosterrà un intervento di umanizzazione pittorica che interesserà <strong>6 grandi stanze di degenza</strong> e <strong>2 piccole stanze</strong>, per una superficie complessiva di <strong>331 metri quadrati</strong>.</p>
      </div>
    </div>
  </section>

  <section className="section soft battito-cheque-section">
    <figure className="shell battito-cheque">
      <Image src={`${imageBase}/assegno-50000.jpg`} alt="Assegno simbolico da 50.000 euro del CRAI Charity Award per il progetto Il 1° Battito" width={1600} height={900} sizes="(max-width: 720px) calc(100vw - 40px), calc(100vw - 72px)"/>
      <figcaption>€50.000 destinati al progetto di umanizzazione pittorica dell’Oncoematologia Pediatrica dell’Umberto I di Roma.</figcaption>
    </figure>
  </section>

  <section className="section battito-gallery-section">
    <div className="shell">
      <div className="battito-gallery-heading">
        <div className="eyebrow">LA CONSEGNA</div>
        <h2 className="section-title">Il progetto diventa realtà.</h2>
      </div>
      <div className="battito-gallery">
        {galleryImages.map(image=><figure key={image.src}>
          <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 720px) calc(100vw - 40px), 50vw"/>
        </figure>)}
      </div>
    </div>
  </section>

  <section className="battito-closing">
    <div className="shell battito-closing-inner">
      <p>Per la Nazionale Italiana Sanitari, ogni partita va oltre il risultato sul campo. Ogni evento è un’occasione per costruire qualcosa che rimanga nel tempo, lasciando un segno dove ce n’è più bisogno.</p>
      <strong>Per la vita noi giochiamo, per i bambini noi lottiamo.</strong>
      <Link href={paypalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-blue">DONA ORA</Link>
    </div>
  </section>
</>}
