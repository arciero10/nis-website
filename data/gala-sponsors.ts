export type GalaSponsor={
  id:"crai"|"servizi-cherubini"|"pic-event-solution"|"another-studio";
  name:string;
  image:string;
  width:number;
  height:number;
  className:string;
};

export const galaSponsors:GalaSponsor[]=[
  {id:"crai",name:"CRAI",image:"/images/gala-2026/sponsor/crai.png",width:683,height:365,className:"is-crai"},
  {id:"servizi-cherubini",name:"Servizi Cherubini - Banqueting & Catering",image:"/images/gala-2026/sponsor/servizi-cherubini.png",width:447,height:447,className:"is-cherubini"},
  {id:"pic-event-solution",name:"PIC Event Solution",image:"/images/gala-2026/sponsor/pic-event-solution.png",width:300,height:300,className:"is-pic"},
  {id:"another-studio",name:"AnotherStudio",image:"/images/gala-2026/sponsor/another-studio.png",width:738,height:384,className:"is-another-studio"},
];

export const GALA_SPONSOR_LABEL="CON IL SUPPORTO DI";
export const NIS_PUBLIC_ORIGIN="https://www.nazionaleitalianasanitari.com";
