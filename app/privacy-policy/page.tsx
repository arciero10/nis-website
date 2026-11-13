import PageHero from "@/components/PageHero";
import {site} from "@/data/site";
import {createPageMetadata} from "@/lib/seo";

export const metadata=createPageMetadata({
  title:"Privacy Policy | Nazionale Italiana Sanitari",
  description:"Informativa sul trattamento dei dati personali attraverso il sito della Nazionale Italiana Sanitari.",
  path:"/privacy-policy",
});

export default function Page(){return <>
  <PageHero eyebrow="PRIVACY POLICY" title="Privacy" accent="Policy." intro="Informazioni sul trattamento dei dati personali attraverso il sito della Nazionale Italiana Sanitari." image="/images/hero-contact.jpg" path="/privacy-policy"/>
  <section className="section"><div className="shell legal-content">
    <p className="legal-updated">Ultimo aggiornamento: 13 novembre 2026</p>
    <h2>Titolare del trattamento</h2>
    <p><strong>Nazionale Italiana Sanitari</strong><br/>Codice fiscale: {site.cf}</p>
    <p>Per richieste relative alla protezione dei dati personali è possibile scrivere a <a href={`mailto:${site.email}`}>{site.email}</a>. Non sono pubblicati sul sito una sede legale, una PEC o un diverso indirizzo privacy verificato.</p>
    <h2>Categorie di dati trattati</h2>
    <p>Durante la navigazione possono essere trattati i dati tecnici necessari alla trasmissione delle comunicazioni e alla sicurezza del servizio, come indirizzo IP, data e ora della richiesta, risorsa richiesta e informazioni tecniche del browser.</p>
    <p>Attraverso il modulo di candidatura sono raccolti nome, cognome, email, eventuale numero di telefono, professione o ruolo, eventuale ambito sanitario, città, eventuale area di interesse, motivazione o messaggio e attestazione del consenso privacy.</p>
    <h2>Ordini e preordini NISSETTONE 2026</h2>
    <p>Per gestire ordini e preordini del NISSETTONE 2026 il sito raccoglie nome e cognome del referente, indirizzo email, numero di telefono, tipologia di acquirente e modalità di ricezione scelta. In caso di consegna sono trattati indirizzo, numero civico, CAP, città, eventuali dettagli e note necessari alla verifica e alla gestione della consegna; in caso di ritiro viene registrata la modalità selezionata.</p>
    <p>Quando richiesto dalla tipologia di acquirente o dalla richiesta di un documento fiscale, possono essere raccolti denominazione o ragione sociale, codice fiscale, partita IVA se presente, indirizzo fiscale, codice SDI, PEC ed email amministrativa. Il sistema registra inoltre prodotto, quantità, prezzo unitario, importo totale, valuta, numero e stato dell’ordine, stato del pagamento, modalità di consegna o ritiro e stato dell’eventuale documento amministrativo.</p>
    <p>Questi dati sono trattati per adottare misure precontrattuali richieste dall’interessato, concludere e gestire il rapporto relativo all’ordine, verificare il pagamento, organizzare ritiro o consegna, fornire assistenza e adempiere agli obblighi amministrativi, contabili e fiscali applicabili. Le basi giuridiche sono l’esecuzione di misure precontrattuali e contrattuali e, per gli adempimenti prescritti, l’adempimento di obblighi legali. I dati tecnici e di audit strettamente necessari alla sicurezza, alla prevenzione di abusi e alla tutela dei sistemi sono trattati sulla base del legittimo interesse del titolare.</p>
    <p>Il sito non acquisisce né conserva credenziali PayPal o dati dello strumento di pagamento. Per avviare e verificare il pagamento comunica a PayPal un riferimento tecnico dell’ordine, la descrizione del prodotto, la quantità, l’importo e la valuta; conserva gli identificativi dell’ordine e della cattura PayPal e gli stati necessari alla riconciliazione. PayPal tratta i dati raccolti direttamente durante il pagamento secondo la propria informativa.</p>
    <p>Le comunicazioni transazionali relative al NISSETTONE sono inviate tramite Microsoft Graph con autenticazione applicativa server-side, usando la casella dedicata configurata dall’organizzazione. Il servizio riceve destinatario, oggetto e contenuto del messaggio necessari alla consegna; credenziali applicative e token di accesso non sono esposti al browser.</p>
    <p>I dati sono accessibili alle persone autorizzate che seguono ordini, amministrazione, assistenza e logistica e ai fornitori tecnici necessari ai servizi sopra descritti. Sono conservati per la gestione operativa e, successivamente, per i soli obblighi applicabili o per la tutela dei diritti, senza indicare durate non ancora verificate. L’interessato può esercitare i diritti descritti nelle sezioni finali di questa informativa scrivendo a <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
    <h2>Finalità e basi giuridiche</h2>
    <p>I dati tecnici di navigazione sono trattati per erogare il sito, garantirne la sicurezza e prevenire abusi, sulla base della necessità tecnica del servizio e del legittimo interesse del titolare alla sicurezza dei propri sistemi.</p>
    <p>I dati della candidatura sono trattati per ricevere, valutare e gestire la richiesta, rispondere all’interessato e ricontattarlo. Il trattamento si basa sul consenso espresso tramite il modulo e, quando applicabile, sull’esecuzione di misure adottate su richiesta dell’interessato.</p>
    <p>Previo consenso, il sito utilizza Google Analytics 4 per elaborare statistiche sull’utilizzo delle pagine e comprendere come migliorare contenuti e servizi. La base giuridica di questo trattamento è il consenso, che può essere negato o revocato in qualsiasi momento tramite “Gestisci cookie” nel footer.</p>
    <h2>Tempi di conservazione</h2>
    <p>I dati sono conservati per il tempo necessario a gestire la candidatura o la richiesta e, successivamente, solo per il periodo richiesto da obblighi di legge o per la tutela dei diritti del titolare. Il sito non mantiene un database locale delle candidature. I tentativi di invio non riusciti non vengono archiviati dall’applicazione.</p>
    <p>I dati degli ordini NISSETTONE sono conservati per la gestione del preordine, del pagamento, del ritiro o della consegna, dell’assistenza e degli eventuali adempimenti amministrativi. Terminata la gestione operativa, sono conservati soltanto per i tempi richiesti dagli obblighi applicabili o necessari alla tutela dei diritti dell’organizzazione e dell’interessato. Non viene indicato un termine fisso non ancora verificato rispetto alla tipologia dei documenti e agli obblighi effettivamente applicabili.</p>
    <h2>Destinatari e fornitori</h2>
    <p>I dati possono essere consultati dalle persone autorizzate della Nazionale Italiana Sanitari che gestiscono ordini, amministrazione, assistenza e logistica, nei limiti delle rispettive funzioni, e dai fornitori tecnici strettamente necessari all’erogazione e alla sicurezza del sito. Per il NISSETTONE sono utilizzati PayPal per il pagamento e Microsoft Graph per le email transazionali. Google Analytics è utilizzato come servizio di misurazione esclusivamente dopo il consenso alla categoria analitica. I fornitori trattano i dati secondo i rispettivi ruoli, condizioni e informative; la loro eventuale nomina a responsabili avviene quando richiesta dalla normativa applicabile.</p>
    <h2>Trasferimenti fuori dallo Spazio Economico Europeo</h2>
    <p>L’eventuale trattamento effettuato da Google Analytics, PayPal e Microsoft è regolato dalle condizioni e dalle garanzie applicabili ai rispettivi servizi. Il tag di misurazione non viene caricato prima del consenso analytics. Per eventuali trasferimenti fuori dallo Spazio Economico Europeo si applicano gli strumenti e le garanzie previsti dalla normativa e indicati dai fornitori nelle rispettive informative.</p>
    <h2>Revoca del consenso analytics</h2>
    <p>La preferenza può essere modificata in qualsiasi momento tramite “Gestisci cookie”. La revoca impedisce i successivi caricamenti e invii analytics dal sito e comporta la rimozione dei cookie Google Analytics accessibili all’applicazione.</p>
    <h2>Donazioni e servizi esterni</h2>
    <p>I pulsanti “Dona ora” conducono alla pagina informativa interna dedicata alla donazione, dalla quale è possibile proseguire verso il sito esterno di PayPal. Il sito NIS non raccoglie né conserva direttamente dati di pagamento, credenziali o informazioni finanziarie. Il trattamento effettuato da PayPal avviene secondo l’informativa del relativo fornitore dopo che l’utente sceglie di aprire il collegamento esterno.</p>
    <h2>Diritti dell’interessato</h2>
    <p>L’interessato può chiedere accesso, rettifica, cancellazione, limitazione o portabilità dei dati, opporsi al trattamento e revocare il consenso senza pregiudicare la liceità del trattamento precedente alla revoca. Può inoltre proporre reclamo al Garante per la protezione dei dati personali.</p>
    <h2>Come esercitare i diritti</h2>
    <p>Le richieste possono essere inviate a <a href={`mailto:${site.email}`}>{site.email}</a>, indicando le informazioni necessarie a identificare la richiesta e il diritto che si intende esercitare.</p>
  </div></section>
</>}
