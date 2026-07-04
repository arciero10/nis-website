import Image from "next/image";
import Link from "next/link";

import { socialLinks } from "@/lib/site-data";

const desktopNavItems = [
  { label: "Home", href: "/" },
  { label: "Chi siamo", href: "/chi-siamo" },
  { label: "Missione", href: "/missione" },
  { label: "Eventi", href: "/eventi" },
  { label: "Discipline", href: "/discipline" },
  { label: "Sponsor", href: "/sponsor" },
  { label: "5x1000", href: "/5x1000" },
  { label: "Contatti", href: "/contatti" },
];

const mobileNavItems = [
  { label: "Home", href: "/" },
  { label: "Chi siamo", href: "/chi-siamo" },
  { label: "Missione", href: "/missione" },
  { label: "Eventi", href: "/eventi" },
  { label: "Discipline", href: "/discipline" },
  { label: "Sponsor", href: "/sponsor" },
  { label: "5x1000", href: "/5x1000" },
  { label: "Sostienici", href: "/sostienici" },
  { label: "Contatti", href: "/contatti" },
];

const socialNavItems = [
  { label: "X", href: socialLinks.x },
  { label: "TikTok", href: socialLinks.tiktok },
  { label: "Instagram", href: socialLinks.instagram },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 transition hover:opacity-95 lg:gap-4"
          aria-label="Vai alla home della Nazionale Italiana Sanitari"
        >
          <Image
            src="/logo/logo.jpg"
            alt="Logo ufficiale Nazionale Italiana Sanitari"
            width={52}
            height={52}
            className="h-11 w-11 shrink-0 rounded-xl sm:h-12 sm:w-12 lg:h-[54px] lg:w-[54px]"
          />
          <div className="min-w-0">
            <p className="max-w-[12rem] text-sm font-semibold uppercase leading-tight tracking-[0.14em] text-white sm:max-w-[14rem] lg:max-w-[18rem] lg:text-[0.95rem] lg:tracking-[0.18em]">
              Nazionale Italiana Sanitari
            </p>
            <p className="mt-1 hidden text-[11px] leading-4 text-sky-100/85 min-[430px]:block lg:text-xs">
              Sport, prevenzione e solidarieta
            </p>
          </div>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 xl:flex">
          {desktopNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {socialNavItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Apri ${item.label} in una nuova scheda`}
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:border-sky-300/40 hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/sostienici"
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/15"
          >
            Sostienici
          </Link>
          <Link
            href="/sostienici"
            className="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-slate-950 transition hover:bg-amber-200"
          >
            Dona ora
          </Link>
        </div>

        <details className="group relative ml-auto xl:hidden">
          <summary className="flex h-12 w-12 cursor-pointer list-none items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10">
            <span className="sr-only">Apri il menu principale</span>
            <div className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 rounded-full bg-white transition group-open:translate-y-2 group-open:rotate-45" />
              <span className="block h-0.5 w-5 rounded-full bg-white transition group-open:opacity-0" />
              <span className="block h-0.5 w-5 rounded-full bg-white transition group-open:-translate-y-2 group-open:-rotate-45" />
            </div>
          </summary>

          <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(26rem,calc(100vw-1rem))] rounded-[1.5rem] border border-white/10 bg-slate-950/98 p-4 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.04] p-4">
              <p className="text-base font-semibold uppercase tracking-[0.14em] text-white">
                Nazionale Italiana Sanitari
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Sport, prevenzione e solidarieta
              </p>
            </div>

            <nav className="mt-4 flex flex-col gap-2">
              {mobileNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-3.5 text-base font-medium text-slate-200 transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-5 rounded-[1.25rem] border border-white/8 bg-white/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                Social ufficiali
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {socialNavItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Apri ${item.label} in una nuova scheda`}
                    className="inline-flex items-center rounded-full border border-white/12 bg-white/8 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/14"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <Link
              href="/sostienici"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-amber-300 px-5 py-3.5 text-center text-sm font-semibold uppercase tracking-[0.12em] text-slate-950 transition hover:bg-amber-200"
            >
              Dona ora
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
