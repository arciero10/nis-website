import type {Metadata} from "next";
import PageHero from "@/components/PageHero";
import PressArchive from "@/components/PressArchive";

export const metadata:Metadata={
  title:"Dicono di noi | Nazionale Italiana Sanitari",
  description:"La Nazionale Italiana Sanitari raccontata dalla stampa e dai media.",
  alternates:{canonical:"/dicono-di-noi"},
};

export default function Page(){return <>
  <PageHero eyebrow="RASSEGNA STAMPA" title="Dicono di noi" intro="La Nazionale Italiana Sanitari raccontata dalla stampa e dai media." image="/images/brand/nis-is-nice.png"/>
  <PressArchive/>
</>}
