import PageHero from "@/components/PageHero";
import NewsArchive from "@/components/NewsArchive";
import type {Metadata} from "next";

export const metadata:Metadata={title:"News | Nazionale Italiana Sanitari",description:"Eventi, progetti e aggiornamenti ufficiali della Nazionale Italiana Sanitari.",alternates:{canonical:"/news"}};

export default function Page(){return <>
  <PageHero eyebrow="AGGIORNAMENTI NIS" title="News" intro="Eventi, progetti e aggiornamenti ufficiali della Nazionale Italiana Sanitari." image="/images/brand/nis-is-nice.png"/>
  <NewsArchive/>
</>}
