import Link from "next/link";

import { contactInfo, footerColumns, socialLinks } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm lg:grid-cols-[1.1fr_0.9fr]">
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
              className="rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-950 transition hover:bg-sky-300"
            >
              Contattaci
            </a>
            <a
              href={socialLinks.calcio}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/15"
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
            © All rights reserved. Sito realizzato da PANTELEIA - Associazione Promozione
            Sociale. CF: 96647400587
            <br />
            Iscrizione RUNTS: Rep. n. 165890 - Det. n. G03684 del 19/03/2026.
          </p>

          <div className="flex flex-wrap gap-4 md:justify-end">
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
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              YouTube
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
        </div>
      </div>
    </footer>
  );
}
