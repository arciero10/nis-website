import type {Metadata} from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import CopyTaxCode from "@/components/CopyTaxCode";

export const metadata:Metadata={
  title:"5x1000 | Nazionale Italiana Sanitari",
  description:"Destina il tuo 5x1000 alla Nazionale Italiana Sanitari. Un gesto gratuito per sostenere attività solidali e di prevenzione.",
  alternates:{canonical:"/5x1000"},
};

export default function Page(){return <>
  <PageHero
    eyebrow="5X1000"
    title="Dona il tuo 5x1000 alla"
    accent="Nazionale Italiana Sanitari"
    intro="È un gesto semplice, gratuito e non ti costa nulla. Si tratta di una quota delle tue tasse che puoi scegliere a chi destinare."
    image="/images/5x1000-nis.png"
  />

  <section className="section five-per-thousand">
    <div className="shell five-layout">
      <div className="five-content">
        <div className="eyebrow">COME FARE</div>
        <h2 className="section-title">Bastano una firma e il nostro codice fiscale.</h2>
        <div className="tax-steps">
          <article className="tax-step">
            <span aria-hidden="true">1</span>
            <div><h3>Firma</h3><p>Firma nel riquadro “Sostegno degli enti del terzo settore” della dichiarazione dei redditi.</p></div>
          </article>
          <article className="tax-step">
            <span aria-hidden="true">2</span>
            <div><h3>Inserisci il codice fiscale</h3><p>Riporta il codice fiscale della Nazionale Italiana Sanitari nello spazio dedicato.</p></div>
          </article>
        </div>
        <CopyTaxCode/>
      </div>
      <figure className="five-flyer">
        <Image src="/images/5x1000-nis.png" alt="Locandina 5x1000 della Nazionale Italiana Sanitari" width={1254} height={1254} sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 44vw, 520px"/>
      </figure>
    </div>
  </section>

  <section className="five-closing">
    <div className="shell five-closing-inner">
      <p>Con il tuo contributo sosterrai le attività solidali e di prevenzione della Nazionale Italiana Sanitari, aiutando concretamente chi ha più bisogno.</p>
      <strong>Una firma per te, un aiuto reale per tanti.</strong>
    </div>
  </section>
</>}
