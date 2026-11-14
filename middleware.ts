import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import {resolveLegacySeoPath} from "@/lib/legacy-seo";

const apexHost="nazionaleitalianasanitari.com";
const canonicalHost="www.nazionaleitalianasanitari.com";

export function middleware(request:NextRequest){
  const forwardedHost=request.headers.get("x-forwarded-host")?.split(",")[0].trim();
  const forwardedProtocol=request.headers.get("x-forwarded-proto")?.split(",")[0].trim().toLowerCase();
  const requestHost=forwardedHost||request.headers.get("host")||request.nextUrl.hostname;
  const hostname=requestHost.split(":")[0].toLowerCase();
  const protocol=forwardedProtocol?`${forwardedProtocol}:`:request.nextUrl.protocol;
  const publicHost=hostname===apexHost||hostname===canonicalHost;

  const {normalizedPath,hasTrailingSlash,gone}=resolveLegacySeoPath(request.nextUrl.pathname);

  if(gone){
    return new NextResponse(null,{
      status:410,
      headers:{"X-Robots-Tag":"noindex, nofollow, noarchive"},
    });
  }

  if(hostname!==apexHost&&(!publicHost||protocol==="https:")&&!hasTrailingSlash){
    return NextResponse.next();
  }

  const destinationHost=hostname===apexHost?canonicalHost:requestHost;
  const destinationProtocol=publicHost?"https:":protocol;
  const destination=new URL(
    `${normalizedPath}${request.nextUrl.search}`,
    `${destinationProtocol}//${destinationHost}`,
  );

  return NextResponse.redirect(destination,301);
}

export const config={matcher:"/:path*"};
