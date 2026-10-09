import type {MetadataRoute} from "next";
import {sectors} from "@/data/site";
import {SITE_URL} from "@/lib/seo";

export default function sitemap():MetadataRoute.Sitemap{
  const routes:Array<{path:string;changeFrequency:MetadataRoute.Sitemap[number]["changeFrequency"];priority:number}>=[
    {path:"/",changeFrequency:"weekly",priority:1},
    {path:"/chi-siamo",changeFrequency:"monthly",priority:.9},
    {path:"/organigramma",changeFrequency:"monthly",priority:.7},
    {path:"/progetti",changeFrequency:"monthly",priority:.9},
    {path:"/progetti/il-1-battito",changeFrequency:"monthly",priority:.8},
    {path:"/progetti/prevenzione",changeFrequency:"monthly",priority:.7},
    {path:"/progetti/spirito-nis",changeFrequency:"monthly",priority:.7},
    {path:"/settori",changeFrequency:"monthly",priority:.8},
    ...sectors.map(sector=>({path:`/settori/${sector.slug}`,changeFrequency:"monthly" as const,priority:sector.slug==="calcio"?.8:.6})),
    {path:"/eventi",changeFrequency:"weekly",priority:.8},
    {path:"/news",changeFrequency:"weekly",priority:.8},
    {path:"/dicono-di-noi",changeFrequency:"weekly",priority:.7},
    {path:"/5x1000",changeFrequency:"yearly",priority:.7},
    {path:"/diventa-socio",changeFrequency:"monthly",priority:.8},
    {path:"/contatti",changeFrequency:"yearly",priority:.7},
    {path:"/dona",changeFrequency:"yearly",priority:.7},
    {path:"/partner",changeFrequency:"monthly",priority:.7},
    {path:"/sostienici",changeFrequency:"monthly",priority:.7},
    {path:"/trasparenza",changeFrequency:"monthly",priority:.5},
    {path:"/privacy-policy",changeFrequency:"yearly",priority:.3},
    {path:"/cookie-policy",changeFrequency:"yearly",priority:.3},
  ];

  return routes.map(route=>({url:new URL(route.path,SITE_URL).toString(),changeFrequency:route.changeFrequency,priority:route.priority}));
}
