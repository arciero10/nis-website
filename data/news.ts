export const newsCategories=["Tutte","NIS","Eventi","Solidarietà","Rassegna stampa"] as const;

export type NewsCategory=Exclude<(typeof newsCategories)[number],"Tutte">;

export type NewsArticle={
  id:string;
  title:string;
  source:string;
  date:string;
  category:NewsCategory;
  excerpt:string;
  url:string;
  image?:string;
  imageAlt?:string;
  featured?:boolean;
};

export const newsArticles:NewsArticle[]=[
  {
    id:"ansa-nascita-nis",
    title:"In campo per la salute, nasce la Nazionale Italiana Sanitari",
    source:"ANSA",
    date:"2025-10-13",
    category:"NIS",
    excerpt:"La nascita di una squadra che riunisce professionisti sanitari, volontari e manager per trasformare sport e sensibilizzazione in progetti concreti di cura.",
    url:"https://www.ansa.it/sito/notizie/sport/calcio/2025/10/13/in-campo-per-la-salute-nasce-la-nazionale-italiana-sanitari_46344f85-294f-4327-bce9-31334a542300.html",
    image:"/images/team/community.jpg",
    imageAlt:"La community della Nazionale Italiana Sanitari",
    featured:true,
  },
  {
    id:"corriere-crai-cup",
    title:"CRAI Cup Charity Award: quadrangolare di beneficenza a sostegno dell’oncologia pediatrica dell’ospedale Umberto I di Roma",
    source:"Corriere dello Sport",
    date:"2025-11-12",
    category:"Eventi",
    excerpt:"Il quadrangolare del 15 novembre ha riunito quattro rappresentative con l’obiettivo di sostenere i progetti dell’Oncologia Pediatrica dell’Umberto I.",
    url:"https://www.corrieredellosport.it/news/calcio/2025/11/12-144513081/crai_cup_charity_award_quadrangolare_di_beneficenza_a_sostegno_delloncologia_pediatrica_dellospedale_umberto_i_di_roma",
    image:"/images/hero-events.jpg",
    imageAlt:"Evento sportivo e solidale della Nazionale Italiana Sanitari",
    featured:true,
  },
  {
    id:"policlinico-consegna-assegno",
    title:"Dalla sfida al campo alla cura del cuore: consegnato l’assegno solidale",
    source:"Policlinico Umberto I",
    date:"2025-12-22",
    category:"Solidarietà",
    excerpt:"La consegna ufficiale di 50.000 euro destinati all’umanizzazione dell’Oncoematologia Pediatrica, per rendere il reparto più accogliente per bambini e famiglie.",
    url:"https://www.policlinicoumberto1.it/dalla-sfida-al-campo-alla-cura-del-cuore-consegnato-lassegno-solidale/",
    image:"/images/progetti/il-primo-battito/assegno-50000.jpg",
    imageAlt:"Assegno solidale da 50.000 euro consegnato al Policlinico Umberto I",
    featured:true,
  },
  {
    id:"rainews-nascita-nis",
    title:"Nasce la Nazionale italiana Sanitari: sport e salute al servizio della solidarietà",
    source:"Rai News",
    date:"2025-10-13",
    category:"NIS",
    excerpt:"Rai News racconta la nuova associazione e la sua missione: unire competenze sanitarie e sport per promuovere iniziative benefiche e campagne di sensibilizzazione.",
    url:"https://www.rainews.it/articoli/2025/10/calcio-nasce-nazionale-italiana-sanitari-sport-salute-solidarieta-beneficenza-e45131cb-db19-4182-a542-e6e23a04eba5.html",
    image:"/images/team/lineup.jpg",
    imageAlt:"Formazione della Nazionale Italiana Sanitari",
  },
  {
    id:"ansa-primo-battito",
    title:"Il 1° Battito: torneo di beneficenza con Campioni dello Sport",
    source:"ANSA",
    date:"2025-11-12",
    category:"Eventi",
    excerpt:"Sanitari, giornalisti, campioni olimpici e una selezione Fideuram insieme in campo per finanziare progetti dedicati all’Oncologia Pediatrica dell’Umberto I.",
    url:"https://www.ansa.it/amp/sito/notizie/sport/calcio/2025/11/12/il-1-battito-torneo-di-beneficenza-con-campioni-dello-sport_b17b591e-fc34-4a57-bd5b-17b605d79985.html",
    image:"/images/hero-battito.jpg",
    imageAlt:"Il progetto benefico Il 1° Battito",
  },
  {
    id:"repubblica-nazionale-giornalisti",
    title:"La Nazionale giornalisti in campo a Roma a sostegno dell’oncologia pediatrica dell’Umberto I",
    source:"La Repubblica",
    date:"2025-11-12",
    category:"Rassegna stampa",
    excerpt:"La testata presenta il quadrangolare romano e la partecipazione della Nazionale dei giornalisti a fianco della NIS per sostenere l’oncologia pediatrica.",
    url:"https://www.repubblica.it/sport/calcio/2025/11/12/news/nazionale_giornalisti_beneficenza_quadrangolare_roma-424976989/",
    image:"/images/hero-events.jpg",
    imageAlt:"Quadrangolare solidale a sostegno dell’oncologia pediatrica",
  },
  {
    id:"laziopress-consegna-50000",
    title:"La Nazionale Italiana Sanitari consegna 50.000 euro al Policlinico Umberto I per l’Oncoematologia Pediatrica",
    source:"LazioPress",
    date:"2025-12-23",
    category:"Solidarietà",
    excerpt:"Il contributo raccolto con il progetto Il 1° Battito sosterrà interventi di umanizzazione del reparto dedicato ai piccoli pazienti e alle loro famiglie.",
    url:"https://www.laziopress.it/news/422327520774/la-nazionale-italiana-sanitari-consegna-50-000-euro-al-policlinico-umberto-i-per-l-oncoematologia-pediatrica",
    image:"/images/progetti/il-primo-battito/consegna-policlinico-1.jpg",
    imageAlt:"Consegna del contributo NIS al Policlinico Umberto I",
  },
  {
    id:"aris-nascita-nis",
    title:"In campo per la salute, nasce la Nazionale Italiana Sanitari",
    source:"ARIS",
    date:"2025-10-14",
    category:"Rassegna stampa",
    excerpt:"ARIS presenta la NIS e il suo esordio ufficiale: sport e professionalità sanitarie al servizio della solidarietà e delle persone più fragili.",
    url:"https://www.arisassociazione.it/news/news/in-campo-per-la-salute-nasce-la-nazionale-italiana-sanitari",
    image:"/images/team/community.jpg",
    imageAlt:"Professionisti e sostenitori della Nazionale Italiana Sanitari",
  },
];
