import Image from "next/image";
import Link from "next/link";
export default function ProjectFeature(){return <article className="project-feature">
  <div className="project-photo project-photo-real"><Image src="/images/progetti/il-primo-battito/consegna-policlinico-1.jpg" fill alt="Nazionale Italiana Sanitari e Policlinico Umberto I alla consegna del contributo" sizes="(max-width: 720px) calc(100vw - 40px), 52vw"/></div>
  <div className="project-intro">
    <div className="eyebrow">PROGETTO IN EVIDENZA</div>
    <h3>Il 1° Battito</h3>
    <p>Il primo grande progetto benefico della NIS. Sport, emozione e solidarietà si uniscono per sostenere la salute di donne e bambini e promuovere percorsi di cura e prevenzione.</p>
    <div className="project-impact" aria-label="Risultato della raccolta fondi"><strong>€50.000</strong><span>raccolti · obiettivo raggiunto</span></div>
    <Link href="/progetti/il-1-battito" className="btn btn-blue">SCOPRI IL PROGETTO <span aria-hidden="true">→</span></Link>
  </div>
</article>}
