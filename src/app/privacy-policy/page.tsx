import { PageHero } from "@/components/page-hero";
import { buildMetadata } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  path: "/privacy-policy",
  description:
    "Informativa privacy del sito istituzionale della Nazionale Italiana Sanitari.",
});

const sections = [
  {
    title: "Titolare del trattamento",
    body:
      "Il sito è riferito al progetto Nazionale Italiana Sanitari. Prima della pubblicazione definitiva dovranno essere confermati il soggetto giuridico titolare, la sede e i recapiti privacy ufficiali.",
  },
  {
    title: "Dati trattati",
    body:
      "Possono essere trattati dati di navigazione, dati inviati tramite moduli di contatto e dati necessari a gestire richieste informative, partnership o iniziative di sostegno.",
  },
  {
    title: "Finalità",
    body:
      "I dati sono trattati per rispondere alle richieste degli utenti, migliorare il funzionamento del sito, gestire comunicazioni istituzionali e presidiare sicurezza e manutenzione tecnica.",
  },
  {
    title: "Diritti dell'interessato",
    body:
      "Gli interessati possono chiedere accesso, rettifica, aggiornamento, cancellazione o limitazione del trattamento secondo quanto previsto dalla normativa applicabile.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_32%,#f8fafc_100%)] text-slate-900">
      <PageHero
        eyebrow="Informativa legale"
        title="Privacy Policy"
        description="Informazioni generali sul trattamento dei dati nel sito istituzionale della Nazionale Italiana Sanitari."
      />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="space-y-6">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-[1.75rem] border border-slate-200 bg-white/92 p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
            >
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">{section.title}</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
