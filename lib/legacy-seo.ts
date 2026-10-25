export const legacyRedirects:Readonly<Record<string,string>>={
  "/be-nis-be-nice":"/diventa-socio",
  "/la-nazionale":"/chi-siamo",
  "/missione":"/chi-siamo",
  "/discipline":"/settori",
  "/sponsor":"/partner",
  "/privacy-policy/privacy-policy":"/privacy-policy",
  "/info-contatti/privacy-policy":"/privacy-policy",
  "/category/stampa/comunicati":"/news",
  "/category/interviste":"/news",
  "/info-contatti":"/contatti",
  "/become-a-volunteer":"/settori/volontariato",
  "/tag/nazionale-italiana-campioni-olimpionici":"/progetti/il-1-battito",
  "/donations":"/dona",
};

export const legacyGonePaths:ReadonlySet<string>=new Set([
  "/tag/luxury-living/feed",
  "/tag/diamond/feed",
  "/tag/fideuram",
  "/tag/moveax",
  "/top-5-destinations-adventure-travel",
]);

export const preservedNotFoundPaths:ReadonlySet<string>=new Set([
  "/moveax-al-fianco-della-solidarieta-supportare-loncologia-pediatrica-e-una-scelta-naturale",
]);

export function resolveLegacySeoPath(pathname:string){
  const hasTrailingSlash=pathname.length>1&&pathname.endsWith("/");
  const normalizedPath=hasTrailingSlash?pathname.replace(/\/+$/,""):pathname;

  return {
    normalizedPath,
    hasTrailingSlash,
    redirectTo:legacyRedirects[normalizedPath]??null,
    gone:legacyGonePaths.has(normalizedPath),
    preserveNotFound:preservedNotFoundPaths.has(normalizedPath),
  };
}
