import { PageHero } from "@/components/page-hero";
import { buildMetadata, contactInfo } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Contatti",
  path: "/contatti",
  description:
    "Contatta la Nazionale Italiana Sanitari per informazioni, sponsorship, partnership, eventi e iniziative di sostegno.",
});

const contactCards = [
  {
    title: "Informazioni generali",
    value: contactInfo.email,
  },
  {
    title: "Ufficio stampa",
    value: contactInfo.pressEmail,
  },
  {
    title: "Presenza territoriale",
    value: contactInfo.city,
  },
];

export default function ContattiPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_32%,#f8fafc_100%)] text-slate-900">
      <PageHero
        eyebrow="Contatti"
        title="Parliamo di progetto, eventi e collaborazioni"
        description="La Nazionale Italiana Sanitari è disponibile per richieste istituzionali, sponsor, partnership, eventi benefici e informazioni generali."
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-5">
            {contactCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                  {card.title}
                </p>
                <p className="mt-4 text-xl font-bold tracking-tight text-slate-950">{card.value}</p>
              </article>
            ))}
          </div>

          <form
            action={`mailto:${contactInfo.email}`}
            method="post"
            encType="text/plain"
            className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              Form contatti
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
              Invia una richiesta
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Compila il form per richiedere informazioni su eventi, partnership, donazioni o
              collaborazioni istituzionali.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-600">
                Nome
                <input
                  name="Nome"
                  type="text"
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white"
                />
              </label>
              <label className="text-sm font-semibold text-slate-600">
                Email
                <input
                  name="Email"
                  type="email"
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white"
                />
              </label>
              <label className="text-sm font-semibold text-slate-600 md:col-span-2">
                Oggetto
                <input
                  name="Oggetto"
                  type="text"
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white"
                />
              </label>
              <label className="text-sm font-semibold text-slate-600 md:col-span-2">
                Messaggio
                <textarea
                  name="Messaggio"
                  rows={6}
                  required
                  className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-8 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-sky-400"
            >
              Invia richiesta
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
