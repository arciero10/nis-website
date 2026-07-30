import Image from "next/image";
import Link from "next/link";

import { SectionTitle } from "@/components/section-title";
import { buildMetadata, siteName, socialLinks } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: siteName,
  path: "/",
});

const missionItems = [
  {
    title: "Prevenzione",
    text: "Promuoviamo la cultura della prevenzione e della diagnosi precoce.",
    icon: "health",
  },
  {
    title: "Solidarieta",
    text: "Sosteniamo progetti di cura e assistenza per le persone piu fragili.",
    icon: "hands",
  },
  {
    title: "Sport",
    text: "Lo sport e il nostro strumento per unire, includere e generare benessere.",
    icon: "sport",
  },
  {
    title: "Formazione",
    text: "Investiamo nella formazione continua dei professionisti sanitari.",
    icon: "education",
  },
];

const sectors = [
  {
    title: "Calcio",
    note: "Disciplina principale",
    accent: "bg-sky-500",
    href: socialLinks.calcio,
    external: true,
    icon: "ball",
  },
  {
    title: "Running",
    note: "Benessere e partecipazione",
    accent: "bg-emerald-500",
    href: "/discipline",
    icon: "run",
  },
  {
    title: "Tennis",
    note: "Area in sviluppo",
    accent: "bg-amber-400",
    href: "/discipline",
    icon: "racket",
  },
  {
    title: "Padel",
    note: "Area in sviluppo",
    accent: "bg-emerald-400",
    href: "/discipline",
    icon: "court",
  },
  {
    title: "Golf",
    note: "Area in sviluppo",
    accent: "bg-sky-400",
    href: "/discipline",
    icon: "golf",
  },
  {
    title: "Eventi",
    note: "Attivazioni benefiche",
    accent: "bg-amber-300",
    href: "/eventi",
    icon: "calendar",
  },
  {
    title: "Formazione",
    note: "Contenuti e aggiornamento",
    accent: "bg-sky-600",
    href: "/missione",
    icon: "education",
  },
  {
    title: "Volontariato",
    note: "Presenza e supporto",
    accent: "bg-emerald-600",
    href: "/sostienici",
    icon: "hands",
  },
];

const impactItems = [
  { label: "Fondi raccolti", value: "€ 50.000+", icon: "heart" },
  { label: "Progetti finanziati", value: "In aggiornamento", icon: "project" },
  { label: "Sanitari aderenti", value: "In aggiornamento", icon: "people" },
  { label: "Eventi organizzati", value: "In aggiornamento", icon: "calendar" },
  { label: "Beneficiari raggiunti", value: "In aggiornamento", icon: "hands" },
];

