import Link from "next/link";
import PageHero from "@/components/PageHero";
import {site} from "@/data/site";
import {createPageMetadata} from "@/lib/seo";

export const metadata=createPageMetadata({
  title:"Condizioni di preordine NISSETTONE 2026 | Nazionale Italiana Sanitari",
  description:"Informazioni sul preordine, pagamento, ritiro e consegna del NISSETTONE 2026.",
  path:"/nissettone/condizioni",
});

export default function Page(){return <>
  <PageHero eyebrow="NISSETTONE 2026" title="Condizioni di" accent="preordine." intro="Informazioni applicabili al preordine del NISSETTONE 2026." image="/images/nissettone/nissettone-3.jpeg" path="/nissettone/condizioni"/>
  <section className="section"><div className="shell legal-content">
    <p className="legal-updated">Ultimo aggiornamento: 13 novembre 2026</p>

    <h2>1. Identificazione dell’organizzazione</h2>
    <p>L’iniziativa NISSETTONE 2026 è presentata dalla <strong>Nazionale Italiana Sanitari</strong>, codice fiscale {site.cf}. Per informazioni è possibile scrivere a <a href={`mailto:${site.email}`}>{site.email}</a>.</p>

    <h2>2. Descrizione del prodotto</h2>
    <p>Il NISSETTONE 2026 è un panettone da 1 kg al cioccolato, senza glassa, realizzato in collaborazione con la Pasticceria Antonini di Roma.</p>

    <h2>3. Prezzo e disponibilità</h2>
    <p>Il prezzo unitario è di <strong>55,00 €</strong>. La disponibilità è limitata alle quantità effettivamente presenti nel sistema al momento dell’ordine. Il riepilogo mostrato prima del pagamento indica quantità, prezzo unitario, totale e modalità di ricezione selezionata.</p>

    <h2>4. Procedura di preordine</h2>
    <p>Il cliente seleziona quantità e modalità di ricezione, inserisce i dati richiesti, consulta queste condizioni e l’informativa privacy e presta l’accettazione obbligatoria. Il sistema ricostruisce il totale lato server e crea una prenotazione temporanea; l’ordine è confermato soltanto dopo la verifica server-side del pagamento completato.</p>

    <h2>5. Pagamento tramite PayPal</h2>
    <p>Il pagamento online è gestito tramite PayPal. Il sito NIS invia a PayPal il riferimento tecnico dell’ordine, la descrizione del prodotto, la quantità, l’importo e la valuta e verifica lato server l’esito del pagamento. Il sito non acquisisce né conserva credenziali PayPal o dati dello strumento di pagamento. Le operazioni effettuate nell’interfaccia PayPal sono soggette anche alle condizioni e all’informativa del relativo fornitore.</p>

    <h2>6. Consegna e ritiro</h2>
    <p>È previsto il ritiro presso <strong>Pasticceria Sabotino, Via Sabotino 23/25, 00195 Roma</strong>. È inoltre prevista la consegna nel Comune di Roma, secondo le modalità operative comunicate e confermate in relazione all’ordine. La modalità scelta è riportata nel riepilogo prima del pagamento e nella conferma dell’ordine.</p>

    <h2>7. Disponibilità del prodotto</h2>
    <p>La disponibilità è prevista a partire dal <strong>20 novembre 2026</strong>. Le quantità sono controllate dal sistema e una prenotazione non pagata non costituisce conferma definitiva. In caso di indisponibilità prima del completamento del pagamento, il sistema impedisce la conferma dell’ordine.</p>

    <h2>8. Annullamenti, recesso e rimborsi</h2>
    <p>Per richieste relative ad annullamento, recesso o rimborso è possibile scrivere a <a href={`mailto:${site.email}`}>{site.email}</a>, indicando il numero d’ordine. Le richieste sono gestite in base allo stato dell’ordine e ai diritti riconosciuti dalla normativa applicabile. Un eventuale rimborso viene registrato nel sistema solo dopo la relativa conferma del pagamento.</p>

    <h2>9. Informazioni alimentari e allergeni</h2>
    <p>Prima del consumo è necessario consultare l’etichetta presente sulla confezione per ingredienti, allergeni, modalità di conservazione e ogni altra informazione alimentare. Per chiarimenti sul prodotto è possibile contattare l’organizzazione all’indirizzo <a href={`mailto:${site.email}`}>{site.email}</a>. Questa pagina non sostituisce le informazioni riportate sull’etichetta.</p>

    <h2>10. Finalità benefica</h2>
    <p>I proventi dell’iniziativa, al netto dei costi di produzione, sono destinati ai progetti benefici della Nazionale Italiana Sanitari.</p>

    <h2>11. Assistenza e contatti</h2>
    <p>Per assistenza sul preordine, sul pagamento o sulla modalità di ricezione è possibile scrivere a <a href={`mailto:${site.email}`}>{site.email}</a>, indicando il numero d’ordine quando disponibile.</p>

    <h2>12. Privacy Policy</h2>
    <p>Il trattamento dei dati personali connesso al preordine è descritto nella <Link href="/privacy-policy">Privacy Policy della Nazionale Italiana Sanitari</Link>.</p>
  </div></section>
</>}
