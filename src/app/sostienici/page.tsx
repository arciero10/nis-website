import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { SectionTitle } from "@/components/section-title";
import { buildMetadata } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Sostienici",
  path: "/sostienici",
  description:
    "Sostieni la Nazionale Italiana Sanitari con donazioni, partnership, eventi e 5x1000.",
});

const supportWays = [
  {
    title: "Donazione libera",
    description:
      "Un contributo immediato per sostenere eventi, campagne di prevenzione e iniziative solidali.",
  },
  {
    title: "Partnership e sponsor",
    description:
      "Un percorso strutturato per aziende e organizzazioni che vogliono affiancare il progetto.",
  },
  {
    title: "5x1000",
    description:
      "Uno strumento semplice per dare continuità al progetto istituzionale della Nazionale Italiana Sanitari.",
  },
];

const donationOptions = ["10 €", "25 €", "50 €", "100 €", "250 €", "Importo libero"];

export default function SostieniciPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_32%,#f8fafc_100%)] text-slate-900">
      <PageHero
        eyebrow="Sostienici"
        title="Dai continuità a un progetto che mette la salute al centro"
        description="Con il tuo sostegno, la Nazionale Italiana Sanitari può rafforzare eventi, partnership e iniziative di prevenzione al servizio delle comunità."
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionTitle
          eyebrow="Come aiutarci"
          title="Tre modi per sostenere il progetto"
          description="Il supporto può arrivare da persone, aziende, partner e realtà territoriali che condividono la missione della Nazionale Italiana Sanitari."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {supportWays.map((way) => (
            <article
              key={way.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
            >
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">{way.title}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{way.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-8 rounded-[2rem] border border-sky-950/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.98)_0%,rgba(12,30,54,0.98)_54%,rgba(10,37,64,0.96)_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] lg:grid-cols-[1fr_0.95fr]">
          <div>
            <SectionTitle
              eyebrow="Dona ora"
              title="Scegli il tuo contributo"
              description="La struttura tecnica per il pagamento online potrà essere collegata successivamente a una piattaforma dedicata. Intanto il sito presenta una sezione pronta per il go-live istituzionale."
              light
            />
            <div className="mt-8 flex flex-wrap gap-3">
              {donationOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/15"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-6 backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
              Altri strumenti di sostegno
            </p>
            <div className="mt-5 grid gap-4">
              <Link
                href="/5x1000"
                className="rounded-[1.25rem] border border-white/10 bg-white/10 px-5 py-4 text-base font-semibold text-white transition hover:bg-white/15"
              >
                Vai alla sezione 5x1000
              </Link>
              <Link
                href="/sponsor"
                className="rounded-[1.25rem] border border-white/10 bg-white/10 px-5 py-4 text-base font-semibold text-white transition hover:bg-white/15"
              >
                Scopri le opportunità per sponsor e partner
              </Link>
              <Link
                href="/contatti"
                className="rounded-[1.25rem] border border-white/10 bg-white/10 px-5 py-4 text-base font-semibold text-white transition hover:bg-white/15"
              >
                Contattaci per una collaborazione
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
