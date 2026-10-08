import type {Metadata} from "next";

export const metadata:Metadata={
  title:"Invito NIS Gala Charity Night",
  robots:{
    index:false,
    follow:false,
    noarchive:true,
    nocache:true,
    googleBot:{index:false,follow:false,noarchive:true},
  },
};

export default function GalaInvitationLayout({children}:{children:React.ReactNode}){
  return children;
}
