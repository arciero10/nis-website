import Link from "next/link";
import PageHero from "@/components/PageHero";
import type {Metadata} from "next";

export const metadata:Metadata={title:"News | Nazionale Italiana Sanitari",description:"Notizie, progetti e attività ufficiali della Nazionale Italiana Sanitari.",alternates:{canonical:"/news"}};

export default function Page(){return <>
  <PageHero eyebrow="NEWS" title="Le storie, i progetti," accent="le persone." intro="Comunicati, attività NIS, prevenzione, eventi e partnership. Uno spazio editoriale per raccontare l’impatto dell’Associazione." image="/images/hero-news.jpg"/>
  <section className="section soft"><div className="shell news-feature-list">
    <Link href="/progetti/il-1-battito" className="info-card"><div className="media" style={{backgroundImage:"url('/images/progetti/il-primo-battito/consegna-policlinico-2.jpg')",backgroundSize:"cover",backgroundPosition:"center top"}}/><div className="body"><div className="eyebrow">PROGETTI</div><h2>Il 1° Battito</h2><p>Sport, salute e solidarietà per sostenere donne e bambini.</p><strong>Scopri il progetto →</strong></div></Link>
  </div></section>
</>}
