import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";

const apexHost="nazionaleitalianasanitari.com";
const canonicalHost="www.nazionaleitalianasanitari.com";

export function middleware(request:NextRequest){
  const forwardedHost=request.headers.get("x-forwarded-host")?.split(",")[0].trim();
  const requestHost=forwardedHost||request.headers.get("host")||request.nextUrl.hostname;
  const hostname=requestHost.split(":")[0].toLowerCase();

  if(hostname!==apexHost){
    return NextResponse.next();
  }

  const destination=request.nextUrl.clone();
  destination.protocol="https:";
  destination.hostname=canonicalHost;
  destination.port="";

  return NextResponse.redirect(destination,301);
}

export const config={matcher:"/:path*"};
