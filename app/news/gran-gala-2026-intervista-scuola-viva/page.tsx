import Image from "next/image";
import Link from "next/link";
import type {Metadata} from "next";
import StructuredData from "@/components/StructuredData";
import {loadScuolaVivaArticle,scuolaVivaArticle} from "@/lib/news/scuola-viva-article";
import {createBreadcrumbJsonLd,SITE_NAME,SITE_URL} from "@/lib/seo";

const canonical=`${SITE_URL}${scuolaVivaArticle.path}`;
const socialImage=`${SITE_URL}${scuolaVivaArticle.image}`;

export const metadata:Metadata={
  title:scuolaVivaArticle.title,
  description:scuolaVivaArticle.subtitle,
  alternates:{canonical},
  openGraph:{
    type:"article",
    locale:"it_IT",
    url:canonical,
    siteName:SITE_NAME,
    title:scuolaVivaArticle.title,
    description:scuolaVivaArticle.subtitle,
    publishedTime:"2026-10-22T09:00:00+02:00",
    authors:[scuolaVivaArticle.author],
    images:[{url:socialImage,width:scuolaVivaArticle.imageWidth,height:scuolaVivaArticle.imageHeight,alt:scuolaVivaArticle.imageAlt}],
  },
  twitter:{card:"summary_large_image",title:scuolaVivaArticle.title,description:scuolaVivaArticle.subtitle,images:[socialImage]},
};

export default function ScuolaVivaInterviewPage(){
  const content=loadScuolaVivaArticle();
  const highlightedQuote=content.interviews[1].answers[1];
  const articleJsonLd={
    "@context":"https://schema.org",
    "@type":"Article",
    headline:scuolaVivaArticle.title,
    description:scuolaVivaArticle.subtitle,
    datePublished:"2026-10-22",
    dateModified:"2026-10-22",
    mainEntityOfPage:canonical,
    image:[socialImage],
    author:{"@type":"Organization",name:scuolaVivaArticle.author,url:SITE_URL},
    publisher:{"@type":"Organization","@id":`${SITE_URL}/#organization`,name:SITE_NAME},
  };

  return <>
    <StructuredData data={[articleJsonLd,createBreadcrumbJsonLd([{name:"Home",path:"/"},{name:"News",path:"/news"},{name:"Intervista a Marco Evangelista",path:scuolaVivaArticle.path}])]}/>
    <article className="editorial-article">
      <header className="editorial-article-hero">
        <div className="shell editorial-article-hero-inner">
          <nav aria-label="Breadcrumb" className="editorial-breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/news">News</Link><span aria-hidden="true">/</span><span>Intervista</span></nav>
          <p className="editorial-category">{scuolaVivaArticle.category}</p>
          <h1>{scuolaVivaArticle.title}</h1>
          <p className="editorial-deck">{scuolaVivaArticle.subtitle}</p>
          <div className="editorial-meta"><time dateTime={scuolaVivaArticle.date}>22 ottobre 2026</time><span>{scuolaVivaArticle.author}</span></div>
          <figure className="editorial-cover-media editorial-cover-media-logo">
            <Image src={scuolaVivaArticle.image} alt={scuolaVivaArticle.imageAlt} width={scuolaVivaArticle.imageWidth} height={scuolaVivaArticle.imageHeight} priority sizes="(max-width: 720px) calc(100vw - 62px), 580px"/>
          </figure>
        </div>
      </header>

      <div className="shell editorial-article-body">
        <section className="editorial-introduction" aria-label="Introduzione">
          {content.introduction.map(paragraph=><p key={paragraph}>{paragraph}</p>)}
        </section>

        <blockquote className="editorial-pullquote"><p>{highlightedQuote}</p><cite>Marco Evangelista, Vice Presidente e Responsabile Tecnico di Scuola Viva</cite></blockquote>

        <section className="editorial-interview" aria-label="Intervista a Marco Evangelista">
          {content.interviews.map((item,index)=><section className="editorial-question" key={item.question}>
            <p className="editorial-question-number">DOMANDA {index+1}</p>
            <h2>{item.question}</h2>
            <div>{item.answers.map(answer=><p key={answer}>{answer}</p>)}</div>
          </section>)}
        </section>

        <section className="editorial-participation" aria-labelledby="come-partecipare">
          <p className="eyebrow">GRAN GALA CHARITY · 28 OTTOBRE 2026</p>
          <h2 id="come-partecipare">Come partecipare</h2>
          {content.participation.map(paragraph=><p key={paragraph}>{paragraph}</p>)}
          <Link className="btn gala-primary-cta" href="/i/gala-2026">ACQUISTA I BIGLIETTI</Link>
        </section>
      </div>
    </article>
  </>;
}
