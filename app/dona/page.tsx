import Link from "next/link";
import PageHero from "@/components/PageHero";
import FundraisingCard from "@/components/FundraisingCard";
import type {Metadata} from "next";

export const metadata:Metadata={title:"Dona | Nazionale Italiana Sanitari",description:"Scopri come sostenere i progetti della Nazionale Italiana Sanitari.",alternates:{canonical:"/dona"}};

export default function Page(){return <>
  <PageHero eyebrow="DONA ORA" title="Sostieni un progetto" accent="che lascia il segno." intro="Il tuo contributo aiuta la Nazionale Italiana Sanitari a trasformare sport, competenze e solidarietà in iniziative concrete." image="/images/hero-support.jpg"/>
  <section className="section soft"><div className="shell support-donation">
    <div className="project-text"><div className="eyebrow">SOSTIENI NIS</div><h2 className="section-title">Dona con consapevolezza.</h2><p>Per ricevere le modalità di donazione e tutte le informazioni sulla destinazione del contributo, contatta direttamente la segreteria NIS.</p><a className="btn btn-blue" href="mailto:info@nazionaleitalianasanitari.com?subject=Richiesta%20informazioni%20donazione">RICHIEDI LE MODALITÀ DI DONAZIONE</a><Link className="text-link" href="/progetti/il-1-battito">Scopri Il 1° Battito →</Link></div>
    <FundraisingCard/>
  </div></section>
</>}
