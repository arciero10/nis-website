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
  "/donations":"/dona",
};

export function middleware(request:NextRequest){
  const forwardedHost=request.headers.get("x-forwarded-host")?.split(",")[0].trim();
  const requestHost=forwardedHost||request.headers.get("host")||request.nextUrl.hostname;
  const hostname=requestHost.split(":")[0].toLowerCase();

  const hasTrailingSlash=request.nextUrl.pathname.length>1&&request.nextUrl.pathname.endsWith("/");
  const normalizedPath=hasTrailingSlash?request.nextUrl.pathname.replace(/\/+$/,""):request.nextUrl.pathname;
  const canonicalPath=legacyRedirects[normalizedPath];

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
