import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { SectionTitle } from "@/components/section-title";
import { buildMetadata } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Progetti",
  path: "/progetti",
  description:
    "Scopri i progetti benefici della Nazionale Italiana Sanitari, tra sport, prevenzione, solidarieta e sostegno concreto alle persone piu fragili.",
});

export default function ProgettiPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_32%,#f8fafc_100%)] text-slate-900">
      <PageHero
        eyebrow="Progetti"
        title="I progetti benefici della Nazionale Italiana Sanitari"
        description="Una progettualita concreta che trasforma eventi sportivi, comunita e partnership in interventi reali di cura, prevenzione e vicinanza alle persone piu fragili."
        image="/images/generic/award.jpg"
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionTitle
          eyebrow="In evidenza"
          title="Il 1° Battito"
          description="Il primo grande progetto benefico della NIS: un percorso in cui sport, solidarieta e sostegno concreto si incontrano."
        />

        <Link
          href="/progetti/il-primo-battito"
          className="mt-10 grid overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_28px_64px_rgba(15,23,42,0.1)] lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div className="relative min-h-[320px]">
            <Image
              src="/images/generic/award.jpg"
              alt="Il 1° Battito, progetto benefico della Nazionale Italiana Sanitari"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,24,39,0.12)_0%,rgba(7,24,39,0.7)_100%)]" />
            <div className="absolute left-6 top-6 rounded-full border border-white/12 bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
              Progetto benefico
            </div>
          </div>

          <div className="p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
              Quando lo sport diventa cura
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
              Il 1° Battito
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Il Quadrangolare di Beneficenza “CRAI Charity Award” ha generato un risultato
              concreto: 50.000 euro raccolti per l&apos;umanizzazione pittorica del reparto di
              Oncoematologia Pediatrica dell&apos;Ospedale Umberto I di Roma.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "50.000 euro raccolti",
                "331 mq interessati",
                "6 grandi stanze di degenza",
                "2 piccole stanze di degenza",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>

            <span className="mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
              Scopri il progetto
            </span>
          </div>
        </Link>
      </section>
    </main>
  );
}
