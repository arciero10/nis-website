import Image from "next/image";
import Link from "next/link";
import FundraisingCard from "./FundraisingCard";
export default function ProjectFeature(){return <div className="project-feature">
  <div className="project-photo"><Image src="/images/child-battito.jpg" fill alt="Una bambina, simbolo del progetto Il 1° Battito" sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 50vw, 38vw"/><div className="photo-copy"><span aria-hidden="true">♡</span><strong>Il primo battito<br/>di ogni speranza.</strong><small>Più salute. Più opportunità. Più futuro.</small></div></div>
  <div className="project-intro"><div className="eyebrow">IL NOSTRO PROGETTO</div><h2>Il 1° Battito</h2><p>Il primo grande progetto benefico della NIS. Sport, emozione e solidarietà si uniscono per sostenere la salute di donne e bambini e promuovere percorsi di cura e prevenzione.</p><Link href="/progetti/il-1-battito" className="btn btn-blue">SCOPRI IL PROGETTO <span aria-hidden="true">›</span></Link></div>
  <FundraisingCard/>
</div>}
