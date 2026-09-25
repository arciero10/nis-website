export const newsCategories=["Tutte","Associazione","Eventi","Progetti"] as const;

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
  imageFit?:"contain";
};

export const newsItems:NewsItem[]=[
  {
    id:"consegna-50000-umberto-i",
    title:"€50.000 per l’Oncoematologia Pediatrica dell’Umberto I",
    date:"2025-12-22",
    category:"Progetti",
    excerpt:"La NIS ha consegnato il contributo raccolto con Il 1° Battito, destinato all’intervento di umanizzazione pittorica del reparto.",
    href:"/progetti/il-1-battito",
    image:"/images/progetti/il-primo-battito/consegna-policlinico-1.jpg",
    imageAlt:"La delegazione NIS durante la consegna del contributo al Policlinico Umberto I",
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
    imageFit:"contain",
  },
];
