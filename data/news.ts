export const newsCategories=["Tutte","Interviste","Associazione","Eventi","Progetti"] as const;

export type NewsCategory=Exclude<(typeof newsCategories)[number],"Tutte">;

export type NewsItem={
  id:string;
  title:string;
  date:string;
  category:NewsCategory;
  excerpt:string;
  href:string;
  image:string;
  imageAlt:string;
  imageWidth:number;
  imageHeight:number;
  imageFit?:"contain";
  linkLabel?:string;
};

export const alessandroRistoriNewsItem:NewsItem={
    id:"gran-gala-2026-intervista-alessandro-ristori",
    title:"Alessandro Ristori: “Sport e musica nascono da qualcosa di sano e le cose sane devono aiutare chi ha bisogno”",
    date:"2026-10-23",
    category:"Interviste",
    excerpt:"Alessandro Ristori racconta la propria carriera, il rapporto con la musica e le ragioni della sua partecipazione al Gran Galà NIS.",
    href:"/news/gran-gala-2026-intervista-alessandro-ristori",
    image:"/images/news/alessandro-ristori-ritratto.jpg",
    imageAlt:"Alessandro Ristori",
    imageWidth:335,
    imageHeight:597,
    linkLabel:"Leggi l’intervista",
};

export const scuolaVivaNewsItem:NewsItem={
    id:"gran-gala-2026-intervista-scuola-viva",
    title:"Gran Galà NIS, il 28 ottobre un aiuto concreto a Scuola Viva. L’intervista a Marco Evangelista",
    date:"2026-10-22",
    category:"Interviste",
    excerpt:"Marco Evangelista racconta la missione di Scuola Viva e i progetti sostenuti dalla raccolta fondi del Gran Gala NIS.",
    href:"/news/gran-gala-2026-intervista-scuola-viva",
    image:"/images/news/scuola-viva-logo.jpeg",
    imageAlt:"Scuola Viva ETS",
    imageWidth:380,
    imageHeight:138,
    imageFit:"contain",
    linkLabel:"Leggi l’intervista",
};

export const newsItems:NewsItem[]=[
  alessandroRistoriNewsItem,
  scuolaVivaNewsItem,
  {
    id:"consegna-50000-umberto-i",
    title:"€50.000 per l’Oncoematologia Pediatrica dell’Umberto I",
    date:"2025-12-22",
    category:"Progetti",
    excerpt:"La NIS ha consegnato il contributo raccolto con Il 1° Battito, destinato all’intervento di umanizzazione pittorica del reparto.",
    href:"/progetti/il-1-battito",
    image:"/images/progetti/il-primo-battito/consegna-policlinico-1.jpg",
    imageAlt:"La delegazione NIS durante la consegna del contributo al Policlinico Umberto I",
    imageWidth:1600,
    imageHeight:900,
  },
  {
    id:"crai-charity-award",
    title:"Il 1° Battito: sport e solidarietà in campo",
    date:"2025-11-15",
    category:"Eventi",
    excerpt:"Il CRAI Charity Award ha riunito sanitari, giornalisti e campioni dello sport per sostenere l’Oncoematologia Pediatrica dell’Umberto I.",
    href:"/progetti/il-1-battito",
    image:"/images/progetti/il-primo-battito/firma-assegno-2.jpg",
    imageAlt:"Firma dell’assegno solidale del CRAI Charity Award",
    imageWidth:900,
    imageHeight:1600,
  },
  {
    id:"nascita-nis",
    title:"Nasce la Nazionale Italiana Sanitari",
    date:"2025-09-26",
    category:"Associazione",
    excerpt:"Professionisti della salute uniti attraverso sport, prevenzione e solidarietà per costruire progetti concreti al servizio delle persone.",
    href:"/chi-siamo",
    image:"/images/brand/nis-is-nice.png",
    imageAlt:"NIS is NICE - Nazionale Italiana Sanitari",
    imageWidth:1942,
    imageHeight:809,
    imageFit:"contain",
  },
];
