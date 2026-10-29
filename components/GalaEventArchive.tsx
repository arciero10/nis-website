import Image from "next/image";
import {galaEventGalleryImages} from "@/data/gala-gallery";

export default function GalaEventArchive(){return <section className="gala-event-archive" id="gallery" aria-labelledby="gala-gallery-title">
  <div className="shell">
    <div className="gala-event-archive-heading">
      <p className="eyebrow">IL RACCONTO DELLA SERATA</p>
      <h2 id="gala-gallery-title">Volti, incontri e momenti del NIS Gala 2026</h2>
      <p>Una selezione ordinata delle immagini della serata, tra partecipazione, testimonianze e sostegno ai progetti della Nazionale Italiana Sanitari.</p>
    </div>
    <div className="gala-event-gallery" aria-label="Galleria fotografica NIS Gala 2026">
      {galaEventGalleryImages.map(image=><figure className={image.imageFit==="contain"?"is-contained":undefined} key={image.id}>
        <Image src={image.src} alt={image.alt} fill sizes="(max-width: 720px) 100vw, (max-width: 1050px) 50vw, 33vw" loading="lazy" style={{objectFit:image.imageFit??"cover",objectPosition:image.objectPosition}}/>
      </figure>)}
    </div>
    <aside className="gala-event-video" aria-label="Video ufficiale NIS Gala 2026">
      <span aria-hidden="true">▶</span>
      <div><p>VIDEO UFFICIALE</p><h3>Il racconto video della serata</h3><strong>Video ufficiale in arrivo</strong></div>
    </aside>
  </div>
</section>}
