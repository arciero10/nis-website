export type GalaGalleryImage={
  src:string;
  alt:string;
  width:number;
  height:number;
  objectPosition?:string;
};

const imageBase="/images/gala-2026/immagini";

export const galaGalleryImages:GalaGalleryImage[]=[
  {src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.14.38.jpeg`,alt:"Foto di gruppo sul palco del NIS Gala Charity Night 2026",width:1512,height:1008,objectPosition:"center 38%"},
  {src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.14.52.jpeg`,alt:"Ospiti adulti durante la serata del NIS Gala Charity Night 2026",width:1512,height:1008,objectPosition:"center 48%"},
  {src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.14.40.jpeg`,alt:"Momento istituzionale sul palco del NIS Gala Charity Night 2026",width:1512,height:1008,objectPosition:"center 42%"},
  {src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.32.57.jpeg`,alt:"Intervista durante il NIS Gala Charity Night 2026",width:1600,height:1200,objectPosition:"center 40%"},
  {src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.15.43.jpeg`,alt:"Presentatori e ospiti sul palco del NIS Gala Charity Night 2026",width:1512,height:1008,objectPosition:"center 38%"},
  {src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.14.43.jpeg`,alt:"Intervento dal palco durante il NIS Gala Charity Night 2026",width:1512,height:1008,objectPosition:"center 34%"},
  {src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.14.45.jpeg`,alt:"Rappresentanti NIS riuniti sul palco del Gala 2026",width:1512,height:1008,objectPosition:"center 38%"},
  {src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.14.60.jpeg`,alt:"Intervento istituzionale al NIS Gala Charity Night 2026",width:1512,height:1008,objectPosition:"center 34%"},
  {src:`${imageBase}/WhatsApp Image 2026-10-28 at 22.57.44.jpeg`,alt:"Intervista conclusiva al NIS Gala Charity Night 2026",width:2000,height:1126,objectPosition:"center 42%"},
];

const previewIndexes=new Set([0,1,2,3,4,8]);
export const galaGalleryPreviewImages=galaGalleryImages.filter((_,index)=>previewIndexes.has(index));
