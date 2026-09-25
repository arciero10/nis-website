import PageHero from "@/components/PageHero";
import NewsArchive from "@/components/NewsArchive";
import type {Metadata} from "next";

export const metadata:Metadata={title:"News e Rassegna stampa | Nazionale Italiana Sanitari",description:"Notizie, eventi e rassegna stampa della Nazionale Italiana Sanitari: sport, salute, prevenzione e solidarietà.",alternates:{canonical:"/news"}};

export default function Page(){return <>
  <PageHero eyebrow="NEWS & MEDIA" title="News &" accent="Rassegna stampa" intro="Le notizie, gli eventi e gli articoli dedicati alla Nazionale Italiana Sanitari." image="/images/brand/nis-is-nice.png"/>
  <NewsArchive/>
</>}
