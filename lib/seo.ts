import type {Metadata} from "next";

export const SITE_URL="https://www.nazionaleitalianasanitari.com";
export const SITE_NAME="Nazionale Italiana Sanitari";
export const DEFAULT_OG_IMAGE=`${SITE_URL}/og-nis-social.png`;

type PageMetadataInput={
  title:string;
  description:string;
  path:string;
  image?:string;
};

export type BreadcrumbItem={name:string;path:string};

export function createPageMetadata({title,description,path,image=DEFAULT_OG_IMAGE}:PageMetadataInput):Metadata{
  const canonical=new URL(path,SITE_URL).toString();
  const imageUrl=new URL(image,SITE_URL).toString();

  return {
    title,
    description,
    alternates:{canonical},
    openGraph:{
      type:"website",
      locale:"it_IT",
      url:canonical,
      siteName:SITE_NAME,
      title,
      description,
      images:[{url:imageUrl,width:1200,height:630,alt:SITE_NAME}],
    },
    twitter:{
      card:"summary_large_image",
      title,
      description,
      images:[imageUrl],
    },
  };
}

export const organizationJsonLd={
  "@context":"https://schema.org",
  "@type":"Organization",
  "@id":`${SITE_URL}/#organization`,
  name:SITE_NAME,
  url:SITE_URL,
  logo:{
    "@type":"ImageObject",
    url:`${SITE_URL}/logo/nis-logo-square.png`,
  },
  email:"info@nazionaleitalianasanitari.com",
  sameAs:[
    "https://www.facebook.com/NazionaleItalianaSanitari/",
    "https://www.instagram.com/nazionaleitalianasanitari/",
    "https://x.com/NazItSanitari",
    "https://www.tiktok.com/@nazionalesanitari",
    "https://www.youtube.com/@NazionaleItalianaSanitari",
  ],
};

export const websiteJsonLd={
  "@context":"https://schema.org",
  "@type":"WebSite",
  "@id":`${SITE_URL}/#website`,
  url:`${SITE_URL}/`,
  name:SITE_NAME,
  inLanguage:"it-IT",
  publisher:{"@id":`${SITE_URL}/#organization`},
};

export function createBreadcrumbJsonLd(items:BreadcrumbItem[]){
  return {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    itemListElement:items.map((item,index)=>({
      "@type":"ListItem",
      position:index+1,
      name:item.name,
      item:new URL(item.path,SITE_URL).toString(),
    })),
  };
}
