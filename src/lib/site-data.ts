import type { Metadata } from "next";

export const siteUrl = "https://nazionaleitalianasanitari.it";
export const siteName = "Nazionale Italiana Sanitari";
export const defaultDescription =
  "Sport, prevenzione e solidarieta al servizio della salute. Il sito istituzionale della Nazionale Italiana Sanitari racconta missione, eventi, discipline, partner e iniziative di sostegno.";
export const ogImage = "/logo/logo.jpg";

export const socialLinks = {
  instagram: "https://www.instagram.com/nazionaleitalianasanitari",
  facebook: "https://www.facebook.com/NazionaleItalianaSanitari/",
  youtube: "https://www.youtube.com/@NazionaleItalianaSanitari",
  x: "https://x.com/NazItSanitari",
  tiktok: "https://www.tiktok.com/@nazionalesanitari",
  calcio: "https://calcio.nazionaleitalianasanitari.it",
};

export const contactInfo = {
  email: "info@nazionaleitalianasanitari.com",
  pressEmail: "ufficiostampa@nazionaleitalianasanitari.com",
  phone: "+39 06 0000 0000",
  city: "Roma, Italia",
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Chi siamo", href: "/chi-siamo" },
  { label: "Progetti", href: "/sostienici" },
  { label: "Settori", href: "/discipline" },
  { label: "Diventa Socio", href: "/diventa-socio" },
  { label: "Eventi", href: "/eventi" },
  { label: "News", href: "/news" },
  { label: "Contatti", href: "/contatti" },
];

export const footerColumns = [
  {
    title: "Istituzionale",
    links: [
      { label: "Chi siamo", href: "/chi-siamo" },
      { label: "Missione", href: "/missione" },
      { label: "Discipline", href: "/discipline" },
      { label: "News", href: "/news" },
    ],
  },
  {
    title: "Attivita",
    links: [
      { label: "Eventi", href: "/eventi" },
      { label: "Sponsor", href: "/sponsor" },
      { label: "Sostienici", href: "/sostienici" },
      { label: "5x1000", href: "/5x1000" },
    ],
  },
  {
    title: "Contatti",
    links: [
      { label: "Contatti", href: "/contatti" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Cookie Policy", href: "/cookie-policy" },
    ],
  },
];

export const featuredEvents = [
  {
    slug: "/eventi/lilt-for-life",
    title: "LILT for Life - Prevenzione in campo",
    date: "9 giugno 2026",
    location: "Frosinone",
    description:
      "Una giornata speciale in cui sport e sensibilizzazione si incontrano per sostenere programmi di prevenzione oncologica sul territorio.",
  },
  {
    slug: "/eventi",
    title: "Quadrangolare Solidale",
    date: "7 novembre 2025",
    location: "Roma",
    description:
      "Evento benefico a sostegno della salute e della prevenzione, pensato per coinvolgere pubblico, partner e istituzioni.",
  },
  {
    slug: "/eventi",
    title: "Giornata della prevenzione",
    date: "Primavera 2026",
    location: "Centro Italia",
    description:
      "Un format in espansione che unisce presenza pubblica, attivazioni sul territorio e contenuti di sensibilizzazione.",
  },
];

export const disciplines = [
  {
    title: "Calcio",
    description:
      "La disciplina oggi piu visibile del progetto, destinata a vivere anche con un sito dedicato sul futuro subdominio ufficiale.",
    href: socialLinks.calcio,
    external: true,
    cta: "Vai all'area calcio",
    status: "Attiva",
  },
  {
    title: "Running",
    description:
      "Un'area in sviluppo dedicata a partecipazione diffusa, benessere, eventi cittadini e campagne di sensibilizzazione.",
    href: "/discipline",
    external: false,
    cta: "In sviluppo",
    status: "In sviluppo",
  },
  {
    title: "Altre discipline",
    description:
      "Una piattaforma aperta a nuove esperienze sportive coerenti con salute, prevenzione, inclusione e solidarieta.",
    href: "/discipline",
    external: false,
    cta: "Area in espansione",
    status: "In espansione",
  },
];

export const sponsors = [
  {
    name: "PANTELEIA",
    category: "Partner tecnico e digitale",
    logoSrc: "/images/sponsor/logo-panteleia.jpg",
  },
  {
    name: "Burger King",
    category: "Food Partner",
    logoSrc: "/images/sponsor/logo-burger-king.jpeg",
  },
  {
    name: "CRAI",
    category: "Food Partner",
    logoSrc: "/images/sponsor/logo-crai.jpg",
  },
  {
    name: "L'Isola della Pizza",
    category: "Food Partner",
    logoSrc: "/images/sponsor/logo-isola-pizza.jpeg",
  },
  {
    name: "Limori",
    category: "Beverage Partner",
    logoSrc: "/images/sponsor/logo-limoni.jpeg",
  },
  {
    name: "Moretti Bevande",
    category: "Beverage & Distribuzione",
    logoSrc: "/images/sponsor/logo-moretti.jpeg",
  },
];

export const newsItems = [
  {
    slug: "/news",
    category: "Istituzionale",
    title: "La Nazionale Italiana Sanitari rafforza il suo posizionamento come progetto di sport e salute",
    excerpt:
      "La piattaforma cresce come spazio di incontro tra professionisti della sanita, partner e cittadini, con un'identita sempre piu chiara.",
    date: "14 giugno 2026",
  },
  {
    slug: "/news",
    category: "Eventi",
    title: "Nuovi appuntamenti in preparazione per sostenere prevenzione e solidarieta",
    excerpt:
      "La programmazione 2026 punta su iniziative capaci di unire pubblico, territorio e messaggi di utilita sociale.",
    date: "5 giugno 2026",
  },
  {
    slug: "/news",
    category: "Discipline",
    title: "Calcio, running e nuove aree: il progetto si apre a una visione multisport",
    excerpt:
      "La disciplina calcistica resta centrale, ma il sito istituzionale racconta una missione piu ampia e in espansione.",
    date: "28 maggio 2026",
  },
];

export function buildMetadata({
  title,
  description = defaultDescription,
  path = "/",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const canonical = path === "/" ? siteUrl : `${siteUrl}${path}`;
  const fullTitle = title === siteName ? siteName : `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      "Nazionale Italiana Sanitari",
      "sport e salute",
      "prevenzione",
      "solidarieta",
      "eventi benefici",
      "sponsor",
      "5x1000",
      "donazioni",
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName,
      locale: "it_IT",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 1200,
          alt: `${siteName} logo ufficiale`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
