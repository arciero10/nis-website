"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { contactInfo, footerColumns, socialLinks, sponsors } from "@/lib/site-data";

export function SiteFooter() {
  const pathname = usePathname();
  const hideInstitutionalPanel = pathname === "/5x1000";

  return (
    <footer className="mt-auto border-t border-white/10 bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-white/15" />
            <p className="text-center text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
              I nostri partner
            </p>
            <span className="h-px flex-1 bg-white/15" />
          </div>

          <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
            {sponsors.map((sponsor) => (
              <div key={sponsor.name} className="flex items-center justify-center px-4 py-2">
                {"logoSrc" in sponsor && sponsor.logoSrc ? (
                  <Image
                    src={sponsor.logoSrc}
                    alt={`Logo ${sponsor.name}`}
                    width={240}
                    height={88}
                    className="h-14 w-auto max-w-full object-contain sm:h-16"
                  />
                ) : (
                  <span className="text-center text-sm font-semibold uppercase tracking-[0.22em] text-white/78">
                    {sponsor.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {!hideInstitutionalPanel ? (
          <div className="mt-10 grid gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
                Nazionale Italiana Sanitari
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                Un progetto nazionale tra sport, prevenzione e solidarieta
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Il sito istituzionale racconta la missione generale della Nazionale Italiana
                Sanitari. La disciplina calcio avra un proprio sviluppo dedicato sul futuro
                subdominio ufficiale.
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:items-end">
              <a
                href={`mailto:${contactInfo.email}`}
                className="rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-950 transition hover:bg-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
              >
                Contattaci
              </a>
              <a
                href={socialLinks.calcio}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              >
                Area calcio
              </a>
              <div className="text-sm leading-7 text-slate-300 lg:text-right">
                <p>{contactInfo.email}</p>
                <p>{contactInfo.pressEmail}</p>
                <p>{contactInfo.city}</p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
                {column.title}
              </h3>
              <div className="mt-5 flex flex-col gap-3">
                {column.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-slate-300 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-6 text-sm text-slate-400">
          <p className="max-w-4xl leading-7">
            &copy; All rights reserved. Sito realizzato da PANTELEIA - Associazione
            Promozione Sociale. CF: 96647400587
            <br />
            Iscrizione RUNTS: Rep. n. 165890 &ndash; Det. n. G03684 del 19/03/2026.
          </p>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-4">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                Instagram
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                Facebook
              </a>
              <a
                href={socialLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                X
              </a>
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                TikTok
              </a>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/privacy-policy" className="transition hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/cookie-policy" className="transition hover:text-white">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
