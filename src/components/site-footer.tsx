import Image from "next/image";
import Link from "next/link";

import { socialLinks } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-36 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4">
                <Image
                  src="/images/sponsor/logo-panteleia.jpg"
                  alt="Logo PANTELEIA"
                  width={180}
                  height={60}
                  className="h-8 w-auto object-contain"
                />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
                Partner tecnico e digitale
              </p>
            </div>

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
          </div>

          <div className="flex flex-col gap-5 text-sm text-slate-400 md:flex-row md:items-end md:justify-between">
            <p className="max-w-4xl leading-7">
              &copy; All rights reserved. Sito realizzato da PANTELEIA - Associazione
              Promozione Sociale. CF: 96647400587
              <br />
              Iscrizione RUNTS: Rep. n. 165890 &ndash; Det. n. G03684 del 19/03/2026.
            </p>

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
