export type GalaSponsor={
  id:"crai"|"servizi-cherubini"|"pic-event-solution"|"another-studio"|"gruppo-galli"|"italian-pathology-genomics"|"limori"|"moretti"|"sakura";
  name:string;
  image:string;
  width:number;
  height:number;
  className:string;
};

export const galaSponsors:GalaSponsor[]=[
  {id:"crai",name:"CRAI",image:"/images/gala-2026/sponsor/crai.png",width:683,height:365,className:"is-crai"},
  {id:"servizi-cherubini",name:"Servizi Cherubini - Banqueting & Catering",image:"/images/gala-2026/sponsor/servizi-cherubini.png",width:1600,height:873,className:"is-cherubini"},
  {id:"pic-event-solution",name:"PIC Event Solution",image:"/images/gala-2026/sponsor/pic-event-solution.png",width:300,height:300,className:"is-pic"},
  {id:"another-studio",name:"AnotherStudio",image:"/images/gala-2026/sponsor/another-studio.png",width:738,height:384,className:"is-another-studio"},
  {id:"gruppo-galli",name:"Gruppo Galli",image:"/images/gala-2026/sponsor/gruppo-galli.png",width:307,height:194,className:"is-gruppo-galli"},
  {id:"italian-pathology-genomics",name:"Italian Pathology & Genomics",image:"/images/gala-2026/sponsor/Italian-Pathology-Genomics.png",width:760,height:240,className:"is-ipg"},
  {id:"limori",name:"Limori",image:"/images/gala-2026/sponsor/limori.png",width:875,height:941,className:"is-limori"},
  {id:"moretti",name:"Moretti Bevande",image:"/images/gala-2026/sponsor/moretti.png",width:975,height:1016,className:"is-moretti"},
  {id:"sakura",name:"Sakura",image:"/images/gala-2026/sponsor/sakura.png",width:941,height:886,className:"is-sakura"},
];

export const GALA_SPONSOR_LABEL="CON IL SUPPORTO DI";
export const NIS_PUBLIC_ORIGIN="https://www.nazionaleitalianasanitari.com";
