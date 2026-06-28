import Image from "next/image";
import Link from "next/link";

import { navItems } from "@/lib/site-data";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 transition hover:opacity-95">
          <Image
            src="/logo/logo.jpg"
            alt="Logo ufficiale Nazionale Italiana Sanitari"
            width={54}
            height={54}
            className="rounded-xl"
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
              Nazionale Italiana Sanitari
            </p>
            <p className="text-xs text-slate-300">
              Sport, prevenzione e solidarietà al servizio della salute
            </p>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-2 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/sostienici"
            className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/15"
          >
            Sostienici
          </Link>
          <Link
            href="/sostienici"
            className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-950 transition hover:bg-amber-200"
          >
            Dona ora
          </Link>
        </div>

        <details className="group relative xl:hidden">
          <summary className="flex h-12 w-12 cursor-pointer list-none items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10">
            <span className="sr-only">Apri il menu</span>
            <div className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 rounded-full bg-white transition group-open:translate-y-2 group-open:rotate-45" />
              <span className="block h-0.5 w-5 rounded-full bg-white transition group-open:opacity-0" />
              <span className="block h-0.5 w-5 rounded-full bg-white transition group-open:-translate-y-2 group-open:-rotate-45" />
            </div>
          </summary>

          <div className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(24rem,calc(100vw-2rem))] rounded-[1.5rem] border border-white/10 bg-slate-950/96 p-4 shadow-2xl backdrop-blur-xl">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/sostienici"
                className="mt-2 rounded-full bg-amber-300 px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-slate-950 transition hover:bg-amber-200"
              >
                Dona ora
              </Link>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
