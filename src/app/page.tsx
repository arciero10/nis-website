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

      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="rounded-[2.5rem] border border-slate-200/90 bg-white px-8 py-12 shadow-[0_28px_80px_rgba(15,23,42,0.1)] md:px-10 md:py-14 lg:px-14 lg:py-16">
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-slate-200" />
            <p className="text-center text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
              Partner e sponsor
            </p>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.name}
                className="flex min-h-[18rem] flex-col items-center justify-start px-2 py-2 text-center md:min-h-[19rem] lg:min-h-[20rem]"
              >
                <div className="flex h-36 w-full items-center justify-center rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(248,250,252,1)_0%,rgba(241,245,249,0.9)_58%,rgba(255,255,255,0)_100%)] px-4 md:h-40 md:px-5 lg:h-44">
                  {"logoSrc" in sponsor && sponsor.logoSrc ? (
                    <Image
                      src={sponsor.logoSrc}
                      alt={`Logo ${sponsor.name}`}
                      width={280}
                      height={160}
                      className="h-auto max-h-[100px] w-auto max-w-[180px] object-contain md:max-h-[120px] md:max-w-[220px] lg:max-h-[150px] lg:max-w-[270px]"
                    />
                  ) : (
                    <span className="text-center text-2xl font-bold uppercase tracking-[0.18em] text-slate-700 md:text-[1.8rem]">
                      {sponsor.name}
                    </span>
                  )}
                </div>
                <h3 className="mt-6 text-lg font-bold tracking-tight text-slate-950 md:text-xl">
                  {sponsor.name}
                </h3>
                <p className="mt-2 text-center text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 md:text-[0.95rem]">
                  {sponsor.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
