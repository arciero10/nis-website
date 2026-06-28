import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { SectionTitle } from "@/components/section-title";
import { buildMetadata, featuredEvents } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Eventi",
  path: "/eventi",
  description:
    "Eventi sportivi, iniziative benefiche e appuntamenti istituzionali della Nazionale Italiana Sanitari.",
});

const eventFormats = [
  "Partite benefiche e quadrangolari solidali",
  "Giornate di prevenzione e sensibilizzazione sul territorio",
  "Iniziative speciali con partner, sponsor e istituzioni",
];

export default function EventiPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_32%,#f8fafc_100%)] text-slate-900">
      <PageHero
        eyebrow="Eventi"
        title="Appuntamenti che danno visibilità a salute e solidarietà"
        description="Gli eventi della Nazionale Italiana Sanitari sono pensati come occasioni di incontro, raccolta fondi, prevenzione e presenza pubblica sul territorio."
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionTitle
          eyebrow="In evidenza"
          title="Una programmazione costruita per generare impatto"
          description="Dai charity match alle giornate di sensibilizzazione, ogni evento è costruito per unire linguaggio sportivo e finalità sociale."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {featuredEvents.map((event) => (
            <article
              key={event.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                {event.date}
              </p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                {event.title}
              </h2>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">
                {event.location}
              </p>
              <p className="mt-4 text-base leading-7 text-slate-600">{event.description}</p>
              <Link
                href={event.slug}
                className="mt-6 inline-flex rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-900 transition hover:border-sky-300 hover:bg-white"
              >
                Approfondisci
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white/92 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
          <SectionTitle
            eyebrow="Formati"
            title="Eventi pensati per coinvolgere comunità e partner"
            description="La progettazione degli appuntamenti parte sempre da un obiettivo chiaro: rendere utile la visibilità sportiva."
          />
          <div className="grid gap-4">
            {eventFormats.map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5 text-base leading-7 text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
