"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { socialLinks } from "@/lib/site-data";

const desktopNavItems = [
  { label: "Home", href: "/" },
  { label: "Chi siamo", href: "/chi-siamo" },
  { label: "Progetti", href: "/sostienici" },
  { label: "Settori", href: "/discipline" },
  { label: "Diventa Socio", href: "/diventa-socio" },
  { label: "Eventi", href: "/eventi" },
  { label: "News", href: "/news" },
  { label: "Contatti", href: "/contatti" },
];

const mobileNavItems = [
  { label: "Home", href: "/" },
  { label: "Chi siamo", href: "/chi-siamo" },
  { label: "Progetti", href: "/sostienici" },
  { label: "Settori", href: "/discipline" },
  { label: "Diventa Socio", href: "/diventa-socio" },
  { label: "Eventi", href: "/eventi" },
  { label: "News", href: "/news" },
  { label: "Contatti", href: "/contatti" },
];

const socialNavItems = [
  { label: "Instagram", href: socialLinks.instagram, icon: "instagram" },
  { label: "Facebook", href: socialLinks.facebook, icon: "facebook" },
  { label: "X", href: socialLinks.x, icon: "x" },
  { label: "TikTok", href: socialLinks.tiktok, icon: "tiktok" },
] as const;

function SocialIcon({ platform }: { platform: (typeof socialNavItems)[number]["icon"] }) {
  switch (platform) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="4" strokeWidth="1.7" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M13.3 20v-7h2.4l.4-2.8h-2.8V8.4c0-.8.3-1.4 1.5-1.4h1.4V4.5c-.2 0-1-.1-2-.1-2 0-3.4 1.2-3.4 3.6v2.2H8.5V13h2.3v7h2.5Z" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M18.9 4H21l-4.7 5.4L22 20h-4.5l-3.5-5.2L9.5 20H7.4l5-5.8L2 4h4.6L9.8 8.8 13.9 4h2.1Zm-1.6 14.3h1.2L6 5.6H4.7l12.6 12.7Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M15.6 4c.3 1.8 1.4 3.3 3.1 4.1v2.5c-1.3 0-2.5-.4-3.6-1.1V15a4.9 4.9 0 1 1-4.9-4.9c.3 0 .7 0 1 .1v2.6a2.5 2.5 0 1 0 1.4 2.2V4h3Z" />
        </svg>
      );
  }
}

export function SiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/92 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 pr-2 transition hover:opacity-95 lg:gap-4"
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
            <p className="max-w-[10.5rem] text-sm font-semibold uppercase leading-tight tracking-[0.12em] text-white sm:max-w-[13rem] sm:text-[0.92rem] lg:max-w-[17rem] lg:text-[0.98rem] lg:tracking-[0.16em]">
              Nazionale Italiana Sanitari
            </p>
          </div>
        </Link>

        <nav className="ml-3 hidden flex-1 items-center gap-1 xl:flex">
          {desktopNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
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
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/6 text-slate-200 transition hover:border-sky-300/40 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <SocialIcon platform={item.icon} />
            </a>
          ))}
          <Link
            href="/sostienici"
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            Sostienici
          </Link>
          <Link
            href="/sostienici"
            className="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-slate-950 transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
          >
            Dona ora
          </Link>
        </div>

        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Chiudi il menu principale" : "Apri il menu principale"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="ml-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 xl:hidden"
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

                <div className="mt-4 rounded-[1.5rem] border border-white/8 bg-slate-900/50 p-4">
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
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white transition hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                      >
                        <SocialIcon platform={item.icon} />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 min-[430px]:grid-cols-2">
                  <Link
                    href="/sostienici"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center rounded-full bg-amber-300 px-5 py-3.5 text-center text-sm font-semibold uppercase tracking-[0.12em] text-slate-950 transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
                  >
                    Dona ora
                  </Link>
                  <Link
                    href="/chi-siamo"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-5 py-3.5 text-center text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                  >
                    Scopri il progetto
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
