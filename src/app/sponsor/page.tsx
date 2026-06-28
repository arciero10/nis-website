import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { SectionTitle } from "@/components/section-title";
import { buildMetadata, sponsors } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Sponsor",
  path: "/sponsor",
  description:
    "Diventa sponsor della Nazionale Italiana Sanitari e affianca un progetto di sport, salute, prevenzione e solidarietà.",
});

const benefits = [
  "Visibilità in un contesto istituzionale e ad alto valore reputazionale.",
  "Possibilità di attivazioni territoriali e iniziative condivise con partner e comunità.",
  "Associazione a un progetto credibile che unisce sport, salute e responsabilità sociale.",
];

export default function SponsorPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_32%,#f8fafc_100%)] text-slate-900">
      <PageHero
        eyebrow="Sponsor"
        title="Affianca un progetto autorevole e ad alto valore sociale"
        description="La Nazionale Italiana Sanitari costruisce partnership con aziende, brand e organizzazioni che vogliono sostenere iniziative concrete, visibili e coerenti con salute e prevenzione."
        actions={[
          { label: "Diventa partner", href: "/contatti" },
          { label: "Sostienici", href: "/sostienici", secondary: true },
        ]}
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionTitle
          eyebrow="Perché sponsorizzare"
          title="Una partnership che unisce reputazione, territorio e impatto"
          description="Sostenere la Nazionale Italiana Sanitari significa entrare in un progetto capace di parlare a pubblici diversi con un messaggio positivo e riconoscibile."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {benefits.map((item) => (
            <article
              key={item}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
            >
              <div className="h-1 w-14 rounded-full bg-amber-300" />
              <p className="mt-6 text-base leading-7 text-slate-700">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <SectionTitle
            eyebrow="Sponsor attivabili"
            title="Profili di partnership compatibili con il progetto"
            description="Le collaborazioni possono essere tecniche, territoriali, di evento o istituzionali."
            light
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {sponsors.map((sponsor) => (
              <article
                key={sponsor.name}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_42px_rgba(2,12,27,0.24)]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-200">
                  {sponsor.category}
                </p>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
                  {sponsor.name}
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-300">{sponsor.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/contatti"
              className="inline-flex rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-sky-300"
            >
              Contattaci per una partnership
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
