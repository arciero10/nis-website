import type {MetadataRoute} from "next";
import {SITE_URL} from "@/lib/seo";

export default function robots():MetadataRoute.Robots{
  return {
    rules:{
      userAgent:"*",
      allow:"/",
      disallow:["/api/","/staff/","/checkin","/biglietto/","/conferma-biglietti/","/inviti/","/i/"],
    },
    sitemap:`${SITE_URL}/sitemap.xml`,
    host:SITE_URL,
  };
}
