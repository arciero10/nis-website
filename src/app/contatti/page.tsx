import { PageHero } from "@/components/page-hero";
import { SectionTitle } from "@/components/section-title";
import { buildMetadata } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Contatti",
  path: "/contatti",
  description:
    "Contatti istituzionali della Nazionale Italiana Sanitari per informazioni generali, attivita, eventi e comunicazione.",
});

const generalEmail = "info@nazionaleitalianasanitari.com";
const pressEmail = "ufficiostampa@nazionaleitalianasanitari.com";

export default function ContattiPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_32%,#f8fafc_100%)] text-slate-900">
      <PageHero
        eyebrow="Contatti"
        title="Contatti"
        description="Riferimenti istituzionali per informazioni, attivita, iniziative benefiche, eventi e comunicazione ufficiale della Nazionale Italiana Sanitari."
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white/92 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <SectionTitle
              eyebrow="Informazioni generali"
              title="Scrivici per richieste istituzionali e collaborative"
              description="Per informazioni generali sulla Nazionale Italiana Sanitari, sulle attivita istituzionali, sulle iniziative benefiche, sugli eventi e sulle modalita di collaborazione, e possibile scrivere a:"
            />

            <a
              href={`mailto:${generalEmail}`}
              className="mt-8 inline-flex w-full items-center justify-between rounded-[1.5rem] border border-slate-200 bg-slate-50 px-6 py-5 text-left transition hover:border-sky-300 hover:bg-white"
              aria-label={`Invia una email a ${generalEmail}`}
            >
              <span>
                <span className="block text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
                  Email generale
                </span>
                <span className="mt-2 block text-xl font-bold tracking-tight text-slate-950">
                  {generalEmail}
                </span>
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                Mailto
              </span>
            </a>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <SectionTitle
              eyebrow="Ufficio stampa"
              title="Comunicazione istituzionale e richieste media"
              description="Per comunicati, richieste media, interviste, accrediti stampa e informazioni relative alla comunicazione istituzionale:"
            />

            <a
              href={`mailto:${pressEmail}`}
              className="mt-8 inline-flex w-full items-center justify-between rounded-[1.5rem] border border-slate-200 bg-slate-50 px-6 py-5 text-left transition hover:border-sky-300 hover:bg-white"
              aria-label={`Invia una email a ${pressEmail}`}
            >
              <span>
                <span className="block text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
                  Email ufficio stampa
                </span>
                <span className="mt-2 block text-xl font-bold tracking-tight text-slate-950">
                  {pressEmail}
                </span>
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                Mailto
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
