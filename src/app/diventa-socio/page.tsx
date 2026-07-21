import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { SectionTitle } from "@/components/section-title";
import { buildMetadata } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Diventa Socio",
  path: "/diventa-socio",
  description:
    "Scopri come funzionera l'iscrizione associativa alla Nazionale Italiana Sanitari e la futura Tessera Socio NIS.",
});

const enrollmentSteps = [
  {
    step: "1. Domanda di ammissione",
    text: "L'utente compila il modulo con i dati richiesti e accetta statuto, regolamento e privacy.",
  },
  {
    step: "2. Versamento della quota associativa",
    text: "Il versamento della quota accompagna la domanda di ammissione e sara gestito separatamente da donazioni o altri contributi.",
  },
  {
    step: "3. Approvazione della domanda",
    text: "L'acquisizione della qualita di socio e subordinata all'approvazione secondo le modalita previste dallo Statuto NIS.",
  },
  {
    step: "4. Inserimento nel libro soci",
    text: "Dopo l'approvazione, il socio viene registrato nei sistemi associativi.",
  },
  {
    step: "5. Tessera Socio NIS",
    text: "Dopo l'attivazione, il socio ricevera una tessera digitale identificativa.",
  },
];

const membershipCardFeatures = [
  "Nome e cognome del socio",
  "Categoria di socio",
  "Numero socio",
  "Validita annuale",
  "Stato della tessera",
  "QR code di verifica",
  "Eventuali convenzioni o comunicazioni associative",
];

const applicationStates = [
  "Domanda presentata",
  "In attesa di approvazione",
  "Socio attivo",
];

const membershipCategories = [
  "Socio ordinario",
  "Socio sanitario",
  "Socio sostenitore",
  "Socio onorario",
];

export default function DiventaSocioPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_32%,#f8fafc_100%)] text-slate-900">
      <PageHero
        eyebrow="Diventa Socio"
        title="Diventa Socio NIS"
        description="Entra a far parte della Nazionale Italiana Sanitari e sostieni un progetto che unisce sport, salute, prevenzione e solidarieta."
        actions={[{ label: "Richiedi informazioni", href: "/contatti" }]}
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-[2rem] border border-slate-200 bg-white/92 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <SectionTitle
            eyebrow="Iscrizione"
            title="Come funzionera l'iscrizione"
            description="Il percorso associativo sara definito in modo chiaro, ordinato e coerente con lo Statuto NIS, distinguendo l'ammissione a socio dalle donazioni o da altri contributi."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {enrollmentSteps.map((item) => (
              <article
                key={item.step}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-6 py-6"
              >
                <h3 className="text-lg font-bold tracking-tight text-slate-950">{item.step}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <SectionTitle
              eyebrow="Tessera Socio NIS"
              title="Una tessera digitale associativa"
              description="La Tessera Socio NIS identifichera l'appartenenza all'associazione e potra essere resa disponibile in formato digitale, anche per Apple Wallet e Google Wallet, in una fase successiva del progetto."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {membershipCardFeatures.map((feature) => (
                <div
                  key={feature}
                  className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-700"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(160deg,#08233a_0%,#103252_60%,#0a1e33_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
              Anteprima concettuale
            </p>
            <div className="mt-8 rounded-[1.75rem] border border-white/12 bg-white/10 p-6 shadow-[0_18px_40px_rgba(2,12,27,0.28)] backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">
                Tessera Socio NIS
              </p>
              <h3 className="mt-5 text-2xl font-bold tracking-tight">Mario Rossi</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Categoria</p>
                  <p className="mt-2 text-base font-semibold">Socio sanitario</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Numero socio</p>
                  <p className="mt-2 text-base font-semibold">NIS-2026-0148</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Validita</p>
                  <p className="mt-2 text-base font-semibold">Annuale</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Stato</p>
                  <p className="mt-2 text-base font-semibold text-emerald-300">Attiva</p>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between gap-6">
                <div className="rounded-2xl border border-white/12 bg-white px-5 py-5 text-slate-950 shadow-sm">
                  <div className="grid grid-cols-4 gap-1">
                    {Array.from({ length: 16 }).map((_, index) => (
                      <span
                        key={`qr-${index}`}
                        className={`h-3 w-3 rounded-[2px] ${
                          index % 3 === 0 || index % 5 === 0 ? "bg-slate-950" : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-200">
                    QR di verifica
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Pagina dedicata con stato della tessera e scadenza.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <SectionTitle
              eyebrow="QR code di verifica"
              title="Verifica semplice, senza dati sensibili"
              description="Il QR code non dovra contenere dati sensibili come codice fiscale o data di nascita. Dovra invece rimandare a una pagina di verifica con identificativo univoco della tessera."
            />

            <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                Esempio di verifica
              </p>
              <div className="mt-5 grid gap-3">
                <p className="text-lg font-bold text-slate-950">Tessera NIS valida</p>
                <p className="text-base font-medium text-emerald-700">Socio attivo</p>
                <p className="text-base text-slate-600">Scadenza: 31 dicembre 2026</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <SectionTitle
                eyebrow="Stati della domanda"
                title="Tre fasi chiare del percorso associativo"
              />
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {applicationStates.map((state, index) => (
                  <div
                    key={state}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5 text-center"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Fase {index + 1}
                    </p>
                    <p className="mt-3 text-base font-bold text-slate-950">{state}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <SectionTitle
                eyebrow="Categorie associative"
                title="Prime categorie previste"
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {membershipCategories.map((category) => (
                  <div
                    key={category}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5 text-base font-semibold text-slate-800"
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-[2rem] border border-amber-200 bg-[linear-gradient(120deg,rgba(250,204,21,0.12)_0%,rgba(255,255,255,0.96)_48%,rgba(240,249,255,0.94)_100%)] p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Nota istituzionale
          </p>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-700">
            La configurazione definitiva del processo di iscrizione sara coerente con lo Statuto
            NIS. Le quote associative costituiscono entrate proprie dell'associazione e sono
            distinte da donazioni, corrispettivi o acquisti di servizi.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-[2rem] border border-sky-950/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.98)_0%,rgba(12,30,54,0.98)_54%,rgba(10,37,64,0.96)_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
              Informazioni associative
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Vuoi ricevere informazioni sull'iscrizione?
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Contattaci per conoscere modalita, quote associative e tempi di attivazione della
              Tessera Socio NIS.
            </p>
          </div>
          <div className="mt-8 lg:mt-0">
            <Link
              href="/contatti"
              className="inline-flex items-center justify-center rounded-full bg-amber-300 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-amber-200"
            >
              Contattaci
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
