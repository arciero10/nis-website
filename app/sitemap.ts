import type {MetadataRoute} from "next";
import {sectors} from "@/data/site";

const baseUrl="https://www.nazionaleitalianasanitari.com";

export default function sitemap():MetadataRoute.Sitemap{
  const routes=[
    "",
    "/chi-siamo",
    "/organigramma",
    "/progetti",
    "/progetti/il-1-battito",
    "/progetti/prevenzione",
    "/progetti/spirito-nis",
    "/settori",
    ...sectors.map(sector=>`/settori/${sector.slug}`),
    "/eventi",
    "/news",
    "/5x1000",
    "/diventa-socio",
    "/contatti",
    "/dona",
    "/partner",
    "/sostienici",
    "/trasparenza",
    "/privacy-policy",
    "/cookie-policy",
  ];

  return routes.map(route=>({url:`${baseUrl}${route}`}));
}
