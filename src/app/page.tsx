import Image from "next/image";
import Link from "next/link";

import { buildMetadata, siteName } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: siteName,
  description:
    "La Nazionale Italiana Sanitari unisce professionisti della salute, sport e solidarieta per promuovere prevenzione, progetti benefici e cura delle persone piu fragili.",
  path: "/",
});

const impactItems = [
  { value: "€ 50.000+", label: "raccolti", icon: "heart" },
  { value: "331 mq", label: "da trasformare", icon: "area" },
  { value: "6", label: "grandi stanze di degenza", icon: "room" },
  { value: "2", label: "piccole stanze di degenza", icon: "room" },
  { value: "1", label: "progetto benefico avviato", icon: "spark" },
];

const projectFacts = [
  "50.000 euro raccolti",
  "Oncoematologia Pediatrica",
  "Ospedale Umberto I di Roma",
  "331 mq interessati",
];

const missionItems = [
  {
    title: "Prevenzione",
    text: "Promuoviamo cultura della prevenzione e attenzione alla salute.",
    icon: "health",
  },
  {
    title: "Solidarieta",
    text: "Sosteniamo progetti concreti a favore delle persone piu fragili.",
    icon: "hands",
  },
  {
    title: "Sport",
    text: "Usiamo lo sport come linguaggio di unione, partecipazione e benessere.",
    icon: "sport",
  },
  {
    title: "Formazione",
    text: "Valorizziamo il ruolo sociale e professionale del mondo sanitario.",
    icon: "education",
  },
];

const sectors = [
  { title: "Calcio", icon: "ball" },
  { title: "Running", icon: "run" },
  { title: "Tennis", icon: "racket" },
  { title: "Padel", icon: "court" },
  { title: "Golf", icon: "golf" },
  { title: "Eventi", icon: "calendar" },
  { title: "Formazione", icon: "education" },
  { title: "Volontariato", icon: "hands" },
];

