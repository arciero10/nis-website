export type GalaGalleryImage={
  id:string;
  src:string;
  alt:string;
  width:number;
  height:number;
  objectPosition?:string;
  imageFit?:"contain";
};

const imageBase="/images/gala-2026/immagini";

export const galaEventGalleryImages:GalaGalleryImage[]=[
  {id:"gruppo-palco",src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.14.38.jpeg`,alt:"Foto di gruppo sul palco del NIS Gala Charity Night 2026",width:1512,height:1008,objectPosition:"center 38%"},
  {id:"serata-ospiti",src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.14.52.jpeg`,alt:"Ospiti adulti durante la serata del NIS Gala Charity Night 2026",width:1512,height:1008,objectPosition:"center 48%"},
  {id:"momento-istituzionale",src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.14.40.jpeg`,alt:"Momento istituzionale sul palco del NIS Gala Charity Night 2026",width:1512,height:1008,objectPosition:"center 42%"},
  {id:"rappresentanti",src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.14.45.jpeg`,alt:"Rappresentanti NIS riuniti sul palco del Gala 2026",width:1512,height:1008,objectPosition:"center 38%"},
  {id:"intervento-istituzionale",src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.14.60.jpeg`,alt:"Intervento istituzionale al NIS Gala Charity Night 2026",width:1512,height:1008,objectPosition:"center 34%"},
  {id:"racconto-progetti",src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.14.48.jpeg`,alt:"Il racconto dei progetti NIS durante il Gala 2026",width:1512,height:1008,objectPosition:"center"},
  {id:"intervista-nis",src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.32.57.jpeg`,alt:"Intervista durante il NIS Gala Charity Night 2026",width:1600,height:1200,objectPosition:"center 40%"},
  {id:"intervista-conclusiva",src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.57.44.jpeg`,alt:"Intervista conclusiva al NIS Gala Charity Night 2026",width:2000,height:1126,objectPosition:"center 42%"},
  {id:"presentatori",src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.15.43.jpeg`,alt:"Presentatori e ospiti sul palco del NIS Gala Charity Night 2026",width:1512,height:1008,objectPosition:"center 38%"},
  {id:"conduzione",src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.14.46.jpeg`,alt:"Conduzione del NIS Gala Charity Night 2026",width:1008,height:1512,objectPosition:"center 26%",imageFit:"contain"},
  {id:"intervento",src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.14.43.jpeg`,alt:"Intervento dal palco durante il NIS Gala Charity Night 2026",width:1512,height:1008,objectPosition:"center 34%"},
];

const heroIds=new Set(["gruppo-palco","serata-ospiti","momento-istituzionale","intervista-nis","presentatori","intervento","rappresentanti","intervento-istituzionale","intervista-conclusiva"]);
export const galaHeroImages=galaEventGalleryImages.filter(image=>heroIds.has(image.id));
