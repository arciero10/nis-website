import Image from "next/image";
import Link from "next/link";
import FundraisingCard from "./FundraisingCard";
export default function ProjectFeature(){return <div className="project-feature">
  <div className="project-photo project-photo-real"><Image src="/images/progetti/il-primo-battito/consegna-policlinico-1.jpg" fill alt="Nazionale Italiana Sanitari e Policlinico Umberto I alla consegna del contributo" sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 50vw, 38vw"/></div>
  <div className="project-intro"><div className="eyebrow">IL NOSTRO PROGETTO</div><h2>Il 1° Battito</h2><p>Il primo grande progetto benefico della NIS. Sport, emozione e solidarietà si uniscono per sostenere la salute di donne e bambini e promuovere percorsi di cura e prevenzione.</p><Link href="/progetti/il-1-battito" className="btn btn-blue">SCOPRI IL PROGETTO <span aria-hidden="true">›</span></Link></div>
  <FundraisingCard/>
</div>}
