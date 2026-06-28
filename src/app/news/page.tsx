import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { buildMetadata, newsItems } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "News",
  path: "/news",
  description:
    "Aggiornamenti istituzionali, notizie su eventi, discipline, sponsor e iniziative della Nazionale Italiana Sanitari.",
});

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_32%,#f8fafc_100%)] text-slate-900">
      <PageHero
        eyebrow="News"
        title="Aggiornamenti sul progetto"
        description="Una sezione editoriale pensata per raccontare evoluzione, iniziative, partnership e attività della Nazionale Italiana Sanitari."
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {newsItems.map((item) => (
            <article
              key={item.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                {item.category}
              </p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                {item.title}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{item.excerpt}</p>
              <p className="mt-5 text-sm font-medium text-slate-500">{item.date}</p>
              <Link
                href={item.slug}
                className="mt-6 inline-flex rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-900 transition hover:border-sky-300 hover:bg-white"
              >
                Approfondisci
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
