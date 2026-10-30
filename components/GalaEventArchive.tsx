import Link from "next/link";
import EventVideoGallery from "@/components/EventVideoGallery";
import GalaSponsorStrip from "@/components/GalaSponsorStrip";
import ProjectGallery from "@/components/ProjectGallery";
import {galaEventGalleryImages} from "@/data/gala-gallery";
import {galaReel,galaYoutubeChannelUrl,galaYoutubeVideos} from "@/data/gala-videos";

const supportedProjects=[
  {name:"Scuola Viva",description:"Percorsi, strumenti e nuove opportunità per persone con disabilità e per le loro famiglie.",href:"/news/gran-gala-2026-intervista-scuola-viva"},
  {name:"Giardino dell’Oncologia Pediatrica",description:"Un progetto dedicato agli spazi di cura e all’accoglienza dei bambini e delle loro famiglie."},
  {name:"Spirito NIS",description:"Sport, scuola, rispetto e responsabilità per accompagnare i giovani nella crescita.",href:"/progetti/spirito-nis"},
  {name:"NIS Care",description:"Prevenzione e informazione sanitaria attraverso le competenze dei professionisti NIS."},
];

export default function GalaEventArchive(){return <>
  <section className="gala-event-introduction" aria-labelledby="gala-introduction-title"><div className="shell gala-event-introduction-inner">
    <div><p className="eyebrow">NIS GALA CHARITY NIGHT 2026</p><h2 id="gala-introduction-title">Una comunità riunita per trasformare la partecipazione in cura.</h2></div>
    <p>Il 28 ottobre 2026, negli spazi di Another Studio a Roma, la Nazionale Italiana Sanitari ha riunito professionisti della salute, rappresentanti delle istituzioni, sportivi, artisti, aziende e sostenitori per condividere risultati, progetti e nuove prospettive di solidarietà.</p>
  </div></section>

  <section className="gala-event-story" aria-labelledby="gala-story-title"><div className="shell gala-event-story-layout">
    <header><p className="eyebrow">IL RACCONTO</p><h2 id="gala-story-title">Dalla nascita della NIS a una serata di impegno concreto</h2><p className="gala-event-story-lead">Un percorso iniziato nel settembre 2025 e cresciuto attraverso sport, salute e responsabilità sociale.</p></header>
    <div className="gala-event-story-body">
      <h3>Un progetto diventato comunità</h3>
      <p>La Nazionale Italiana Sanitari è nata nel settembre 2025 dall’iniziativa di Joseph Fiore e Luca Cipriano, condivisa fin dall’inizio con Edoardo Marcucci e con il Consiglio Direttivo. Il Gala ha offerto l’occasione per ripercorrere un anno di attività e per raccontare una rete che mette competenze sanitarie, sport e partecipazione al servizio delle persone.</p>
      <p>Nel corso del suo primo anno, la NIS ha presentato un bilancio di oltre 60.000 euro raccolti per progetti benefici, oltre mille giocattoli donati e numerose iniziative sportive e solidali. Risultati costruiti attraverso il contributo di professionisti, volontari, sostenitori e realtà che hanno scelto di condividere gli stessi valori.</p>

      <h3>Dallo sport alla cura</h3>
      <p>Tra i passaggi centrali della serata, il progetto “Il 1º Battito” ha raccontato come un evento sportivo possa produrre un risultato concreto: 50.000 euro destinati all’intervento di umanizzazione pittorica dell’Oncoematologia Pediatrica del Policlinico Umberto I di Roma.</p>
      <p>Il racconto ha poi guardato ai progetti sostenuti dal Gala: Scuola Viva, il giardino dell’Oncologia Pediatrica, Spirito NIS e NIS Care. Per NIS Care è intervenuto il <strong>Dott. Dimitrios Varvaras, medico chirurgo senologo</strong>, nel quadro delle attività dedicate alla prevenzione e all’informazione sanitaria.</p>

      <h3>Nuovi settori, la stessa responsabilità</h3>
      <p>La serata ha presentato anche la crescita dei settori sportivi NIS e le nuove opportunità di coinvolgimento della comunità. Gli interventi istituzionali hanno ribadito il valore di un’associazione capace di unire professionisti della salute e società civile attorno a obiettivi misurabili.</p>
      <p>La conduzione di Cristiana Buonamano e Federico Mosca ha accompagnato testimonianze, musica e spettacolo in un’unica narrazione: quella di una comunità che sceglie di esserci, mettendo in relazione competenze, energie e solidarietà.</p>
    </div>
  </div></section>

  <section className="gala-event-projects" aria-labelledby="gala-projects-title"><div className="shell">
    <div className="gala-event-section-heading"><p className="eyebrow">PROGETTI SOSTENUTI</p><h2 id="gala-projects-title">Quattro direzioni, un impegno comune</h2><p>Durante la serata è stata illustrata una destinazione della raccolta articolata per il 60% a Scuola Viva, il 30% al Policlinico Umberto I e il 10% a Spirito NIS. Le percentuali descrivono la ripartizione presentata, non un consuntivo finale della raccolta.</p></div>
    <div className="gala-event-project-grid">{supportedProjects.map((project,index)=><article key={project.name}><span>{String(index+1).padStart(2,"0")}</span><h3>{project.name}</h3><p>{project.description}</p>{project.href&&<Link href={project.href}>Approfondisci <span aria-hidden="true">→</span></Link>}</article>)}</div>
  </div></section>

  <section className="gala-event-archive" id="gallery" aria-labelledby="gala-gallery-title"><div className="shell">
    <div className="gala-event-archive-heading"><p className="eyebrow">GALLERY FOTOGRAFICA</p><h2 id="gala-gallery-title">I momenti del NIS Gala Charity Night 2026</h2><p>Una selezione dei momenti più significativi della serata. Apri la gallery per scorrere tutte le fotografie.</p></div>
    <ProjectGallery images={galaEventGalleryImages} previewCount={5} className="gala-event-gallery is-compact" mainImageSizes="(max-width: 720px) calc(100vw - 40px), 1180px" thumbnailSizes="(max-width: 720px) calc((100vw - 49px) / 2), (max-width: 1050px) 25vw, 280px"/>
  </div></section>

  <EventVideoGallery reel={galaReel} poster={galaEventGalleryImages[0].src} videos={galaYoutubeVideos} channelUrl={galaYoutubeChannelUrl}/>

  <section className="gala-event-partners" aria-labelledby="gala-partners-title"><div className="shell"><h2 className="sr-only" id="gala-partners-title">Sponsor e partner del NIS Gala 2026</h2><GalaSponsorStrip/></div></section>

  <section className="gala-event-related" aria-labelledby="gala-related-title"><div className="shell">
    <div className="gala-event-section-heading"><p className="eyebrow">DAL GALA</p><h2 id="gala-related-title">Voci e approfondimenti</h2></div>
    <div className="gala-event-related-links"><Link href="/news/gran-gala-2026-intervista-alessandro-ristori"><span>INTERVISTA</span><strong>Alessandro Ristori: sport, musica e solidarietà</strong><small>Leggi l’intervista →</small></Link><Link href="/news/gran-gala-2026-intervista-scuola-viva"><span>PROGETTO</span><strong>Scuola Viva e gli obiettivi sostenuti dal Gala</strong><small>Leggi l’intervista →</small></Link></div>
  </div></section>
</>}
