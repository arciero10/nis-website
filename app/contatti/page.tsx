import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import {site} from "@/data/site";
export default function Page(){return <>
<PageHero eyebrow="CONTATTI" title="Parliamo di progetti, persone e" accent="possibilità." intro="Contatta NIS per proposte di partecipazione, partnership, supporto o per ricevere informazioni sui nostri progetti. Insieme possiamo fare di più." image="/images/hero-contact.jpg"/>
<section className="section soft"><div className="shell contact-grid"><div className="contact-panel"><h2 className="section-title">Scrivici</h2><p className="section-lead">Per informazioni, proposte e collaborazioni puoi contattare direttamente la segreteria NIS.</p><a className="btn btn-blue" href={`mailto:${site.email}`}>INVIA UNA EMAIL</a></div><div className="contact-panel"><h2 className="section-title">I nostri contatti</h2><div className="contact-row"><Icon name="mail"/><p><strong>Informazioni</strong><br/><a href={`mailto:${site.email}`}>{site.email}</a></p></div><div className="contact-row"><Icon name="mail"/><p><strong>Ufficio stampa</strong><br/><a href={`mailto:${site.pressEmail}`}>{site.pressEmail}</a></p></div></div></div></section>
</>}
