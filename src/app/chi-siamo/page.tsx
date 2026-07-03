import { PageHero } from "@/components/page-hero";
import { SectionTitle } from "@/components/section-title";
import { buildMetadata } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Chi siamo",
  path: "/chi-siamo",
  description:
    "Scopri l'identita della Nazionale Italiana Sanitari: una realta che unisce sport, salute, prevenzione e solidarieta.",
});

const founders = [
  "Prof. Dott. Luca Cipriano",
  "Dott. Joseph Fiore",
  "Notaio Edoardo Marcucci",
];

const founderStatements = [
  {
    name: "Prof. Dott. Luca Cipriano",
    role: "Presidente Onorario e Socio Fondatore NIS",
    quote:
      "Ogni giorno, come medici, viviamo la cura come una missione. Con la NIS abbiamo scelto di portare questa missione anche fuori dagli ospedali, indossando una maglia che unisce tutti gli operatori sanitari italiani. La NIS rappresenta un segno di fiducia nella vita, un inno all'unione e alla speranza.",
  },
  {
    name: "Dott. Joseph Fiore",
    role: "Manager Sanitario, Presidente Esecutivo e Socio Fondatore NIS",
    quote:
      "La Nazionale Italiana Sanitari e nata dal desiderio profondo di fare qualcosa di positivo e concreto, mettendo in campo la parte piu bella di noi: la capacita di prenderci cura. Vogliamo trasmettere e coltivare valori autentici, l'impegno, la solidarieta, il rispetto, la speranza, perche solo cosi possiamo costruire qualcosa che resti. Il 26 settembre non e solo una data: e il primo battito di un sogno che appartiene a tutti.",
  },
  {
    name: "Notaio Edoardo Marcucci",
    role: "Tesoriere e Socio Fondatore NIS",
    quote:
      "Questo progetto e un atto d'amore verso la vita e verso chi la difende ogni giorno. Partecipare alla sua nascita come socio fondatore e un privilegio che porta con se un impegno etico e concreto: garantire che ogni iniziativa sia trasparente, sostenibile e realmente utile a chi ne ha piu bisogno.",
  },
];

export default function ChiSiamoPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_34%,#f8fafc_100%)] text-slate-900">
      <PageHero
        eyebrow="Chi siamo"
        title="Chi siamo"
        description="La Nazionale Italiana Sanitari nasce per unire professionisti della salute, solidarieta e cultura sportiva in un progetto capace di generare valore umano e sociale."
        image="/images/uniti-per-la-vita.jpg"
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-[2rem] border border-slate-200 bg-white/92 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <SectionTitle
            eyebrow="La nascita della NIS"
            title="Una realta che porta la cura oltre i luoghi della cura"
            description="Dalla passione per lo sport e dal desiderio di fare del bene nasce la Nazionale Italiana Sanitari, una realta composta da medici, infermieri, operatori sanitari, volontari e professionisti del settore salute che hanno scelto di unire le proprie forze dentro e fuori dal campo."
          />

          <div className="mt-8 max-w-4xl space-y-6 text-lg leading-8 text-slate-600">
            <p>
              La NIS nasce con un obiettivo chiaro: <strong>promuovere la cultura della salute e sostenere progetti di solidarieta attraverso lo sport</strong>.
            </p>
            <p>
              La Nazionale Italiana Sanitari e un&apos;associazione senza scopo di lucro che porta la cura, l&apos;attenzione e il servizio verso gli altri anche oltre gli ospedali, attraverso iniziative benefiche, eventi sportivi e campagne di sensibilizzazione.
            </p>
            <p>
              Il <strong>100% dei fondi raccolti</strong> viene destinato a progetti concreti di cura, prevenzione e sostegno psico-fisico rivolti alle persone piu fragili.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="grid gap-8 rounded-[2rem] border border-sky-300/20 bg-[linear-gradient(120deg,rgba(56,189,248,0.12)_0%,rgba(255,255,255,0.96)_48%,rgba(226,232,240,0.92)_100%)] p-8 shadow-[0_24px_56px_rgba(15,23,42,0.1)] lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <SectionTitle
            eyebrow="La nostra missione"
            title="Un simbolo di vita, unione e speranza"
            description="La NIS vuole rappresentare una maglia capace di raccogliere il valore umano della sanita italiana e trasformarlo in azioni concrete di solidarieta."
          />

          <div className="space-y-6 text-lg leading-8 text-slate-600">
            <p>
              Attraverso lo sport, l&apos;associazione promuove valori autentici come impegno, rispetto, collaborazione, responsabilita sociale e attenzione verso chi vive situazioni di fragilita.
            </p>
            <p>
              La missione della Nazionale Italiana Sanitari e rendere visibile una comunita di professionisti che sceglie di portare il proprio senso del dovere anche nello spazio pubblico, trasformando partecipazione e visibilita in sostegno reale.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
          <SectionTitle
            eyebrow="I fondatori"
            title="Le persone che hanno dato origine al progetto"
            description="Il progetto e stato ideato dal Dott. Joseph Fiore e dal Prof. Dott. Luca Cipriano, e condiviso fin dal principio con il Notaio Edoardo Marcucci e con il Direttivo dell'Associazione."
          />

          <div className="mt-8 max-w-4xl space-y-6 text-lg leading-8 text-slate-600">
            <p>
              La nascita della Nazionale Italiana Sanitari rappresenta un nuovo modo di intendere la solidarieta: unire professionisti, istituzioni, partner e cittadini attorno a un progetto comune, fondato sulla cura e sul sostegno concreto.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {founders.map((founder) => (
              <div
                key={founder}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5 text-base font-semibold leading-7 text-slate-800"
              >
                {founder}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 pb-20">
        <SectionTitle
          eyebrow="Le dichiarazioni dei fondatori"
          title="Le voci che raccontano il senso della NIS"
          description="Tre testimonianze che definiscono la visione etica, sociale e umana alla base della Nazionale Italiana Sanitari."
        />

        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {founderStatements.map((statement) => (
            <article
              key={statement.name}
              className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
            >
              <div className="h-1 w-14 rounded-full bg-sky-400" />
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
                {statement.name}
              </h2>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">
                {statement.role}
              </p>
              <blockquote className="mt-6 border-l-2 border-amber-300 pl-5 text-base leading-8 text-slate-600">
                &ldquo;{statement.quote}&rdquo;
              </blockquote>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
