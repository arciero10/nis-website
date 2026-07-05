import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { SectionTitle } from "@/components/section-title";
import { buildMetadata, sponsors } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Sponsor",
  path: "/sponsor",
  description:
    "Diventa sponsor della Nazionale Italiana Sanitari e affianca un progetto di sport, salute, prevenzione e solidarieta.",
});

const benefits = [
  "Visibilita in un contesto istituzionale e ad alto valore reputazionale.",
  "Possibilita di attivazioni territoriali e iniziative condivise con partner e comunita.",
  "Associazione a un progetto credibile che unisce sport, salute e responsabilita sociale.",
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
          eyebrow="Perche sponsorizzare"
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
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-white/15" />
            <p className="text-center text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
              Sponsor e partner
            </p>
            <span className="h-px flex-1 bg-white/15" />
          </div>

          <h2 className="mx-auto mt-5 max-w-3xl text-center text-3xl font-bold tracking-tight md:text-4xl">
            Una griglia pronta ad accogliere la rete di partner del progetto
          </h2>

          <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
            {sponsors.map((sponsor) => (
              <div key={sponsor.name} className="flex items-center justify-center px-4 py-2">
                {"logoSrc" in sponsor && sponsor.logoSrc ? (
                  <Image
                    src={sponsor.logoSrc}
                    alt={`Logo ${sponsor.name}`}
                    width={240}
                    height={88}
                    className="h-14 w-auto max-w-full object-contain sm:h-16"
                  />
                ) : (
                  <span className="text-center text-sm font-semibold uppercase tracking-[0.22em] text-white/78">
                    {sponsor.name}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
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
