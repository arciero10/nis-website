import Link from "next/link";
import PageHero from "@/components/PageHero";

export default function Page(){return <>
  <PageHero eyebrow="NEWS" title="Le storie, i progetti," accent="le persone." intro="Comunicati, attività NIS, prevenzione, eventi e partnership. Uno spazio editoriale per raccontare l’impatto dell’Associazione." image="/images/hero-news.jpg"/>
  <section className="section soft"><div className="shell home-cards home-cards-essential">
    <Link href="/progetti/il-1-battito" className="info-card"><div className="media" style={{backgroundImage:"url('/images/child-battito.jpg')",backgroundSize:"cover",backgroundPosition:"center"}}/><div className="body"><div className="eyebrow">PROGETTI</div><h2>Il 1° Battito</h2><p>Sport, salute e solidarietà per sostenere donne e bambini.</p><strong>Scopri il progetto →</strong></div></Link>
    <div className="empty-state compact"><div className="eyebrow">AGGIORNAMENTI NIS</div><h2>Nuove storie in arrivo.</h2><p>Le notizie ufficiali saranno pubblicate dopo la loro approvazione.</p></div>
  </div></section>
</>}