function Icon({ type }: { type: string }) {
  switch (type) {
    case "health":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <path d="M16 27s-9-5.7-9-13a5 5 0 0 1 9-2.9A5 5 0 0 1 25 14c0 7.3-9 13-9 13Z" strokeWidth="1.8" />
          <path d="M16 10v8M12 14h8" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "hands":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <path d="M7 18.5 12.5 13a3 3 0 0 1 4.2 0l1.1 1.1a3 3 0 0 1 0 4.2L15 21" strokeWidth="1.8" strokeLinecap="round" />
          <path d="m25 18.5-5.5-5.5a3 3 0 0 0-4.2 0l-1.1 1.1a3 3 0 0 0 0 4.2L17 21" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M10.5 23.5h11" strokeWidth="1.8" strokeLinecap="round" />
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
          <path d="M10 15.5V21c0 1.9 2.7 3.5 6 3.5s6-1.6 6-3.5v-5.5" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M27 12v8" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "run":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <circle cx="20" cy="8" r="2.5" strokeWidth="1.8" />
          <path d="m14 25 3-7 4-2 2 3 4 2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m18 12 3 2 3-1M10 18l5-1" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "racket":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <ellipse cx="13" cy="13" rx="6.5" ry="8" strokeWidth="1.8" transform="rotate(-25 13 13)" />
          <path d="m17.5 19.5 6 6M10 8l5 9M8 12h10M11 6l3 12" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "court":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <rect x="6" y="7" width="20" height="18" rx="2.5" strokeWidth="1.8" />
          <path d="M16 7v18M6 16h20M10.5 7v18M21.5 7v18" strokeWidth="1.3" />
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
          <path d="M10 5.5v5M22 5.5v5M6 13.5h20M11 18h4M17 18h4M11 22h4" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case "area":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <rect x="7" y="7" width="18" height="18" rx="3" strokeWidth="1.8" />
          <path d="M12 7v18M20 7v18M7 16h18" strokeWidth="1.5" />
        </svg>
      );
    case "room":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <path d="M7 25V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16" strokeWidth="1.8" />
          <path d="M5 25h22M11 17h10M11 13h4" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <path d="M16 4l2.8 8.2L27 15l-8.2 2.8L16 26l-2.8-8.2L5 15l8.2-2.8Z" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M24 5v5M21.5 7.5h5" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "heart":
    default:
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-none stroke-current">
          <path d="M16 27s-9.5-5.8-9.5-13.2a5.3 5.3 0 0 1 9.5-3.2 5.3 5.3 0 0 1 9.5 3.2C25.5 21.2 16 27 16 27Z" strokeWidth="1.8" />
          <path d="M11 16h3l1.6-3.8 2.8 7.4L20 16h3" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#041224_0%,#07294a_50%,#03101f_100%)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_24%,rgba(21,148,255,0.24),transparent_30%),radial-gradient(circle_at_86%_72%,rgba(35,196,132,0.18),transparent_26%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2 bg-[linear-gradient(90deg,#079047_0%,#079047_33.333%,#ffffff_33.333%,#ffffff_66.666%,#d31f32_66.666%,#d31f32_100%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-6 sm:py-10 lg:min-h-[calc(100vh-73px)] lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-10 lg:py-14">
          <div className="max-w-3xl text-center lg:text-left">
            <div className="inline-flex items-center gap-3 rounded-3xl border border-white/12 bg-white/8 px-4 py-3 text-left shadow-2xl backdrop-blur-md sm:gap-4 sm:px-5">
              <Image
                src="/images/nis/logo-nis.jpg"
                alt="Logo ufficiale Nazionale Italiana Sanitari"
                width={84}
                height={84}
                priority
                className="h-14 w-14 shrink-0 rounded-2xl border border-white/15 object-cover sm:h-20 sm:w-20"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200">
                  Nazionale Italiana Sanitari
                </p>
                <p className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
                  NIS is NICE.
                </p>
              </div>
            </div>

            <h1 className="mt-7 text-4xl font-black leading-[0.98] tracking-tight text-white sm:text-6xl lg:mt-8 lg:text-7xl">
              In campo per la salute.
              <span className="block text-emerald-300">Uniti per la vita.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-100/88 sm:text-lg sm:leading-8 lg:mx-0 lg:mt-7">
              La Nazionale Italiana Sanitari unisce professionisti della salute, sport e
              solidarieta per promuovere prevenzione, progetti benefici e cura delle persone piu
              fragili.
            </p>

            <div className="mt-7 flex justify-center lg:mt-9 lg:justify-start">
              <Link
                href="/sostienici"
                className="inline-flex min-h-16 min-w-[16rem] items-center justify-center rounded-full bg-emerald-400 px-10 py-5 text-base font-black uppercase tracking-[0.18em] text-slate-950 shadow-[0_24px_54px_rgba(52,211,153,0.28)] transition hover:-translate-y-0.5 hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Dona ora
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
            <div className="relative min-h-[240px] overflow-hidden rounded-[2rem] border border-white/12 bg-slate-900 shadow-[0_30px_80px_rgba(1,8,20,0.42)] sm:min-h-[420px] lg:min-h-[500px]">
              <Image
                src="/images/team/lineup.jpg"
                alt="Squadra della Nazionale Italiana Sanitari sul campo"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,18,36,0.36)_0%,rgba(4,18,36,0.06)_45%,rgba(4,18,36,0.58)_100%)]" />
              <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-3">
                {["sport", "salute", "solidarieta"].map((item) => (
                  <span
                    key={item}
                    className="rounded-2xl border border-white/12 bg-white/14 px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#061426_0%,#0b3763_58%,#061426_100%)] py-8 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <p className="text-center text-sm font-bold uppercase tracking-[0.22em] text-sky-200">
            Il nostro impatto
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {impactItems.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/8 p-5 shadow-[0_18px_42px_rgba(1,8,20,0.2)] backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 text-sky-200">
                  <Icon type={item.icon} />
                  <p className="text-3xl font-black tracking-tight text-white">{item.value}</p>
                </div>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.13em] text-slate-100/78">
                  {item.label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:min-h-[480px]">
            <Image
              src="/images/uniti-per-la-vita.jpg"
              alt="Solidarieta e cura nel progetto Il Primo Battito"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,18,36,0.04)_0%,rgba(4,18,36,0.72)_100%)]" />
            <div className="absolute inset-x-5 bottom-5 rounded-3xl border border-white/12 bg-white/12 p-5 backdrop-blur-md">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">
                Quando lo sport diventa cura
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-700">
              Progetto principale
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Il 1&deg; Battito
            </h2>
            <p className="mt-3 text-2xl font-bold text-emerald-700">
              Quando lo sport diventa cura
            </p>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Il primo grande progetto benefico della Nazionale Italiana Sanitari ha permesso di
              raccogliere 50.000 euro destinati all&apos;umanizzazione pittorica del reparto di
              Oncoematologia Pediatrica dell&apos;Ospedale Umberto I di Roma.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {projectFacts.map((fact) => (
                <div
                  key={fact}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold uppercase tracking-[0.12em] text-slate-800 shadow-sm"
                >
                  {fact}
                </div>
              ))}
            </div>

            <Link
              href="/progetti/il-primo-battito"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:-translate-y-0.5 hover:bg-sky-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
            >
              Scopri il progetto
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
                Valori
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                La nostra missione
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {missionItems.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5">
                <div className="inline-flex rounded-2xl bg-white p-3 text-sky-700 shadow-sm">
                  <Icon type={item.icon} />
                </div>
                <h3 className="mt-4 text-xl font-black tracking-tight text-slate-950">{item.title}</h3>
                <p className="mt-2 text-base leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-700">Settori</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            I nostri settori
          </h2>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {sectors.map((sector) => (
            <Link
              key={sector.title}
              href="/discipline"
              aria-label={`Vai alla pagina discipline per ${sector.title}`}
              className="group flex min-h-36 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-[0_14px_34px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_22px_46px_rgba(15,23,42,0.1)]"
            >
              <span className="text-sky-700 transition group-hover:text-emerald-700">
                <Icon type={sector.icon} />
              </span>
              <span className="mt-4 text-lg font-black text-slate-950">{sector.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 pb-20 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#041224_0%,#0b3763_62%,#0f5132_100%)] p-8 text-center text-white shadow-[0_30px_80px_rgba(15,23,42,0.16)] sm:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-200">
            Sostieni NIS
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            Ogni donazione diventa cura.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-100/86">
            Con il tuo sostegno puoi contribuire a progetti concreti di prevenzione, solidarieta e
            cura.
          </p>
          <Link
            href="/sostienici"
            className="mt-8 inline-flex min-h-16 min-w-[16rem] items-center justify-center rounded-full bg-emerald-400 px-10 py-5 text-base font-black uppercase tracking-[0.18em] text-slate-950 shadow-[0_24px_54px_rgba(52,211,153,0.24)] transition hover:-translate-y-0.5 hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Dona ora
          </Link>
        </div>
      </section>
    </main>
  );
}
