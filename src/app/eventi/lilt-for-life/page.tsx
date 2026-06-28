import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { SectionTitle } from "@/components/section-title";
import { buildMetadata } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "LILT for Life - Prevenzione in campo",
  path: "/eventi/lilt-for-life",
  description:
    "Scheda istituzionale dell'evento LILT for Life, appuntamento dedicato a prevenzione, solidarietà e raccolta fondi.",
});

const highlights = [
  "Evento benefico con finalità di sensibilizzazione e raccolta fondi.",
  "Coinvolgimento di partner territoriali, pubblico e realtà istituzionali.",
  "Messaggio centrale: portare la prevenzione in contesti accessibili e partecipati.",
];

export default function LiltForLifeEventPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_34%,#f8fafc_100%)] text-slate-900">
      <PageHero
        eyebrow="Evento speciale"
        title="LILT for Life - Prevenzione in campo"
        description="Un appuntamento che unisce sport, presenza pubblica e sensibilizzazione, con una forte vocazione territoriale e solidale."
        actions={[{ label: "Torna agli eventi", href: "/eventi" }]}
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <Image
              src="/images/events/frosinone.jpg"
              alt="Locandina LILT for Life"
              width={570}
              height={800}
              className="w-full rounded-[1.5rem] object-cover"
            />
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <SectionTitle
              eyebrow="Scheda evento"
              title="Informazioni principali"
              description="LILT for Life è un esempio concreto di come la Nazionale Italiana Sanitari possa trasformare l’evento sportivo in un momento di utilità pubblica."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <InfoTile label="Data" value="9 giugno 2026" />
              <InfoTile label="Orario" value="18:00" />
              <InfoTile label="Luogo" value="Stadio Benito Stirpe, Frosinone" wide />
              <InfoTile
                label="Finalità"
                value="Sostegno a iniziative di prevenzione e raccolta fondi per LILT Frosinone."
                wide
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-8 rounded-[2rem] border border-sky-950/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.98)_0%,rgba(12,30,54,0.98)_54%,rgba(10,37,64,0.96)_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] lg:grid-cols-[0.95fr_1.05fr]">
          <SectionTitle
            eyebrow="Valore dell'iniziativa"
            title="Un modello replicabile di sport e prevenzione"
            description="L’evento mostra come la visibilità sportiva possa diventare uno strumento efficace per promuovere salute, partecipazione e solidarietà."
            light
          />
          <div className="grid gap-4">
            {highlights.map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-white/10 bg-white/8 px-5 py-5 text-base leading-7 text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/contatti"
            className="inline-flex rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-sky-400"
          >
            Richiedi informazioni
          </Link>
        </div>
      </section>
    </main>
  );
}

function InfoTile({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div
      className={`rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-bold leading-7 text-slate-900">{value}</p>
    </div>
  );
}
