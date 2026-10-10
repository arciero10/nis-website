import type {Metadata} from "next";
import {NIS_GALA_PRIVATE_INVITATION_URL,NIS_GALA_SOCIAL_IMAGE} from "@/data/ticketing";

const title="NIS Gala Charity Night – 28 ottobre 2026, Roma";
const description="Una serata di beneficenza per sostenere i progetti della Nazionale Italiana Sanitari. Biglietti nominativi con QR Code.";

export const metadata:Metadata={
  title,
  description,
  alternates:{canonical:NIS_GALA_PRIVATE_INVITATION_URL},
  openGraph:{title,description,url:NIS_GALA_PRIVATE_INVITATION_URL,type:"website",siteName:"Nazionale Italiana Sanitari",locale:"it_IT",images:[{url:NIS_GALA_SOCIAL_IMAGE,width:1200,height:630,alt:"Nazionale Italiana Sanitari"}]},
  twitter:{card:"summary_large_image",title,description,images:[NIS_GALA_SOCIAL_IMAGE]},
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
