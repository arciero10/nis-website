import Link from "next/link";

import { contactInfo, socialLinks } from "@/lib/site-data";

const socialFooterItems = [
  { label: "Instagram", href: socialLinks.instagram, icon: "instagram" },
  { label: "Facebook", href: socialLinks.facebook, icon: "facebook" },
  { label: "X", href: socialLinks.x, icon: "x" },
  { label: "TikTok", href: socialLinks.tiktok, icon: "tiktok" },
  { label: "YouTube", href: socialLinks.youtube, icon: "youtube" },
] as const;

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Chi siamo", href: "/chi-siamo" },
  { label: "Progetti", href: "/progetti" },
  { label: "Diventa Socio", href: "/diventa-socio" },
  { label: "Contatti", href: "/contatti" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
];

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
    <footer className="mt-auto border-t border-white/10 bg-[linear-gradient(180deg,#061426_0%,#020617_100%)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:py-10">
        <div className="grid gap-7 border-b border-white/10 pb-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-9 lg:pb-9">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">
              Contatti
            </h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-300 lg:mt-5">
              <a
                href={`mailto:${contactInfo.email}`}
                className="break-words transition hover:text-white"
              >
                {contactInfo.email}
              </a>
              <a
                href={`mailto:${contactInfo.pressEmail}`}
                className="break-words transition hover:text-white"
              >
                {contactInfo.pressEmail}
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">
              Link rapidi
            </h2>
            <nav className="mt-4 grid gap-3 text-sm text-slate-300 lg:mt-5">
              {quickLinks.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">
              Seguici
            </h2>
            <nav className="mt-4 grid gap-3 text-sm text-slate-300 lg:mt-5">
              {socialFooterItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-white"
                >
                  <SocialIcon platform={item.icon} />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">
              Legale
            </h2>
            <nav className="mt-4 grid gap-3 text-sm text-slate-300 lg:mt-5">
              {legalLinks.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="pt-5 text-sm leading-7 text-slate-400 lg:pt-7">
          <p>
            &copy; All rights reserved. Sito realizzato da PANTELEIA - Associazione Promozione
            Sociale. CF: 96647400587
            <br />
            Iscrizione RUNTS: Rep. n. 165890 &ndash; Det. n. G03684 del 19/03/2026.
          </p>
        </div>
      </div>
    </footer>
  );
}
