export const pressCategories=["Tutte","NIS","Eventi","Solidarietà"] as const;

export type PressCategory=Exclude<(typeof pressCategories)[number],"Tutte">;

export type PressArticle={
  id:string;
  title:string;
  sourceName:string;
  sourceLogo:string|null;
  logoTreatment?:"dark-ink";
  date:string;
  category:PressCategory;
  excerpt:string;
  url:string;
};

const pressSourceOrder=["Il Sole 24 Ore","Rai News","La Repubblica","ANSA","Corriere dello Sport"];

export const pressArticles:PressArticle[]=([
  {
    id:"laziopress-consegna-50000",
    title:"La Nazionale Italiana Sanitari consegna 50.000 euro al Policlinico Umberto I per l’Oncoematologia Pediatrica",
    sourceName:"LazioPress",
    sourceLogo:"/loghi-testate/laziopress.png",
    date:"2025-12-23",
    category:"Solidarietà",
    excerpt:"Il contributo raccolto con il progetto Il 1° Battito sosterrà interventi di umanizzazione del reparto dedicato ai piccoli pazienti e alle loro famiglie.",
    url:"https://www.laziopress.it/news/422327520774/la-nazionale-italiana-sanitari-consegna-50-000-euro-al-policlinico-umberto-i-per-l-oncoematologia-pediatrica",
  },
  {
    id:"policlinico-consegna-assegno",
    title:"Dalla sfida al campo alla cura del cuore: consegnato l’assegno solidale",
    sourceName:"Policlinico Umberto I",
    sourceLogo:"/loghi-testate/policlinico-umberto-i.png",
    date:"2025-12-22",
    category:"Solidarietà",
    excerpt:"La consegna ufficiale di 50.000 euro destinati all’umanizzazione dell’Oncoematologia Pediatrica, per rendere il reparto più accogliente per bambini e famiglie.",
    url:"https://www.policlinicoumberto1.it/dalla-sfida-al-campo-alla-cura-del-cuore-consegnato-lassegno-solidale/",
  },
  {
    id:"corriere-crai-cup",
    title:"CRAI Cup Charity Award: quadrangolare di beneficenza a sostegno dell’oncologia pediatrica dell’ospedale Umberto I di Roma",
    sourceName:"Corriere dello Sport",
    sourceLogo:"/loghi-testate/corriere-dello-sport.svg",
    date:"2025-11-12",
    category:"Eventi",
    excerpt:"Il quadrangolare del 15 novembre ha riunito quattro rappresentative con l’obiettivo di sostenere i progetti dell’Oncologia Pediatrica dell’Umberto I.",
    url:"https://www.corrieredellosport.it/news/calcio/2025/11/12-144513081/crai_cup_charity_award_quadrangolare_di_beneficenza_a_sostegno_delloncologia_pediatrica_dellospedale_umberto_i_di_roma",
  },
  {
    id:"ansa-primo-battito",
    title:"Il 1° Battito: torneo di beneficenza con Campioni dello Sport",
    sourceName:"ANSA",
    sourceLogo:"/loghi-testate/ansa.png",
    logoTreatment:"dark-ink",
    date:"2025-11-12",
    category:"Eventi",
    excerpt:"Sanitari, giornalisti, campioni olimpici e una selezione Fideuram insieme in campo per finanziare progetti dedicati all’Oncologia Pediatrica dell’Umberto I.",
    url:"https://www.ansa.it/amp/sito/notizie/sport/calcio/2025/11/12/il-1-battito-torneo-di-beneficenza-con-campioni-dello-sport_b17b591e-fc34-4a57-bd5b-17b605d79985.html",
  },
  {
    id:"repubblica-nazionale-giornalisti",
    title:"La Nazionale giornalisti in campo a Roma a sostegno dell’oncologia pediatrica dell’Umberto I",
    sourceName:"La Repubblica",
    sourceLogo:"/loghi-testate/repubblica.svg",
    date:"2025-11-12",
    category:"Eventi",
    excerpt:"La testata presenta il quadrangolare romano e la partecipazione della Nazionale dei giornalisti a fianco della NIS per sostenere l’oncologia pediatrica.",
    url:"https://www.repubblica.it/sport/calcio/2025/11/12/news/nazionale_giornalisti_beneficenza_quadrangolare_roma-424976989/",
  },
  {
    id:"gol-del-napoli-nascita-nis",
    title:"Nasce la Nazionale Italiana Sanitari",
    sourceName:"Gol del Napoli",
    sourceLogo:"/loghi-testate/gol-del-napoli.png",
    date:"2025-10-15",
    category:"NIS",
    excerpt:"La testata presenta la Nazionale Italiana Sanitari e la sua missione di promuovere salute e solidarietà attraverso lo sport.",
    url:"https://www.goldelnapoli.it/nasce-la-nazionale-italiana-sanitari/",
  },
  {
    id:"aris-nascita-nis",
    title:"In campo per la salute, nasce la Nazionale Italiana Sanitari",
    sourceName:"ARIS",
    sourceLogo:"/loghi-testate/aris.svg",
    date:"2025-10-14",
    category:"NIS",
    excerpt:"ARIS presenta la NIS e il suo esordio ufficiale: sport e professionalità sanitarie al servizio della solidarietà e delle persone più fragili.",
    url:"https://www.arisassociazione.it/news/news/in-campo-per-la-salute-nasce-la-nazionale-italiana-sanitari",
  },
  {
    id:"ansa-nascita-nis",
    title:"In campo per la salute, nasce la Nazionale Italiana Sanitari",
    sourceName:"ANSA",
    sourceLogo:"/loghi-testate/ansa.png",
    logoTreatment:"dark-ink",
    date:"2025-10-13",
    category:"NIS",
    excerpt:"La nascita di una squadra che riunisce professionisti sanitari, volontari e manager per trasformare sport e sensibilizzazione in progetti concreti di cura.",
    url:"https://www.ansa.it/sito/notizie/sport/calcio/2025/10/13/in-campo-per-la-salute-nasce-la-nazionale-italiana-sanitari_46344f85-294f-4327-bce9-31334a542300.html",
  },
  {
    id:"rainews-nascita-nis",
    title:"Nasce la Nazionale italiana Sanitari: sport e salute al servizio della solidarietà",
    sourceName:"Rai News",
    sourceLogo:"/loghi-testate/rainews.png",
    date:"2025-10-13",
    category:"NIS",
    excerpt:"Rai News racconta la nuova associazione e la sua missione: unire competenze sanitarie e sport per promuovere iniziative benefiche e campagne di sensibilizzazione.",
    url:"https://www.rainews.it/articoli/2025/10/calcio-nasce-nazionale-italiana-sanitari-sport-salute-solidarieta-beneficenza-e45131cb-db19-4182-a542-e6e23a04eba5.html",
  },
  {
    id:"sole24ore-nascita-nis",
    title:"Nasce la Nazionale Italiana Sanitari, progetto sport e solidarietà",
    sourceName:"Il Sole 24 Ore",
    sourceLogo:"/loghi-testate/sole24ore.svg",
    date:"2025-10-13",
    category:"NIS",
    excerpt:"Il quotidiano racconta la nascita della NIS e il progetto che unisce professionisti sanitari, attività sportiva e iniziative concrete di solidarietà.",
    url:"https://www.ilsole24ore.com/art/nasce-nazionale-italiana-sanitari-progetto-sport-e-solidarieta-AHSWtI9C",
  },
] satisfies PressArticle[]).sort((first,second)=>{
  const firstIndex=pressSourceOrder.indexOf(first.sourceName);
  const secondIndex=pressSourceOrder.indexOf(second.sourceName);
  const firstRank=firstIndex===-1?pressSourceOrder.length:firstIndex;
  const secondRank=secondIndex===-1?pressSourceOrder.length:secondIndex;
  return firstRank-secondRank;
});
