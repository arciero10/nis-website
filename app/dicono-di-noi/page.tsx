import PageHero from "@/components/PageHero";
import PressArchive from "@/components/PressArchive";
import {createPageMetadata} from "@/lib/seo";

export const metadata=createPageMetadata({
  title:"Dicono di noi | Nazionale Italiana Sanitari",
  description:"La Nazionale Italiana Sanitari raccontata dalla stampa e dai media.",
  path:"/dicono-di-noi",
});

export default function Page(){return <>
  <PageHero eyebrow="RASSEGNA STAMPA" title="Dicono di noi" intro="La Nazionale Italiana Sanitari raccontata dalla stampa e dai media." image="/images/brand/nis-is-nice.png" path="/dicono-di-noi"/>
  <PressArchive/>
</>}