function Icon({ type }: { type: string }) {
  switch (type) {
    case "health":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <path
            d="M16 27s-9-5.7-9-13a5 5 0 0 1 9-2.9A5 5 0 0 1 25 14c0 7.3-9 13-9 13Z"
            strokeWidth="1.8"
          />
          <path d="M16 10v8M12 14h8" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "hands":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <path
            d="M7 17.5 12.5 12a3 3 0 0 1 4.2 0l1.1 1.1a3 3 0 0 1 0 4.2L15 20"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="m25 17.5-5.5-5.5a3 3 0 0 0-4.2 0l-1.1 1.1a3 3 0 0 0 0 4.2L17 20"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path d="M10.5 22.5h11" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "sport":
    case "ball":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <circle cx="16" cy="16" r="10.5" strokeWidth="1.8" />
          <path d="m12 8 8 0 4 6-4 10h-8L8 14Z" strokeWidth="1.6" />
          <path d="m8 14 8 4 8-4" strokeWidth="1.6" />
        </svg>
      );
    case "education":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <path d="m5 12 11-5 11 5-11 5Z" strokeWidth="1.8" strokeLinejoin="round" />
          <path
            d="M10 15.5V21c0 1.9 2.7 3.5 6 3.5s6-1.6 6-3.5v-5.5"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path d="M27 12v8" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "run":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <circle cx="20" cy="8" r="2.5" strokeWidth="1.8" />
          <path
            d="m14 25 3-7 4-2 2 3 4 2"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="m18 12 3 2 3-1" strokeWidth="1.8" strokeLinecap="round" />
          <path d="m10 18 5-1" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "racket":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <ellipse
            cx="13"
            cy="13"
            rx="6.5"
            ry="8"
            strokeWidth="1.8"
            transform="rotate(-25 13 13)"
          />
          <path d="m17.5 19.5 6 6" strokeWidth="1.8" strokeLinecap="round" />
          <path d="m10 8 5 9M8 12h10M11 6l3 12" strokeWidth="1.2" />
        </svg>
      );
    case "court":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <rect x="6" y="7" width="20" height="18" rx="2.5" strokeWidth="1.8" />
          <path d="M16 7v18M6 16h20" strokeWidth="1.4" />
          <path d="M10.5 7v18M21.5 7v18" strokeWidth="1.2" />
        </svg>
      );
    case "golf":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <path d="M12 6v18" strokeWidth="1.8" strokeLinecap="round" />
          <path d="m12 6 10 3-10 4" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M8 26c1.5-2 3.8-3 8-3s6.5 1 8 3" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <rect x="6" y="8" width="20" height="18" rx="3" strokeWidth="1.8" />
          <path d="M10 5.5v5M22 5.5v5M6 13.5h20" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M11 18h4M17 18h4M11 22h4" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <path
            d="M16 27s-9.5-5.8-9.5-13.2a5.3 5.3 0 0 1 9.5-3.2 5.3 5.3 0 0 1 9.5 3.2C25.5 21.2 16 27 16 27Z"
            strokeWidth="1.8"
          />
          <path d="M11 16h3l1.6-3.8 2.8 7.4L20 16h3" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "project":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <rect x="6" y="7" width="20" height="18" rx="3" strokeWidth="1.8" />
          <path d="M11 13h10M11 18h6M21 18l2 2 4-4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "people":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <circle cx="16" cy="11" r="4" strokeWidth="1.8" />
          <path d="M8.5 25c1.1-4.1 3.6-6.2 7.5-6.2s6.4 2.1 7.5 6.2" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8 14.5a3 3 0 1 0-1.3-5.7M24 14.5a3 3 0 1 1 1.3-5.7" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#06192a_0%,#0a2036_14%,#f8fafc_14%,#eef2f7_100%)] text-slate-900">
      <section className="relative overflow-hidden border-b border-white/10 bg-[linear-gradient(135deg,#06182a_0%,#0d2d49_58%,#071c30_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_24%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2 bg-[linear-gradient(90deg,#0b7a3c_0%,#0b7a3c_33%,#f5f5f5_33%,#f5f5f5_66%,#c61f2b_66%,#c61f2b_100%)]" />

        <div className="relative mx-auto grid min-h-[58vh] max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-12">
          <div className="max-w-3xl text-center lg:text-left">
            <div className="inline-flex items-center gap-4 rounded-[1.75rem] border border-white/12 bg-white/8 px-5 py-4 text-left backdrop-blur-sm">
              <Image
                src="/images/nis/logo-nis.jpg"
                alt="Logo ufficiale Nazionale Italiana Sanitari"
                width={88}
                height={88}
                className="h-16 w-16 rounded-2xl border border-white/12 object-cover sm:h-20 sm:w-20"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
                  Nazionale Italiana Sanitari
                </p>
                <p className="mt-2 text-lg font-semibold text-white sm:text-xl">NIS is NICE.</p>
              </div>
            </div>

            <h1 className="mt-8 text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-7xl">
              In campo per la salute.
              <span className="mt-3 block text-emerald-300">Uniti per la vita.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/86">
              La Nazionale Italiana Sanitari riunisce professionisti della salute per promuovere
              prevenzione, solidarieta e progetti concreti a favore delle persone piu fragili.
            </p>

            <div className="mt-10 flex justify-center">
              <Link
                href="/sostienici"
                className="inline-flex min-h-14 min-w-[14rem] items-center justify-center rounded-full bg-amber-300 px-10 py-5 text-base font-bold uppercase tracking-[0.18em] text-slate-950 shadow-[0_22px_46px_rgba(251,191,36,0.28)] transition hover:-translate-y-0.5 hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
              >
                DONA ORA
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-4 text-sm text-sky-100/84">
              <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">
                Sport
              </span>
              <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">
                Prevenzione
              </span>
              <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">
                Solidarieta
              </span>
              <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">
                Progetti benefici
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-[0_28px_60px_rgba(2,12,27,0.28)]">
                <Image
                  src="/images/team/lineup.jpg"
                  alt="Squadra della Nazionale Italiana Sanitari sul campo"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,24,39,0.06)_0%,rgba(7,24,39,0.62)_100%)]" />
                <div className="absolute bottom-5 left-5 right-5 rounded-[1.5rem] border border-white/10 bg-white/12 px-5 py-4 backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    Comunita sanitaria
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Una maglia che unisce professionisti, famiglie e territori.
                  </p>
                </div>
              </div>

              <div className="grid gap-5">
                <div className="relative min-h-[200px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-[0_22px_50px_rgba(2,12,27,0.24)]">
                  <Image
                    src="/images/team/community.jpg"
                    alt="Attivita pubblica e solidarieta della Nazionale Italiana Sanitari"
                    fill
                    sizes="(max-width: 1024px) 100vw, 28vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,24,39,0.16)_0%,rgba(7,24,39,0.72)_100%)]" />
                  <div className="absolute left-5 top-5 inline-flex rounded-full border border-white/12 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    Prevenzione
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-[1.75rem] border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                      Sport e salute
                    </p>
                    <p className="mt-3 text-base leading-7 text-white/88">
                      Eventi benefici, sensibilizzazione e presenza concreta sul territorio.
                    </p>
                  </div>
                  <div className="rounded-[1.75rem] border border-emerald-300/20 bg-emerald-400/10 p-5 backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                      Settori in crescita
                    </p>
                    <p className="mt-3 text-base leading-7 text-white/88">
                      Calcio, running, formazione, volontariato e nuovi percorsi sportivi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#04111f_0%,#0b2540_62%,#04111f_100%)] py-12 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-white/12" />
            <p className="text-center text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
              Il nostro impatto
            </p>
            <span className="h-px flex-1 bg-white/12" />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {impactItems.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.75rem] border border-white/10 bg-white/7 px-5 py-6 shadow-[0_22px_48px_rgba(2,12,27,0.2)] backdrop-blur-sm"
              >
                <div className="inline-flex rounded-2xl bg-sky-300/12 p-3 text-sky-200">
                  <Icon type={item.icon} />
                </div>
                <p className="mt-5 text-3xl font-bold tracking-tight text-white lg:text-[2rem]">
                  {item.value}
                </p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-sky-100/78">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-7xl px-6 pb-10">
        <div className="grid gap-5 rounded-[2.25rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fdff_0%,#ffffff_100%)] p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] md:grid-cols-2 xl:grid-cols-4 xl:p-8">
          {missionItems.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.5rem] border border-slate-200 bg-white px-5 py-6 shadow-sm"
            >
              <div className="inline-flex rounded-2xl bg-sky-50 p-3 text-sky-700">
                <Icon type={item.icon} />
              </div>
              <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-950">{item.title}</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.06fr_0.82fr]">
          <div className="relative min-h-[350px] overflow-hidden rounded-[2.25rem] border border-slate-200 bg-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
            <Image
              src="/images/generic/award.jpg"
              alt="Visual del progetto principale della Nazionale Italiana Sanitari"
              fill
              sizes="(max-width: 1024px) 100vw, 28vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,24,39,0.16)_0%,rgba(7,24,39,0.76)_100%)]" />
            <div className="absolute inset-x-5 bottom-5 rounded-[1.75rem] border border-white/10 bg-white/10 px-6 py-5 backdrop-blur-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">
                Il primo battito di ogni speranza.
              </p>
            </div>
          </div>

          <div className="rounded-[2.25rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
              Il nostro progetto
            </p>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Il 1° Battito
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Il primo grande progetto benefico della NIS. Sport, emozione e solidarieta si
              uniscono per sostenere la cura e la prevenzione, con particolare attenzione alle
              persone piu fragili.
            </p>
            <Link
              href="/progetti/il-primo-battito"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-slate-800"
            >
              Scopri il progetto
            </Link>
          </div>

          <div className="rounded-[2.25rem] border border-emerald-200 bg-[linear-gradient(180deg,rgba(16,185,129,0.08)_0%,rgba(255,255,255,1)_100%)] p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <div className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Risultato concreto
            </div>
            <h3 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
              50.000 euro raccolti
            </h3>
            <div className="mt-6 grid gap-4">
              {[
                "331 mq interessati",
                "6 grandi stanze di degenza",
                "2 piccole stanze di degenza",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-emerald-200 bg-white/85 px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionTitle
          eyebrow="Settori"
          title="I nostri settori"
          description="Una piattaforma sportiva e associativa che unisce discipline, progetti, eventi e partecipazione sociale."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sectors.map((sector) => {
            const content = (
              <div className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(15,23,42,0.1)]">
                <div className="inline-flex rounded-2xl bg-slate-50 p-3 text-sky-700">
                  <Icon type={sector.icon} />
                </div>
                <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
                  {sector.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{sector.note}</p>
                <span className={`mt-6 block h-1.5 w-16 rounded-full ${sector.accent}`} />
              </div>
            );

            return sector.external ? (
              <a
                key={sector.title}
                href={sector.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Vai al settore ${sector.title}`}
              >
                {content}
              </a>
            ) : (
              <Link
                key={sector.title}
                href={sector.href}
                aria-label={`Vai al settore ${sector.title}`}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 rounded-[2.5rem] border border-emerald-200 bg-[linear-gradient(120deg,rgba(16,185,129,0.12)_0%,rgba(255,255,255,0.98)_46%,rgba(240,249,255,0.94)_100%)] p-8 shadow-[0_28px_70px_rgba(15,23,42,0.08)] lg:grid-cols-[1fr_0.92fr] lg:items-center lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Dona ora
            </p>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Ogni donazione diventa cura.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Insieme possiamo fare la differenza, ogni giorno.
            </p>
            <Link
              href="/sostienici"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-slate-800"
            >
              Dona ora
            </Link>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
            <Image
              src="/images/uniti-per-la-vita.jpg"
              alt="Solidarieta e futuro nel progetto della Nazionale Italiana Sanitari"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,24,39,0.18)_0%,rgba(7,24,39,0.74)_100%)]" />
            <div className="absolute bottom-5 left-5 right-5 rounded-[1.75rem] border border-white/12 bg-white/12 px-5 py-4 backdrop-blur-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">
                Salute, solidarieta, futuro
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
