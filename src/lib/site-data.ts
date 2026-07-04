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
  { label: "Missione", href: "/missione" },
  { label: "Eventi", href: "/eventi" },
  { label: "Discipline", href: "/discipline" },
  { label: "Sponsor", href: "/sponsor" },
  { label: "Sostienici", href: "/sostienici" },
  { label: "5x1000", href: "/5x1000" },
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
    description:
      "Supporto alla presenza digitale, alla struttura del sito istituzionale e alla valorizzazione del progetto NIS.",
    logoSrc: "/images/sponsor/logo-panteleia.png",
  },
  {
    name: "Main Partner",
    category: "Spazio sponsor principale",
    description:
      "Area riservata a un partner di primo livello a sostegno delle principali iniziative istituzionali e solidali.",
  },
  {
    name: "Partner tecnico",
    category: "Tecnologia e supporto operativo",
    description:
      "Slot pensato per realta che contribuiscono a eventi, organizzazione, materiali e sviluppo delle attivita.",
  },
  {
    name: "Partner sanitario",
    category: "Prevenzione e salute",
    description:
      "Spazio dedicato a partner coerenti con il mondo della prevenzione, della cura e del benessere collettivo.",
  },
  {
    name: "Supporter",
    category: "Sostegno a eventi e fundraising",
    description:
      "Placeholder per aziende e organizzazioni che affiancano campagne, raccolte fondi e appuntamenti territoriali.",
  },
  {
    name: "Media Partner",
    category: "Comunicazione istituzionale",
    description:
      "Area dedicata a collaborazioni editoriali e mediatiche per dare visibilita alle iniziative della Nazionale.",
  },
  {
    name: "Partner digitale",
    category: "Innovazione e contenuti",
    description:
      "Spazio per partner focalizzati su piattaforme, servizi online, creativita e diffusione dei contenuti.",
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
