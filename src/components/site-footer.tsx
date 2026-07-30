import Image from "next/image";
import Link from "next/link";

import { socialLinks } from "@/lib/site-data";

const socialFooterItems = [
  { label: "Instagram", href: socialLinks.instagram, icon: "instagram" },
  { label: "Facebook", href: socialLinks.facebook, icon: "facebook" },
  { label: "X", href: socialLinks.x, icon: "x" },
  { label: "TikTok", href: socialLinks.tiktok, icon: "tiktok" },
  { label: "YouTube", href: socialLinks.youtube, icon: "youtube" },
] as const;

function SocialIcon({ platform }: { platform: (typeof socialFooterItems)[number]["icon"] }) {
  switch (platform) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="4" strokeWidth="1.7" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
          <path d="M13.3 20v-7h2.4l.4-2.8h-2.8V8.4c0-.8.3-1.4 1.5-1.4h1.4V4.5c-.2 0-1-.1-2-.1-2 0-3.4 1.2-3.4 3.6v2.2H8.5V13h2.3v7h2.5Z" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
          <path d="M18.9 4H21l-4.7 5.4L22 20h-4.5l-3.5-5.2L9.5 20H7.4l5-5.8L2 4h4.6L9.8 8.8 13.9 4h2.1Zm-1.6 14.3h1.2L6 5.6H4.7l12.6 12.7Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
          <path d="M15.6 4c.3 1.8 1.4 3.3 3.1 4.1v2.5c-1.3 0-2.5-.4-3.6-1.1V15a4.9 4.9 0 1 1-4.9-4.9c.3 0 .7 0 1 .1v2.6a2.5 2.5 0 1 0 1.4 2.2V4h3Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
          <path d="M21.4 7.2a2.8 2.8 0 0 0-2-2C17.6 4.7 12 4.7 12 4.7s-5.6 0-7.4.5a2.8 2.8 0 0 0-2 2A29.4 29.4 0 0 0 2 12a29.4 29.4 0 0 0 .6 4.8 2.8 2.8 0 0 0 2 2c1.8.5 7.4.5 7.4.5s5.6 0 7.4-.5a2.8 2.8 0 0 0 2-2A29.4 29.4 0 0 0 22 12a29.4 29.4 0 0 0-.6-4.8ZM10 15.6V8.4l6.2 3.6L10 15.6Z" />
        </svg>
      );
  }
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/images/nis/logo-nis.jpg"
                alt="Logo ufficiale Nazionale Italiana Sanitari"
                width={72}
                height={72}
                className="h-14 w-14 rounded-xl object-cover"
              />
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
                Nazionale Italiana Sanitari
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {socialFooterItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Apri ${item.label} in una nuova scheda`}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-slate-100 transition hover:border-sky-300/40 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  <SocialIcon platform={item.icon} />
                </a>
              ))}
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
