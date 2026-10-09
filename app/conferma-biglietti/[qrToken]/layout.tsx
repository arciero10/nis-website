import type {Metadata} from "next";

export const metadata:Metadata={
  title:"Conferma biglietti NIS",
  robots:{index:false,follow:false,noarchive:true,nocache:true,googleBot:{index:false,follow:false,noarchive:true}},
};

export default function TicketConfirmationLayout({children}:{children:React.ReactNode}){return children;}
