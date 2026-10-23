import Image from "next/image";
import Link from "next/link";
import type {Metadata} from "next";
import StructuredData from "@/components/StructuredData";
import {alessandroRistoriArticle,loadAlessandroRistoriArticle} from "@/lib/news/alessandro-ristori-article";
import {createBreadcrumbJsonLd,SITE_NAME,SITE_URL} from "@/lib/seo";

const canonical=`${SITE_URL}${alessandroRistoriArticle.path}`;
const socialImage=`${SITE_URL}${alessandroRistoriArticle.image}`;

export const metadata:Metadata={
  title:alessandroRistoriArticle.title,
  description:alessandroRistoriArticle.subtitle,
  alternates:{canonical},
  openGraph:{
    type:"article",
    locale:"it_IT",
    url:canonical,
    siteName:SITE_NAME,
    title:alessandroRistoriArticle.title,
    description:alessandroRistoriArticle.subtitle,
    publishedTime:"2026-10-23T12:00:00+02:00",
    authors:[alessandroRistoriArticle.author],
    images:[{
      url:socialImage,
      width:alessandroRistoriArticle.imageWidth,
      height:alessandroRistoriArticle.imageHeight,
      alt:"Alessandro Ristori, protagonista del Gran Galà NIS 2026",
    }],
  },
  twitter:{
    card:"summary_large_image",
    title:alessandroRistoriArticle.title,
    description:alessandroRistoriArticle.subtitle,
    images:[socialImage],
  },
};

export default function AlessandroRistoriInterviewPage(){
  const content=loadAlessandroRistoriArticle();
  const articleJsonLd={
    "@context":"https://schema.org",
    "@type":"Article",
    headline:alessandroRistoriArticle.title,
    description:alessandroRistoriArticle.subtitle,
    datePublished:"2026-10-23",
    dateModified:"2026-10-23",
    mainEntityOfPage:canonical,
    image:[socialImage],
    author:{"@type":"Organization",name:alessandroRistoriArticle.author,url:SITE_URL},
    publisher:{"@type":"Organization","@id":`${SITE_URL}/#organization`,name:SITE_NAME},
  };

  return <>
    <StructuredData data={[articleJsonLd,createBreadcrumbJsonLd([{name:"Home",path:"/"},{name:"News",path:"/news"},{name:"Intervista ad Alessandro Ristori",path:alessandroRistoriArticle.path}])]}/>
    <article className="editorial-article editorial-portrait-article">
      <header className="editorial-article-hero">
        <div className="shell editorial-article-hero-inner">
          <nav aria-label="Breadcrumb" className="editorial-breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/news">News</Link><span aria-hidden="true">/</span><span>Intervista</span></nav>
          <div className="editorial-portrait-hero">
            <figure className="editorial-portrait-media">
              <Image src={alessandroRistoriArticle.image} alt="Alessandro Ristori" width={alessandroRistoriArticle.imageWidth} height={alessandroRistoriArticle.imageHeight} priority sizes="(max-width: 800px) calc(100vw - 40px), 335px"/>
            </figure>
            <div className="editorial-portrait-copy">
              <p className="editorial-category">{alessandroRistoriArticle.category}</p>
              <h1>{alessandroRistoriArticle.title}</h1>
              <p className="editorial-deck">{alessandroRistoriArticle.subtitle}</p>
              <div className="editorial-meta"><time dateTime={alessandroRistoriArticle.date}>23 ottobre 2026</time><span>{alessandroRistoriArticle.author}</span></div>
            </div>
          </div>
        </div>
      </header>

      <div className="shell editorial-article-body">
        <section className="editorial-introduction" aria-label="Introduzione"><p>{content.introduction}</p></section>

        <section className="editorial-interview" aria-label={`Intervista ad ${alessandroRistoriArticle.interviewee}`}>
          {content.interviews.map((item,index)=><section className="editorial-question" key={item.question}>
            <p className="editorial-question-number">DOMANDA {index+1}</p>
            <h2>{item.question}</h2>
            <div>{item.answers.map(answer=><p key={answer}>{answer}</p>)}</div>
          </section>)}
        </section>

        <section className="editorial-participation" aria-labelledby="ristori-gran-gala">
          <p className="eyebrow">GRAN GALÀ CHARITY · 28 OTTOBRE 2026</p>
          <h2 id="ristori-gran-gala">The NIS Gala</h2>
          <p>Alessandro Ristori e The Portofinos saranno protagonisti della serata di beneficenza della Nazionale Italiana Sanitari.</p>
          <Link className="btn gala-primary-cta" href="/eventi/nis-gala-2026">SCOPRI L&apos;EVENTO</Link>
        </section>
      </div>
    </article>
  </>;
}
