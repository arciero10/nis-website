import type {Metadata} from "next";
import PageHero from "@/components/PageHero";

export const metadata:Metadata={
  title:"Cookie Policy | Nazionale Italiana Sanitari",
  description:"Informazioni sulle tecnologie cookie utilizzate dal sito della Nazionale Italiana Sanitari.",
  alternates:{canonical:"/cookie-policy"},
};

export default function Page(){return <>
  <PageHero eyebrow="INFORMAZIONI LEGALI" title="Cookie" accent="Policy." intro="Informazioni sulle tecnologie utilizzate dal sito della Nazionale Italiana Sanitari." image="/images/hero-contact.jpg"/>
  <section className="section"><div className="shell legal-content">
    <p className="legal-updated">Ultimo aggiornamento: 19 settembre 2026</p>
    <h2>Esito della verifica</h2>
    <p>Il codice attualmente pubblicato non installa cookie applicativi e non contiene Google Analytics, Google Tag Manager, Meta Pixel, strumenti pubblicitari o di profilazione, video YouTube incorporati, mappe Google incorporate o altri script di tracciamento di terze parti.</p>
    <h2>Cookie tecnici</h2>
    <p>Il sito riserva l’uso dei cookie alle sole funzionalità tecniche strettamente necessarie. Al momento della presente verifica non sono stati individuati nel codice cookie tecnici impostati direttamente dall’applicazione. Non essendo presenti cookie facoltativi, non viene mostrato un banner di consenso.</p>
    <h2>Cookie analytics e marketing</h2>
    <p>Non sono presenti cookie analytics, pubblicitari, di profilazione o marketing. Non vengono quindi richiesti consensi, memorizzate preferenze o indicate durate e fornitori che non risultano effettivamente presenti.</p>
    <h2>Collegamenti a servizi esterni</h2>
    <p>Il sito contiene normali collegamenti a Instagram, Facebook, X, TikTok, YouTube e PayPal, ma non incorpora contenuti o script di tali servizi. Questi fornitori possono utilizzare cookie solo dopo che l’utente sceglie di lasciare il sito NIS e visitare i rispettivi domini, secondo le loro informative.</p>
    <h2>Gestione delle preferenze</h2>
    <p>Dal collegamento “Gestisci cookie” nel footer è possibile consultare in ogni momento lo stato delle categorie. Poiché non sono attivi cookie facoltativi, non è prevista alcuna preferenza da accettare, rifiutare o revocare.</p>
    <h2>Aggiornamenti</h2>
    <p>Questa informativa dovrà essere aggiornata prima dell’eventuale introduzione di strumenti analytics, marketing, embed o altri servizi che richiedano il consenso preventivo.</p>
  </div></section>
</>}
