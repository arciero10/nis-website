import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";

const apexHost="nazionaleitalianasanitari.com";
const canonicalHost="www.nazionaleitalianasanitari.com";
const legacyRedirects:Record<string,string>={
  "/be-nis-be-nice":"/diventa-socio",
  "/la-nazionale":"/chi-siamo",
  "/missione":"/chi-siamo",
  "/discipline":"/settori",
  "/sponsor":"/partner",
  "/privacy-policy/privacy-policy":"/privacy-policy",
  "/info-contatti/privacy-policy":"/privacy-policy",
  "/category/stampa/comunicati":"/news",
  "/category/interviste":"/dicono-di-noi",
  "/info-contatti":"/contatti",
  "/tag/fideuram":"/progetti/il-1-battito",
  "/tag/nazionale-italiana-campioni-olimpionici":"/progetti/il-1-battito",
  "/donations":"/dona",
};
const legacyGonePaths=new Set([
  "/tag/luxury-living/feed",
  "/tag/diamond/feed",
  "/tag/moveax",
  "/top-5-destinations-adventure-travel",
]);
const preservedNotFoundPaths=new Set([
  "/moveax-al-fianco-della-solidarieta-supportare-loncologia-pediatrica-e-una-scelta-naturale",
]);

export function middleware(request:NextRequest){
  const forwardedHost=request.headers.get("x-forwarded-host")?.split(",")[0].trim();
  const requestHost=forwardedHost||request.headers.get("host")||request.nextUrl.hostname;
  const hostname=requestHost.split(":")[0].toLowerCase();

  const hasTrailingSlash=request.nextUrl.pathname.length>1&&request.nextUrl.pathname.endsWith("/");
  const normalizedPath=hasTrailingSlash?request.nextUrl.pathname.replace(/\/+$/,""):request.nextUrl.pathname;
  const canonicalPath=legacyRedirects[normalizedPath];

  if(legacyGonePaths.has(normalizedPath)){
    return new NextResponse(null,{
      status:410,
      headers:{"X-Robots-Tag":"noindex, nofollow, noarchive"},
    });
  }

  if(preservedNotFoundPaths.has(normalizedPath)&&hostname!==apexHost){
    return NextResponse.next();
  }

  if(hostname!==apexHost&&!canonicalPath&&!hasTrailingSlash){
    return NextResponse.next();
  }

  const useCanonicalHost=hostname===apexHost||Boolean(canonicalPath);
  const destinationHost=useCanonicalHost?canonicalHost:requestHost;
  const destinationProtocol=useCanonicalHost?"https:":request.nextUrl.protocol;
  const destination=new URL(
    `${canonicalPath||normalizedPath}${request.nextUrl.search}`,
    `${destinationProtocol}//${destinationHost}`,
  );

  return NextResponse.redirect(destination,301);
}

export const config={matcher:"/:path*"};
