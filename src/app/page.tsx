import Image from "next/image";
import Link from "next/link";

import { SectionTitle } from "@/components/section-title";
import {
  buildMetadata,
  disciplines,
  featuredEvents,
  newsItems,
  siteName,
  socialLinks,
  sponsors,
} from "@/lib/site-data";

export const metadata = buildMetadata({
  title: siteName,
  path: "/",
});

const missionPoints = [
  "Promuovere salute e prevenzione attraverso linguaggi sportivi accessibili.",
  "Creare eventi benefici capaci di coinvolgere istituzioni, partner e cittadini.",
  "Valorizzare il ruolo sociale dei professionisti della sanita nel progetto.",
];

export default function Home() {
  const featuredEventImages = [
    "/images/events/frosinone.jpg",
    "/images/team/community.jpg",
    "/images/generic/award.jpg",
  ];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#0d2238_18%,#f8fafc_18%,#eef2f7_100%)] text-slate-900">
      <section className="relative min-h-[78vh] overflow-hidden border-b border-white/10">
        <Image
          src="/images/uniti-per-la-vita.jpg"
          alt="Nazionale Italiana Sanitari in un momento istituzionale sul campo"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,24,39,0.38),rgba(7,24,39,0.82)),radial-gradient(circle_at_top_left,rgba(250,204,21,0.16),transparent_22%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_24%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2 bg-[linear-gradient(90deg,#0b7a3c_0%,#0b7a3c_33%,#f5f5f5_33%,#f5f5f5_66%,#c61f2b_66%,#c61f2b_100%)]" />

        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl items-center px-6 py-20 md:py-28">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-100 backdrop-blur-sm">
              Sito istituzionale ufficiale
            </p>
            <h1 className="mt-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
              Nazionale Italiana Sanitari
            </h1>
            <p className="mt-4 text-2xl font-semibold text-amber-200 md:text-3xl">
              Sport, prevenzione e solidarieta al servizio della salute
            </p>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/85">
              La Nazionale Italiana Sanitari promuove eventi sportivi, iniziative solidali e
              progetti di prevenzione che uniscono professionisti della sanita, istituzioni,
              partner e cittadini.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-sky-100/90 md:text-base">
              Il calcio e oggi la disciplina piu visibile del progetto e avra un proprio sviluppo
              dedicato sul subdominio ufficiale, all&apos;interno di una visione piu ampia tra sport,
              salute e solidarieta.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/sostienici"
                aria-label="Dona ora e sostieni la Nazionale Italiana Sanitari"
                className="inline-flex items-center justify-center rounded-full bg-amber-300 px-8 py-4 text-base font-semibold uppercase tracking-[0.16em] text-slate-950 shadow-[0_18px_40px_rgba(250,204,21,0.28)] transition hover:bg-amber-200 hover:shadow-[0_22px_44px_rgba(250,204,21,0.34)]"
              >
                Dona ora
              </Link>
              <Link
                href="/chi-siamo"
                aria-label="Scopri il progetto della Nazionale Italiana Sanitari"
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-white/15"
              >
                Scopri il progetto
              </Link>
              <Link
                href="/5x1000"
                aria-label="Vai alla sezione 5x1000"
                className="inline-flex items-center justify-center rounded-full border border-sky-300/40 bg-sky-400/12 px-7 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-sky-100 transition hover:bg-sky-400/18"
              >
                5x1000
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm font-medium text-white/80">
              <a
                href={socialLinks.calcio}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vai al futuro sito calcio della Nazionale Italiana Sanitari"
                className="inline-flex items-center rounded-full border border-white/20 bg-white/8 px-5 py-3 transition hover:bg-white/12"
              >
                Area calcio dedicata
              </a>
              <Link
                href="/discipline"
                aria-label="Vai alla pagina discipline"
                className="inline-flex items-center rounded-full border border-white/20 bg-white/8 px-5 py-3 transition hover:bg-white/12"
              >
                Tutte le discipline
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 rounded-[2rem] border border-slate-200 bg-white/92 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div className="order-2 lg:order-1">
            <SectionTitle
              eyebrow="Missione"
              title="Una piattaforma che usa lo sport per generare impatto sociale"
              description="La Nazionale Italiana Sanitari nasce per trasformare visibilita, relazioni e presenza pubblica in occasioni concrete di prevenzione, sostegno e partecipazione."
            />
          </div>
          <div className="grid gap-4">
            {missionPoints.map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5 text-base leading-7 text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="order-1 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-950 shadow-[0_18px_42px_rgba(15,23,42,0.12)] lg:order-2">
            <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[320px]">
                <Image
                  src="/images/team/lineup.jpg"
                  alt="Squadra della Nazionale Italiana Sanitari sul campo"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="grid gap-0">
                <div className="relative min-h-[160px]">
                  <Image
                    src="/images/team/community.jpg"
                    alt="Momento di solidarieta e comunita della Nazionale Italiana Sanitari"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative min-h-[160px]">
                  <Image
                    src="/images/generic/award.jpg"
                    alt="Rappresentanza istituzionale e attivita benefica della Nazionale Italiana Sanitari"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <SectionTitle
          eyebrow="Eventi in evidenza"
          title="Appuntamenti che uniscono sport, prevenzione e raccolta fondi"
          description="Il progetto si esprime attraverso eventi benefici e attivazioni territoriali capaci di coinvolgere pubblico, partner e realta locali."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {featuredEvents.map((event) => (
            <Link
              key={event.title}
              href="/eventi"
              aria-label={`Vai alla sezione eventi e scopri ${event.title}`}
              className="group block cursor-pointer rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)]"
            >
              <div className="relative mb-5 overflow-hidden rounded-[1.25rem] bg-slate-100">
                <Image
                  src={featuredEventImages[featuredEvents.indexOf(event)] ?? "/images/events/frosinone.jpg"}
                  alt={`Immagine collegata a ${event.title}`}
                  width={900}
                  height={640}
                  className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                {event.date}
              </p>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                {event.title}
              </h3>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">
                {event.location}
              </p>
              <p className="mt-4 text-base leading-7 text-slate-600">{event.description}</p>
              <span className="mt-6 inline-flex rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-900 transition group-hover:border-sky-300 group-hover:bg-white">
                Vai agli eventi
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionTitle
          eyebrow="Discipline"
          title="Un progetto aperto a piu linguaggi sportivi"
          description="La disciplina calcio resta centrale, ma la Nazionale Italiana Sanitari si presenta come una piattaforma in evoluzione, pronta ad accogliere nuovi percorsi."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {disciplines.map((discipline) =>
            discipline.external ? (
              <a
                key={discipline.title}
                href={discipline.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Vai alla sezione ${discipline.title}`}
                className="group block cursor-pointer rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,250,252,0.92)_100%)] p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)]"
              >
                <div className="relative mb-5 overflow-hidden rounded-[1.25rem] bg-slate-100">
                  <Image
                    src={
                      discipline.title === "Calcio"
                        ? "/images/team/lineup.jpg"
                        : discipline.title === "Running"
                          ? "/images/team/community.jpg"
                          : "/images/generic/award.jpg"
                    }
                    alt={`Immagine rappresentativa della disciplina ${discipline.title}`}
                    width={900}
                    height={640}
                    className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
                  {discipline.status}
                </span>
                <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
                  {discipline.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-slate-600">{discipline.description}</p>
                <span className="mt-6 inline-flex rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition group-hover:bg-sky-400">
                  {discipline.cta}
                </span>
              </a>
            ) : (
              <Link
                key={discipline.title}
                href={discipline.href}
                aria-label={`Vai alla sezione ${discipline.title}`}
                className="group block cursor-pointer rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,250,252,0.92)_100%)] p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)]"
              >
                <div className="relative mb-5 overflow-hidden rounded-[1.25rem] bg-slate-100">
                  <Image
                    src={
                      discipline.title === "Calcio"
                        ? "/images/team/lineup.jpg"
                        : discipline.title === "Running"
                          ? "/images/team/community.jpg"
                          : "/images/generic/award.jpg"
                    }
                    alt={`Immagine rappresentativa della disciplina ${discipline.title}`}
                    width={900}
                    height={640}
                    className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
                  {discipline.status}
                </span>
                <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
                  {discipline.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-slate-600">{discipline.description}</p>
                <span className="mt-6 inline-flex rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-900 transition group-hover:border-sky-300">
                  {discipline.cta}
                </span>
              </Link>
            ),
          )}
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <SectionTitle
            eyebrow="Sponsor"
            title="Partner che scelgono un progetto autorevole e utile"
            description="La Nazionale Italiana Sanitari dialoga con brand, organizzazioni e realta territoriali che condividono salute, responsabilita sociale e attenzione alle persone."
            light
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {sponsors.map((sponsor) => (
              <Link
                key={sponsor.name}
                href="/sponsor"
                aria-label={`Vai alla sezione sponsor e scopri ${sponsor.name}`}
                className="group block cursor-pointer rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_42px_rgba(2,12,27,0.24)] transition hover:-translate-y-1 hover:border-sky-300/40 hover:bg-white/8"
              >
                <div className="mb-5 flex h-20 items-center justify-center rounded-[1.25rem] border border-white/8 bg-white/8">
                  <span className="text-center text-lg font-bold uppercase tracking-[0.12em] text-white">
                    {sponsor.name}
                  </span>
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-200">
                  {sponsor.category}
                </p>
                <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">
                  {sponsor.name}
                </h3>
                <p className="mt-4 text-base leading-7 text-slate-300">{sponsor.description}</p>
                <span className="mt-6 inline-flex text-sm font-semibold uppercase tracking-[0.14em] text-sky-200">
                  Vai agli sponsor
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 rounded-[2rem] border border-amber-200 bg-[linear-gradient(120deg,rgba(250,204,21,0.12)_0%,rgba(255,255,255,0.94)_48%,rgba(240,249,255,0.94)_100%)] p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <SectionTitle
              eyebrow="5x1000"
              title="Un gesto semplice per dare continuita al progetto"
              description="La sezione 5x1000 e pensata per facilitare il sostegno al progetto istituzionale della Nazionale Italiana Sanitari."
            />
          </div>
          <div className="rounded-[1.75rem] border border-amber-200 bg-white/90 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Codice fiscale
            </p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              DA INSERIRE
            </p>
            <Link
              href="/5x1000"
              aria-label="Vai alla pagina 5x1000"
              className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-slate-800"
            >
              Vai alla sezione 5x1000
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <SectionTitle
          eyebrow="News"
          title="Aggiornamenti sul progetto, sui partner e sulle iniziative"
          description="Una sezione editoriale istituzionale per raccontare evoluzione, attivita e nuove collaborazioni della Nazionale Italiana Sanitari."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
          <Link
            href="/news"
            aria-label="Vai alla pagina news della Nazionale Italiana Sanitari"
            className="group block cursor-pointer overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_42px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)]"
          >
            <Image
              src="/images/team/community.jpg"
              alt="Presenza pubblica della Nazionale Italiana Sanitari"
              width={1152}
              height={768}
              className="h-72 w-full object-cover"
            />
            <div className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                {newsItems[0].category}
              </p>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                {newsItems[0].title}
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-600">{newsItems[0].excerpt}</p>
              <p className="mt-5 text-sm font-medium text-slate-500">{newsItems[0].date}</p>
            </div>
          </Link>

          {newsItems.slice(1).map((item) => (
            <Link
              key={item.title}
              href="/news"
              aria-label={`Vai alla pagina news e scopri ${item.title}`}
              className="group block cursor-pointer rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                {item.category}
              </p>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-600">{item.excerpt}</p>
              <p className="mt-5 text-sm font-medium text-slate-500">{item.date}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 rounded-[2rem] border border-sky-950/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.98)_0%,rgba(12,30,54,0.98)_54%,rgba(10,37,64,0.96)_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
              Sostieni la Nazionale Italiana Sanitari
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Aiutaci a trasformare lo sport in presenza concreta per la salute
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Donazioni, sponsorship e 5x1000 sono strumenti con cui rendere continuativi eventi,
              campagne di prevenzione e iniziative solidali sul territorio.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap lg:justify-end">
            <Link
              href="/sostienici"
              className="inline-flex items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-amber-200"
            >
              Dona ora
            </Link>
            <Link
              href="/5x1000"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/15"
            >
              5x1000
            </Link>
            <Link
              href="/contatti"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/15"
            >
              Contatti
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
