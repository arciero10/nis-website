import Image from "next/image";
import Link from "next/link";

import { SectionTitle } from "@/components/section-title";
import { buildMetadata } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Il 1° Battito",
  path: "/progetti/il-primo-battito",
  description:
    "Il 1° Battito, il primo progetto benefico della Nazionale Italiana Sanitari: quando lo sport diventa cura.",
});

const highlightCards = [
  "50.000 euro raccolti",
  "Oncoematologia Pediatrica",
  "Ospedale Umberto I di Roma",
  "331 mq da trasformare",
];

const teams = [
  "Nazionale Italiana Sanitari (NIS)",
  "Nazionale Italiana Giornaliste e Giornalisti (NIG)",
  "Selezione Ufficiale Fideuram Private Banker",
  "Nazionale Italiana Campioni Olimpionici (NICO)",
];

const departmentAreas = [
  "6 grandi stanze di degenza",
  "2 piccole stanze di degenza",
];

export default function IlPrimoBattitoPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_30%,#f8fafc_100%)] text-slate-900">
      <section className="relative overflow-hidden border-b border-white/10 bg-[linear-gradient(135deg,#071827_0%,#0e2b47_60%,#071827_100%)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_24%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2 bg-[linear-gradient(90deg,#0b7a3c_0%,#0b7a3c_33%,#f5f5f5_33%,#f5f5f5_66%,#c61f2b_66%,#c61f2b_100%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-sky-100 backdrop-blur-sm">
              Progetto benefico
            </span>
            <h1 className="mt-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
              Il 1° Battito
            </h1>
            <p className="mt-4 text-2xl font-semibold text-emerald-300 md:text-3xl">
              Quando lo sport diventa cura
            </p>
            <p className="mt-6 text-lg leading-8 text-white/86">
              Il primo progetto benefico della Nazionale Italiana Sanitari, nato per portare
              cura, attenzione e speranza anche al di fuori degli ospedali, attraverso sport,
              solidarieta e coinvolgimento della comunita.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-[0_24px_60px_rgba(2,12,27,0.24)] backdrop-blur-sm">
            <div className="relative min-h-[280px] overflow-hidden rounded-[1.75rem] border border-white/10">
              <Image
                src="/images/generic/award.jpg"
                alt="Quadrangolare di Beneficenza CRAI Charity Award"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,24,39,0.08)_0%,rgba(7,24,39,0.72)_100%)]" />
              <div className="absolute bottom-5 left-5 rounded-[1.5rem] border border-white/12 bg-white/12 px-5 py-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                  Risultato raccolto
                </p>
                <p className="mt-2 text-3xl font-bold text-white">50.000 euro</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {highlightCards.map((item) => (
            <article
              key={item}
              className="rounded-[1.75rem] border border-slate-200 bg-white px-6 py-7 shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
                Evidenza
              </p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">{item}</h2>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <SectionTitle
              eyebrow="Il quadrangolare"
              title="Una giornata di sport, comunita e solidarieta"
              description="Il 15 novembre 2025 la Nazionale Italiana Sanitari ha dato vita a un progetto destinato a lasciare un segno concreto: “Il 1° Battito”, un'iniziativa nata con l'obiettivo di portare cura, attenzione e speranza anche al di fuori degli ospedali, attraverso lo sport, la solidarieta e il coinvolgimento della comunita."
            />
            <div className="mt-8 space-y-6 text-lg leading-8 text-slate-600">
              <p>
                Il primo appuntamento del progetto e stato il Quadrangolare di Beneficenza “CRAI
                Charity Award”, ospitato presso il La Salle Sport di Roma.
              </p>
              <p>
                Una giornata aperta gratuitamente a tutti, arricchita da un'area food &
                beverage, laboratori creativi dedicati ai bambini e, soprattutto, da un grande
                messaggio di solidarieta.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <SectionTitle
              eyebrow="Le squadre in campo"
              title="Quattro realta, un solo obiettivo"
              description="Sul terreno di gioco si sono affrontate quattro realta unite dagli stessi valori."
            />
            <div className="mt-8 grid gap-4">
              {teams.map((team) => (
                <div
                  key={team}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5 text-base font-semibold leading-7 text-slate-800"
                >
                  {team}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <SectionTitle
              eyebrow="L'obiettivo benefico"
              title="Sostenere il reparto di Oncoematologia Pediatrica"
              description="L'obiettivo era uno solo: sostenere il reparto di Oncoematologia Pediatrica dell'Ospedale Umberto I di Roma, diretto dalla Dott.ssa Loredana Amoroso."
            />
            <div className="mt-8 space-y-6 text-lg leading-8 text-slate-600">
              <p>
                Grazie alla straordinaria partecipazione del pubblico e alla fiducia degli
                sponsor che hanno scelto di sostenere il progetto, sono stati raccolti 50.000
                euro, interamente destinati alla realizzazione di un importante intervento di
                umanizzazione pittorica del reparto.
              </p>
              <p>
                Per la Nazionale Italiana Sanitari, ogni partita va oltre il risultato sul
                campo. Ogni evento e un'occasione per costruire qualcosa che rimanga nel tempo,
                lasciando un segno dove ce n'e piu bisogno.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <SectionTitle
              eyebrow="L'intervento nel reparto"
              title="331 mq da trasformare per accogliere i piccoli pazienti"
              description="Il progetto interessera 6 grandi stanze di degenza e 2 piccole stanze di degenza, per una superficie complessiva di 331 metri quadrati."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {departmentAreas.map((area) => (
                <div
                  key={area}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5 text-base font-semibold leading-7 text-slate-800"
                >
                  {area}
                </div>
              ))}
            </div>
            <p className="mt-8 text-lg leading-8 text-slate-600">
              Gli ambienti verranno completamente trasformati attraverso opere artistiche pensate
              per renderli piu accoglienti, colorati e rassicuranti per i piccoli pazienti e le
              loro famiglie. I lavori prenderanno il via nel prossimo inverno e rappresentano il
              primo risultato concreto del progetto “Il 1° Battito”: la dimostrazione che lo
              sport puo trasformarsi in uno strumento capace di migliorare realmente la vita delle
              persone.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-[2rem] border border-amber-200 bg-[linear-gradient(120deg,rgba(250,204,21,0.14)_0%,rgba(255,255,255,0.98)_48%,rgba(240,249,255,0.94)_100%)] p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <p className="text-center text-2xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Per la vita noi giochiamo, per i bambini noi lottiamo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 rounded-[2rem] border border-sky-950/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.98)_0%,rgba(12,30,54,0.98)_54%,rgba(10,37,64,0.96)_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
              Sostieni i progetti NIS
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Lo sport puo lasciare un segno concreto
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Aiutaci a sostenere nuovi interventi di cura, prevenzione e umanizzazione degli
              spazi dedicati alle persone piu fragili.
            </p>
          </div>
          <div className="flex justify-start lg:justify-end">
            <Link
              href="/sostienici"
              className="inline-flex items-center justify-center rounded-full bg-amber-300 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-amber-200"
            >
              Dona ora
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
