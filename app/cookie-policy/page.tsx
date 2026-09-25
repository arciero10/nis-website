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
    <p className="legal-updated">Ultimo aggiornamento: 25 settembre 2026</p>
    <h2>Cookie necessari</h2>
    <p>Le tecnologie necessarie sono utilizzate per finalità tecniche, di sicurezza e per memorizzare le preferenze espresse nel banner cookie. Sono sempre attive perché indispensabili al corretto funzionamento del sito e non possono essere disabilitate dal pannello.</p>
    <h2>Cookie analitici</h2>
    <p>Previo consenso, il sito utilizza Google Analytics 4 con Measurement ID G-75QQ9VW74N per produrre statistiche aggregate sull’utilizzo delle pagine e migliorare contenuti e servizi. Il tag Google Analytics non viene caricato e i relativi cookie non vengono impostati prima del consenso alla categoria analitica.</p>
    <p>Le funzionalità pubblicitarie non sono attivate. Le impostazioni relative ad archiviazione pubblicitaria, dati utente per finalità pubblicitarie e personalizzazione degli annunci restano negate.</p>
    <h2>Collegamenti a servizi esterni</h2>
    <p>Il sito contiene normali collegamenti a Instagram, Facebook, X, TikTok, YouTube e PayPal, ma non incorpora contenuti o script di tali servizi. Questi fornitori possono utilizzare cookie solo dopo che l’utente sceglie di lasciare il sito NIS e visitare i rispettivi domini, secondo le loro informative.</p>
    <h2>Gestione delle preferenze</h2>
    <p>Al primo accesso è possibile accettare tutti i cookie, mantenere solo quelli necessari oppure scegliere dal pannello se autorizzare Google Analytics. La scelta viene memorizzata in modo persistente e può essere modificata o revocata in qualsiasi momento tramite “Gestisci cookie” nel footer.</p>
    <h2>Aggiornamenti</h2>
    <p>In caso di modifica sostanziale delle categorie o delle finalità, la versione del consenso verrà aggiornata e il sito richiederà nuovamente una scelta.</p>
  </div></section>
</>}
