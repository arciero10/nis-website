import type {Metadata} from "next";
import {NIS_GALA_PRIVATE_INVITATION_URL} from "@/data/ticketing";

export const metadata:Metadata={
  title:"Invito NIS Gala Charity Night",
  alternates:{canonical:NIS_GALA_PRIVATE_INVITATION_URL},
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
