import type {Metadata} from "next";
import PageHero from "@/components/PageHero";
import {site} from "@/data/site";

export const metadata:Metadata={
  title:"Privacy Policy | Nazionale Italiana Sanitari",
  description:"Informativa sul trattamento dei dati personali attraverso il sito della Nazionale Italiana Sanitari.",
  alternates:{canonical:"/privacy-policy"},
};

export default function Page(){return <>
  <PageHero eyebrow="INFORMAZIONI LEGALI" title="Privacy" accent="Policy." intro="Informazioni sul trattamento dei dati personali attraverso il sito della Nazionale Italiana Sanitari." image="/images/hero-contact.jpg"/>
  <section className="section"><div className="shell legal-content">
    <p className="legal-updated">Ultimo aggiornamento: 19 settembre 2026</p>
    <h2>Titolare del trattamento</h2>
    <p><strong>Nazionale Italiana Sanitari</strong><br/>Codice fiscale: {site.cf}</p>
    <p>Per richieste relative alla protezione dei dati personali è possibile scrivere a <a href={`mailto:${site.email}`}>{site.email}</a>. Non sono pubblicati sul sito una sede legale, una PEC o un diverso indirizzo privacy verificato.</p>
    <h2>Categorie di dati trattati</h2>
    <p>Durante la navigazione possono essere trattati i dati tecnici necessari alla trasmissione delle comunicazioni e alla sicurezza del servizio, come indirizzo IP, data e ora della richiesta, risorsa richiesta e informazioni tecniche del browser.</p>
    <p>Attraverso il modulo di candidatura sono raccolti nome, cognome, email, eventuale numero di telefono, professione o ruolo, eventuale ambito sanitario, città, eventuale area di interesse, motivazione o messaggio e attestazione del consenso privacy.</p>
    <h2>Finalità e basi giuridiche</h2>
    <p>I dati tecnici di navigazione sono trattati per erogare il sito, garantirne la sicurezza e prevenire abusi, sulla base della necessità tecnica del servizio e del legittimo interesse del titolare alla sicurezza dei propri sistemi.</p>
    <p>I dati della candidatura sono trattati per ricevere, valutare e gestire la richiesta, rispondere all’interessato e ricontattarlo. Il trattamento si basa sul consenso espresso tramite il modulo e, quando applicabile, sull’esecuzione di misure adottate su richiesta dell’interessato.</p>
    <h2>Tempi di conservazione</h2>
    <p>I dati sono conservati per il tempo necessario a gestire la candidatura o la richiesta e, successivamente, solo per il periodo richiesto da obblighi di legge o per la tutela dei diritti del titolare. Il sito non mantiene un database locale delle candidature. I tentativi di invio non riusciti non vengono archiviati dall’applicazione.</p>
    <h2>Destinatari e fornitori</h2>
    <p>I dati possono essere consultati dalle persone autorizzate della Nazionale Italiana Sanitari e dai fornitori tecnici strettamente necessari all’erogazione e alla sicurezza del sito, nominati responsabili del trattamento quando richiesto. L’invio email del modulo è predisposto tecnicamente ma, allo stato attuale, non risulta configurato un provider email operativo.</p>
    <h2>Trasferimenti fuori dallo Spazio Economico Europeo</h2>
    <p>Nel codice attualmente attivo non sono stati individuati servizi analytics, marketing o incorporamenti di terze parti che comportino trasferimenti di dati. Prima dell’attivazione di un eventuale provider email dovranno essere verificate e documentate la localizzazione del trattamento e le relative garanzie per gli eventuali trasferimenti extra UE.</p>
    <h2>Donazioni e servizi esterni</h2>
    <p>I pulsanti “Dona ora” aprono il sito esterno di PayPal. Il sito NIS non raccoglie né conserva direttamente dati di pagamento, credenziali o informazioni finanziarie. Il trattamento effettuato da PayPal avviene secondo l’informativa del relativo fornitore dopo che l’utente sceglie di aprire il collegamento esterno.</p>
    <h2>Diritti dell’interessato</h2>
    <p>L’interessato può chiedere accesso, rettifica, cancellazione, limitazione o portabilità dei dati, opporsi al trattamento e revocare il consenso senza pregiudicare la liceità del trattamento precedente alla revoca. Può inoltre proporre reclamo al Garante per la protezione dei dati personali.</p>
    <h2>Come esercitare i diritti</h2>
    <p>Le richieste possono essere inviate a <a href={`mailto:${site.email}`}>{site.email}</a>, indicando le informazioni necessarie a identificare la richiesta e il diritto che si intende esercitare.</p>
  </div></section>
</>}
