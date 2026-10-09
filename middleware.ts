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
};

export function middleware(request:NextRequest){
  const forwardedHost=request.headers.get("x-forwarded-host")?.split(",")[0].trim();
  const requestHost=forwardedHost||request.headers.get("host")||request.nextUrl.hostname;
  const hostname=requestHost.split(":")[0].toLowerCase();

  const normalizedPath=request.nextUrl.pathname.length>1?request.nextUrl.pathname.replace(/\/+$/,""):request.nextUrl.pathname;
  const canonicalPath=legacyRedirects[normalizedPath];

  if(hostname!==apexHost&&!canonicalPath){
    return NextResponse.next();
  }

  const destination=request.nextUrl.clone();
  destination.protocol="https:";
  if(hostname===apexHost||canonicalPath)destination.hostname=canonicalHost;
  destination.port="";
  if(canonicalPath)destination.pathname=canonicalPath;

  return NextResponse.redirect(destination,301);
}

export const config={matcher:"/:path*"};
