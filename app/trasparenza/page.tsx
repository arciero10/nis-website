import Link from "next/link";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import {site} from "@/data/site";

export default function Page(){return <>
  <PageHero eyebrow="TRASPARENZA" title="Trasparenza." accent="Responsabilità." intro="Informazioni istituzionali e riferimenti della Nazionale Italiana Sanitari." image="/images/hero-contact.jpg"/>
  <section className="section soft"><div className="shell transparency-grid transparency-grid-live">
    <div className="doc-card"><Icon name="document" size={42}/><h2>Codice fiscale</h2><p>{site.cf}</p></div>
    <div className="doc-card"><Icon name="people" size={42}/><h2>Iscrizione RUNTS</h2><p>{site.runts}</p></div>
    <Link href="/privacy-policy" className="doc-card"><Icon name="shield" size={42}/><h2>Privacy Policy</h2><p>Consulta l’informativa sul trattamento dei dati.</p></Link>
    <Link href="/cookie-policy" className="doc-card"><Icon name="document" size={42}/><h2>Cookie Policy</h2><p>Consulta le informazioni sui cookie.</p></Link>
  </div></section>
</>}
