import PageHero from "@/components/PageHero";
import {site} from "@/data/site";

export default function Page(){return <>
  <PageHero eyebrow="INFORMAZIONI LEGALI" title="Privacy" accent="Policy." intro="Informazioni essenziali sul trattamento dei dati personali attraverso il sito NIS." image="/images/hero-contact.jpg"/>
  <section className="section"><div className="shell legal-content">
    <h2>Titolare del trattamento</h2>
    <p>Nazionale Italiana Sanitari, CF {site.cf}. Per richieste relative alla privacy: <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
    <h2>Dati trattati</h2>
    <p>Il sito raccoglie i dati forniti volontariamente attraverso il modulo di candidatura, inclusi dati identificativi, recapiti, informazioni professionali e il contenuto del messaggio. Questi dati sono utilizzati esclusivamente per valutare la candidatura, gestire la richiesta e ricontattare l’interessato, nel rispetto della normativa applicabile.</p>
    <h2>Diritti dell’interessato</h2>
    <p>È possibile chiedere accesso, rettifica, cancellazione, limitazione o opposizione al trattamento scrivendo all’indirizzo indicato.</p>
  </div></section>
</>}
