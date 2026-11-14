export const legacyGonePaths:ReadonlySet<string>=new Set([
  "/&",
  "/$",
  "/-Home",
  "/5x1000-5x1000",
  "/organigramma-Organigramma",
  "/settori-Settori",
  "/eventi-Eventi",
  "/news-News",
  "/contatti-Contatti",
  "/sostienici-Sostienici",
  "/progetti-Progetti",
  "/partner-Partner",
  "/be-nis-be-nice",
  "/la-nazionale",
  "/missione",
  "/discipline",
  "/sponsor",
  "/privacy-policy/privacy-policy",
  "/info-contatti/privacy-policy",
  "/category/stampa/comunicati",
  "/category/interviste",
  "/info-contatti",
  "/become-a-volunteer",
  "/tag/nazionale-italiana-campioni-olimpionici",
  "/donations",
  "/tag/luxury-living/feed",
  "/tag/diamond/feed",
  "/tag/fideuram",
  "/tag/moveax",
  "/top-5-destinations-adventure-travel",
]);

export function resolveLegacySeoPath(pathname:string){
  const hasTrailingSlash=pathname.length>1&&pathname.endsWith("/");
  const normalizedPath=hasTrailingSlash?pathname.replace(/\/+$/,""):pathname;

  return {
    normalizedPath,
    hasTrailingSlash,
    gone:legacyGonePaths.has(normalizedPath),
  };
}
