import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { buildMetadata, disciplines } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Discipline",
  path: "/discipline",
  description:
    "Le discipline della Nazionale Italiana Sanitari: calcio, running e nuove aree sportive in espansione.",
});

export default function DisciplinePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_32%,#f8fafc_100%)] text-slate-900">
      <PageHero
        eyebrow="Discipline"
        title="Una visione sportiva in evoluzione"
        description="La Nazionale Italiana Sanitari valorizza il calcio come disciplina principale, apre al running e si prepara ad accogliere nuove esperienze coerenti con la sua missione."
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {disciplines.map((discipline) => (
            <article
              key={discipline.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
            >
              <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
                {discipline.status}
              </span>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
                {discipline.title}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{discipline.description}</p>
              {discipline.external ? (
                <a
                  href={discipline.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-sky-400"
                >
                  {discipline.cta}
                </a>
              ) : (
                <Link
                  href={discipline.href}
                  className="mt-6 inline-flex rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-900 transition hover:border-sky-300 hover:bg-white"
                >
                  {discipline.cta}
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
