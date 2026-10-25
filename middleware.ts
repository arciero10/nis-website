import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import {resolveLegacySeoPath} from "@/lib/legacy-seo";

const apexHost="nazionaleitalianasanitari.com";
const canonicalHost="www.nazionaleitalianasanitari.com";

export function middleware(request:NextRequest){
  const forwardedHost=request.headers.get("x-forwarded-host")?.split(",")[0].trim();
  const requestHost=forwardedHost||request.headers.get("host")||request.nextUrl.hostname;
  const hostname=requestHost.split(":")[0].toLowerCase();

  const {normalizedPath,hasTrailingSlash,redirectTo:canonicalPath,gone,preserveNotFound}=resolveLegacySeoPath(request.nextUrl.pathname);

  if(gone){
    return new NextResponse(null,{
      status:410,
      headers:{"X-Robots-Tag":"noindex, nofollow, noarchive"},
    });
  }

  if(preserveNotFound&&hostname!==apexHost){
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
