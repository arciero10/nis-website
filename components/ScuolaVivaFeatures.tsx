import Image from "next/image";
import Link from "next/link";
import {scuolaVivaArticle} from "@/lib/news/scuola-viva-article";

export function ScuolaVivaHomeFeature(){
  return <section className="scuola-viva-home" aria-labelledby="scuola-viva-home-title">
    <div className="shell scuola-viva-home-inner">
      <div className="scuola-viva-logo-panel">
        <Image src={scuolaVivaArticle.image} alt={scuolaVivaArticle.imageAlt} width={scuolaVivaArticle.imageWidth} height={scuolaVivaArticle.imageHeight} sizes="(max-width: 720px) 240px, 310px"/>
      </div>
      <div className="scuola-viva-home-copy">
        <p className="eyebrow">22 OTTOBRE 2026 · INTERVISTE</p>
        <h2 id="scuola-viva-home-title">Gran Gala 2026: conosciamo Scuola Viva</h2>
        <h3>{scuolaVivaArticle.title}</h3>
        <p>Marco Evangelista racconta la missione dell&apos;associazione e i progetti che la raccolta fondi contribuirà a sostenere: nuove tecnologie e un laboratorio di ceramica.</p>
        <Link className="btn btn-blue" href={scuolaVivaArticle.path}>LEGGI L&apos;INTERVISTA</Link>
      </div>
    </div>
  </section>;
}

export function ScuolaVivaGalaFeature(){
  return <section className="scuola-viva-gala" aria-labelledby="scuola-viva-gala-title">
    <div className="shell scuola-viva-gala-inner">
      <div className="scuola-viva-gala-logo">
        <Image src={scuolaVivaArticle.image} alt={scuolaVivaArticle.imageAlt} width={scuolaVivaArticle.imageWidth} height={scuolaVivaArticle.imageHeight} sizes="(max-width: 720px) 240px, 300px"/>
      </div>
      <div className="scuola-viva-gala-copy">
        <p className="eyebrow">IL PROGETTO CHE SOSTENIAMO</p>
        <h2 id="scuola-viva-gala-title">Scuola Viva</h2>
        <p>La raccolta fondi del Gran Gala contribuirà a sostenere due obiettivi concreti:</p>
        <ul>
          <li>Nuovi computer e attrezzature digitali.</li>
          <li>Forno elettrico per il laboratorio di ceramica.</li>
        </ul>
        <Link className="btn btn-blue" href={scuolaVivaArticle.path}>SCOPRI IL PROGETTO E LEGGI L&apos;INTERVISTA</Link>
      </div>
    </div>
  </section>;
}
