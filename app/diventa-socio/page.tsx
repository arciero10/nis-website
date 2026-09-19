import type {Metadata} from "next";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import ApplicationForm from "@/components/ApplicationForm";

export const metadata:Metadata={
  title:"Diventa Socio | Nazionale Italiana Sanitari",
  description:"Invia la tua candidatura e partecipa alle attività della Nazionale Italiana Sanitari.",
  alternates:{canonical:"/diventa-socio"},
};

export default function Page(){return <>
  <PageHero eyebrow="BE NIS BE NICE" title="Il programma associativo" accent="e di supporto NIS." intro="Unisciti a una rete di professionisti e persone attive nel mondo della salute che vogliono contribuire con competenze, network, progettualità e sostegno a costruire una sanità più equa, solidale e vicina alle persone." image="/images/hero-membership.jpg"/>
  <section className="section soft"><div className="shell value-grid">
    {[["Chi può aderire","people","Professionisti della salute e figure che operano o vogliono contribuire nel mondo della salute."],["Valore aggiunto","heart","Competenze, network, capacità progettuale, disponibilità operativa e sostegno."],["Ammissione","document","Le candidature sono valutate dai tre associati fondatori, con voto a maggioranza."],["Come candidarsi","mail","Compila il form, racconta esperienza, motivazione e valore aggiunto."]].map(x=><div className="value-card" key={x[0]}><div className="orb"><Icon name={x[1]}/></div><div><h3>{x[0]}</h3><p>{x[2]}</p></div></div>)}
  </div></section>
  <section className="section"><div className="shell form-panel application-panel"><ApplicationForm/><div className="form-side form-visual" role="img" aria-label="Professionisti della salute riuniti nelle attività NIS"/></div></section>
</>}
