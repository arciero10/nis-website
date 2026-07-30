"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const desktopNavItems = [
  { label: "Home", href: "/" },
  { label: "Chi siamo", href: "/chi-siamo" },
  { label: "Progetti", href: "/progetti" },
  { label: "Settori", href: "/discipline" },
  { label: "Eventi", href: "/eventi" },
  { label: "News", href: "/news" },
  { label: "Diventa Socio", href: "/diventa-socio" },
  { label: "Contatti", href: "/contatti" },
];

const mobileNavItems = [
  { label: "Home", href: "/" },
  { label: "Chi siamo", href: "/chi-siamo" },
  { label: "Progetti", href: "/progetti" },
  { label: "Settori", href: "/discipline" },
  { label: "Eventi", href: "/eventi" },
  { label: "News", href: "/news" },
  { label: "Diventa Socio", href: "/diventa-socio" },
  { label: "Contatti", href: "/contatti" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#061426]/95 backdrop-blur-xl">
      <div className="relative mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center px-4 py-2.5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center transition hover:opacity-95"
          aria-label="Vai alla home della Nazionale Italiana Sanitari"
        >
          <Image
            src="/images/nis/logo-nis.jpg"
            alt="Logo ufficiale Nazionale Italiana Sanitari"
            width={72}
            height={72}
            className="h-11 w-11 shrink-0 rounded-lg object-cover sm:h-12 sm:w-12"
          />
        </Link>

        <nav className="hidden items-center justify-center gap-1 xl:flex">
          {desktopNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/7 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden h-12 w-12 xl:block" aria-hidden="true" />

        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Chiudi il menu principale" : "Apri il menu principale"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 xl:hidden"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`block h-0.5 w-5 rounded-full bg-white transition ${
                isMobileMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-white transition ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-white transition ${
                isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>

        {isMobileMenuOpen ? (
          <div className="absolute inset-x-0 top-full z-[60] border-b border-white/10 bg-slate-950/98 px-4 pb-4 pt-3 shadow-2xl backdrop-blur-xl xl:hidden">
            <div className="mx-auto max-w-7xl">
              <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-3 shadow-[0_18px_40px_rgba(2,12,27,0.36)]">
                <nav className="grid gap-2">
                  {mobileNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-2xl px-4 py-3.5 text-base font-medium text-slate-100 transition hover:bg-white/7 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
