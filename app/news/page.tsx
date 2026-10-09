import PageHero from "@/components/PageHero";
import NewsArchive from "@/components/NewsArchive";
import {createPageMetadata} from "@/lib/seo";

export const metadata=createPageMetadata({title:"News | Nazionale Italiana Sanitari",description:"Eventi, progetti e aggiornamenti ufficiali della Nazionale Italiana Sanitari.",path:"/news"});

export default function Page(){return <>
  <PageHero eyebrow="AGGIORNAMENTI NIS" title="News" intro="Eventi, progetti e aggiornamenti ufficiali della Nazionale Italiana Sanitari." image="/images/brand/nis-is-nice.png" path="/news"/>
  <NewsArchive/>
</>}
