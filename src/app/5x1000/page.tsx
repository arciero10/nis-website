import Image from "next/image";

import { CopyTaxCodeButton } from "@/components/copy-tax-code-button";
import { PageHero } from "@/components/page-hero";
import { SectionTitle } from "@/components/section-title";
import { buildMetadata } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "5x1000",
  path: "/5x1000",
  description:
    "Dona il tuo 5x1000 alla Nazionale Italiana Sanitari e sostieni prevenzione, solidarieta e aiuto alle persone piu fragili.",
});

const taxCode = "18254491006";

const steps = [
  "Firma nel riquadro “Sostegno degli enti del Terzo Settore” della dichiarazione dei redditi.",
  "Inserisci il codice fiscale della Nazionale Italiana Sanitari.",
];

export default function CinquePerMillePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_32%,#f8fafc_100%)] text-slate-900">
      <PageHero
        eyebrow="5x1000"
        title="Dona il tuo 5x1000 alla Nazionale Italiana Sanitari"
        description="Un gesto semplice, gratuito e concreto per sostenere solidarieta, prevenzione e aiuto alle persone piu fragili."
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-start gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white/92 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <SectionTitle
              eyebrow="Perche farlo"
              title="Un gesto semplice, gratuito e davvero utile"
              description="E un gesto semplice, gratuito e non ti costa nulla. Il 5x1000 e una quota delle tue imposte che puoi scegliere di destinare a un ente del Terzo Settore."
            />

            <div className="mt-8 max-w-3xl space-y-6 text-lg leading-8 text-slate-600">
              <p>
                Con la tua firma puoi sostenere le attivita di solidarieta, prevenzione e supporto
                promosse dalla Nazionale Italiana Sanitari, contribuendo concretamente ad aiutare
                chi ha piu bisogno.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:p-6">
            <div className="flex items-center justify-center rounded-[1.5rem] bg-slate-50 p-3 md:p-4">
              <Image
                src="/images/5x1000-nis.png"
                alt="Flyer 5x1000 della Nazionale Italiana Sanitari"
                width={1200}
                height={1600}
                priority
                className="h-auto w-full max-w-[34rem] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-8 rounded-[2rem] border border-sky-300/20 bg-[linear-gradient(120deg,rgba(56,189,248,0.12)_0%,rgba(255,255,255,0.96)_48%,rgba(226,232,240,0.92)_100%)] p-8 shadow-[0_24px_56px_rgba(15,23,42,0.1)] lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionTitle
              eyebrow="Come fare"
              title="Due passaggi semplici"
              description="Inserire il 5x1000 a favore della Nazionale Italiana Sanitari richiede pochi secondi e puo generare un aiuto reale."
            />
          </div>

          <div className="grid gap-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex gap-4 rounded-[1.5rem] border border-slate-200 bg-white/90 px-5 py-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <p className="text-base leading-7 text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 pb-20">
        <div className="grid gap-8 rounded-[2rem] border border-amber-200 bg-[linear-gradient(120deg,rgba(250,204,21,0.12)_0%,rgba(255,255,255,0.96)_48%,rgba(240,249,255,0.94)_100%)] p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Codice fiscale
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
              {taxCode}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Inserisci questo codice fiscale nel riquadro dedicato al sostegno degli enti del
              Terzo Settore.
            </p>

            <div className="mt-8">
              <CopyTaxCodeButton taxCode={taxCode} />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-amber-200 bg-white/92 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              Una firma per te, un aiuto reale per tanti.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Scegliere la Nazionale Italiana Sanitari nel tuo 5x1000 significa dare forza a
              progetti concreti di solidarieta, prevenzione e sostegno alle persone piu fragili.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
