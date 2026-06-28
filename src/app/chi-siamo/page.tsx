import { PageHero } from "@/components/page-hero";
import { SectionTitle } from "@/components/section-title";
import { buildMetadata } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Chi siamo",
  path: "/chi-siamo",
  description:
    "Scopri l'identità della Nazionale Italiana Sanitari: un progetto che unisce sport, salute, prevenzione e solidarietà.",
});

const pillars = [
  {
    title: "Identità pubblica",
    description:
      "Una presenza riconoscibile capace di rappresentare il valore umano e sociale del mondo sanitario.",
  },
  {
    title: "Piattaforma relazionale",
    description:
      "Un progetto aperto a istituzioni, partner, sponsor, associazioni e cittadini che condividono obiettivi concreti.",
  },
  {
    title: "Impatto territoriale",
    description:
      "Eventi, giornate di sensibilizzazione e iniziative benefiche pensate per attivare territori e comunità.",
  },
];

export default function ChiSiamoPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_34%,#f8fafc_100%)] text-slate-900">
      <PageHero
        eyebrow="Chi siamo"
        title="Una nazionale che rappresenta un progetto, non solo una disciplina"
        description="La Nazionale Italiana Sanitari nasce per dare forma a una realtà capace di unire professionisti della sanità, sport, solidarietà e responsabilità pubblica in una visione comune."
        image="/images/uniti-per-la-vita.jpg"
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-[2rem] border border-slate-200 bg-white/92 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <SectionTitle
            eyebrow="Il progetto"
            title="Una piattaforma istituzionale tra sport, prevenzione e partecipazione"
            description="La Nazionale Italiana Sanitari è un contenitore autorevole che utilizza il linguaggio dello sport per costruire attenzione, relazione e sostegno attorno a temi di salute e solidarietà."
          />
          <p className="mt-8 max-w-4xl text-lg leading-8 text-slate-600">
            Il progetto nasce con l’obiettivo di valorizzare competenze, credibilità e presenza
            pubblica del mondo sanitario, traducendole in iniziative capaci di generare utilità
            sociale. Eventi benefici, campagne di sensibilizzazione, partner istituzionali e nuovi
            percorsi disciplinari concorrono a dare forma a una visione più ampia rispetto alla
            sola dimensione sportiva.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
            >
              <div className="h-1 w-14 rounded-full bg-sky-400" />
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
                {pillar.title}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
