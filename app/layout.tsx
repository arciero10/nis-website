import type {Metadata} from "next";
import {headers} from "next/headers";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";

const productionOrigin="https://www.nazionaleitalianasanitari.com";
const ogImage="/og-image-v2.jpg";

function isAllowedMetadataHost(host:string){
  const hostname=host.split(":")[0].toLowerCase();
  return hostname==="www.nazionaleitalianasanitari.com"||
    hostname==="nazionaleitalianasanitari.com"||
    hostname.endsWith(".azurewebsites.net")||
    hostname==="localhost"||
    hostname==="127.0.0.1";
}

export async function generateMetadata():Promise<Metadata>{
  const requestHeaders=await headers();
  const forwardedHost=requestHeaders.get("x-forwarded-host")?.split(",")[0].trim();
  const host=forwardedHost||requestHeaders.get("host");
  const forwardedProtocol=requestHeaders.get("x-forwarded-proto")?.split(",")[0].trim();
  const localHost=host?.startsWith("localhost")||host?.startsWith("127.0.0.1");
  const protocol=forwardedProtocol||(localHost?"http":"https");
  const metadataBase=host&&isAllowedMetadataHost(host)
    ?new URL(`${protocol}://${host}`)
    :new URL(productionOrigin);

  return {
    metadataBase,
    title:"Nazionale Italiana Sanitari",
    description:"In campo per la salute. Uniti per la vita.",
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
      title:"Nazionale Italiana Sanitari",
      description:"In campo per la salute. Uniti per la vita.",
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
      description:"In campo per la salute. Uniti per la vita.",
      site:"@NazItSanitari",
      images:[ogImage],
    },
  };
}

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="it"><body><Header/><main>{children}</main><Footer/><RevealOnScroll/></body></html>;
}
