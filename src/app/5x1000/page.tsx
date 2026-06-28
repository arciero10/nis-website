import { PageHero } from "@/components/page-hero";
import { buildMetadata } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "5x1000",
  path: "/5x1000",
  description:
    "Sostieni la Nazionale Italiana Sanitari con il 5x1000. Informazioni, istruzioni e codice fiscale da inserire in dichiarazione.",
});

export default function CinquePerMillePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_32%,#f8fafc_100%)] text-slate-900">
      <PageHero
        eyebrow="5x1000"
        title="Un sostegno semplice, senza costi aggiuntivi"
        description="Destinare il 5x1000 alla Nazionale Italiana Sanitari significa contribuire alla continuità di eventi benefici, iniziative di prevenzione e progetti di utilità sociale."
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 rounded-[2rem] border border-amber-200 bg-[linear-gradient(120deg,rgba(250,204,21,0.12)_0%,rgba(255,255,255,0.96)_48%,rgba(240,249,255,0.94)_100%)] p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Come sostenere il progetto
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Firma per il 5x1000
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Nella tua dichiarazione dei redditi, scegli l’area dedicata al sostegno degli enti
              che operano in ambito sociale e inserisci il codice fiscale della Nazionale Italiana
              Sanitari.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-amber-200 bg-white/92 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Codice fiscale
            </p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              DA INSERIRE
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Placeholder sicuro in attesa di conferma del dato ufficiale.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
