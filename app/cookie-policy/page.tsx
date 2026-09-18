import PageHero from "@/components/PageHero";

export default function Page(){return <>
  <PageHero eyebrow="INFORMAZIONI LEGALI" title="Cookie" accent="Policy." intro="Informazioni sull’uso dei cookie nel sito NIS." image="/images/hero-contact.jpg"/>
  <section className="section"><div className="shell legal-content">
    <h2>Cookie utilizzati</h2>
    <p>Il sito non utilizza cookie di profilazione o strumenti pubblicitari. Possono essere impiegate esclusivamente tecnologie tecniche necessarie al corretto funzionamento e alla sicurezza delle pagine.</p>
    <h2>Collegamenti esterni</h2>
    <p>I collegamenti ai social network portano a servizi esterni, che applicano le rispettive informative privacy e cookie.</p>
  </div></section>
</>}
