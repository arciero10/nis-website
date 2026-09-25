import type {Metadata} from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";

const productionOrigin="https://www.nazionaleitalianasanitari.com";
const ogImage="https://www.nazionaleitalianasanitari.com/og-nis-social.png";
const siteDescription="Sport, salute e solidarietà per sostenere progetti concreti, prevenzione e iniziative dedicate alle persone.";

export const metadata:Metadata={
  metadataBase:new URL(productionOrigin),
  title:"Nazionale Italiana Sanitari",
  description:siteDescription,
  manifest:"/site.webmanifest",
  icons:{
    icon:[
      {url:"/favicon.ico",sizes:"any"},
      {url:"/favicon-96x96.png",sizes:"96x96",type:"image/png"},
    ],
    apple:[
      {url:"/apple-touch-icon.png",sizes:"180x180",type:"image/png"},
    ],
  },
  openGraph:{
    type:"website",
    locale:"it_IT",
    url:productionOrigin,
    title:"Nazionale Italiana Sanitari",
    description:siteDescription,
    siteName:"Nazionale Italiana Sanitari",
    images:[
      {
        url:ogImage,
        width:1200,
        height:630,
        alt:"Nazionale Italiana Sanitari",
      },
    ],
  },
  twitter:{
    card:"summary_large_image",
    title:"Nazionale Italiana Sanitari",
    description:siteDescription,
    site:"@NazItSanitari",
    images:[ogImage],
  },
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="it"><body><Header/><main>{children}</main><Footer/><RevealOnScroll/></body></html>;
}
