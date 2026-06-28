import { PageHero } from "@/components/page-hero";
import { buildMetadata } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Cookie Policy",
  path: "/cookie-policy",
  description:
    "Informazioni generali sull'uso dei cookie nel sito istituzionale della Nazionale Italiana Sanitari.",
});

const sections = [
  {
    title: "Cosa sono i cookie",
    body:
      "I cookie sono piccoli file di testo utili a migliorare il funzionamento tecnico del sito, memorizzare preferenze e supportare alcune funzionalità digitali.",
  },
  {
    title: "Tipologie di cookie",
    body:
      "Il sito può utilizzare cookie tecnici e, se attivati in futuro, eventuali strumenti statistici o servizi di terze parti da gestire secondo la normativa vigente.",
  },
  {
    title: "Gestione del consenso",
    body:
      "Qualora siano presenti cookie non tecnici, il sito dovrà attivare un sistema di raccolta del consenso conforme alle regole applicabili prima della pubblicazione definitiva.",
  },
  {
    title: "Gestione dal browser",
    body:
      "Ogni utente può limitare o disattivare i cookie direttamente dalle impostazioni del proprio browser, tenendo conto che alcune funzionalità potrebbero variare.",
  },
];

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_32%,#f8fafc_100%)] text-slate-900">
      <PageHero
        eyebrow="Informativa legale"
        title="Cookie Policy"
        description="Informazioni generali sull'uso dei cookie e sugli strumenti analoghi nel sito istituzionale della Nazionale Italiana Sanitari."
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
