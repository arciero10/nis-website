import { PageHero } from "@/components/page-hero";
import { SectionTitle } from "@/components/section-title";
import { buildMetadata } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Missione",
  path: "/missione",
  description:
    "La missione della Nazionale Italiana Sanitari: trasformare sport, prevenzione e solidarietà in azioni concrete al servizio della salute.",
});

const missionAreas = [
  "Sostenere progetti di prevenzione e iniziative di sensibilizzazione ad alto impatto pubblico.",
  "Creare eventi sportivi benefici capaci di attivare territori, sponsor e istituzioni.",
  "Dare visibilità a un messaggio positivo in cui la salute è bene comune e responsabilità condivisa.",
];

export default function MissionePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_32%,#f8fafc_100%)] text-slate-900">
      <PageHero
        eyebrow="Missione"
        title="Usare lo sport come strumento di salute, prevenzione e solidarietà"
        description="La missione della Nazionale Italiana Sanitari è costruire occasioni concrete in cui partecipazione pubblica, responsabilità sociale e attenzione alle persone si incontrano."
        image="/images/team/lineup.jpg"
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white/92 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
          <SectionTitle
            eyebrow="Visione"
            title="Una missione che supera il perimetro del campo"
            description="La Nazionale Italiana Sanitari non è pensata come semplice squadra, ma come piattaforma capace di rendere visibili valori, relazioni e iniziative utili."
          />
          <div className="grid gap-4">
            {missionAreas.map((area) => (
              <div
                key={area}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5 text-base leading-7 text-slate-700"
              >
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
