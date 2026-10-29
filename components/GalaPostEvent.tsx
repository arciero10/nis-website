import Image from "next/image";
import {galaGalleryPreviewImages} from "@/data/gala-gallery";

export default function GalaPostEvent(){return <section className="gala-post-event" aria-labelledby="gala-post-event-title">
  <div className="shell">
    <div className="gala-post-event-heading">
      <div>
        <p className="eyebrow">NIS GALA CHARITY NIGHT 2026</p>
        <h2 id="gala-post-event-title">Rivivi il NIS Gala 2026</h2>
        <p>Volti, incontri e momenti istituzionali di una serata dedicata alla solidarietà e ai progetti della Nazionale Italiana Sanitari.</p>
      </div>
      <a className="btn btn-blue" href="#gala-gallery-preview">GUARDA LA GALLERY</a>
    </div>

    <div className="gala-post-event-layout">
      <div className="gala-post-event-gallery" id="gala-gallery-preview" aria-label="Anteprima fotografica NIS Gala 2026">
        {galaGalleryPreviewImages.map((image,index)=><figure className={index===0?"is-featured":undefined} key={image.src}>
          <Image src={image.src} alt={image.alt} fill sizes={index===0?"(max-width: 720px) 100vw, 55vw":"(max-width: 720px) 50vw, 28vw"} loading="lazy" style={{objectPosition:image.objectPosition}}/>
        </figure>)}
      </div>
      <aside className="gala-post-event-video" aria-label="Video ufficiale NIS Gala 2026">
        <span aria-hidden="true">▶</span>
        <p>VIDEO UFFICIALE</p>
        <strong>Video ufficiale in arrivo</strong>
      </aside>
    </div>
  </div>
</section>}
