"use client";

import Script from "next/script";
import {usePathname,useSearchParams} from "next/navigation";
import {useEffect,useRef,useState} from "react";

export const GA_MEASUREMENT_ID="G-75QQ9VW74N";

declare global{
  interface Window{
    dataLayer:IArguments[];
    gtag:(...args:unknown[])=>void;
  }
}

export function initializeConsentMode(){
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};
  window.gtag("consent","default",{
    analytics_storage:"denied",
    ad_storage:"denied",
    ad_user_data:"denied",
    ad_personalization:"denied",
  });
}

export function updateAnalyticsConsent(granted:boolean){
  window.gtag?.("consent","update",{
    analytics_storage:granted?"granted":"denied",
    ad_storage:"denied",
    ad_user_data:"denied",
    ad_personalization:"denied",
  });
}

export default function GoogleAnalytics(){
  const pathname=usePathname();
  const searchParams=useSearchParams();
  const query=searchParams.toString();
  const [loaded,setLoaded]=useState(false);
  const lastTrackedUrl=useRef("");

  useEffect(()=>{
    if(!loaded||!window.gtag) return;
    const pagePath=query?`${pathname}?${query}`:pathname;
    if(lastTrackedUrl.current===pagePath) return;
    lastTrackedUrl.current=pagePath;
    window.gtag("event","page_view",{
      send_to:GA_MEASUREMENT_ID,
      page_title:document.title,
      page_location:window.location.href,
      page_path:pagePath,
    });
  },[loaded,pathname,query]);

  return <Script
    id="nis-ga4"
    src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
    strategy="afterInteractive"
    onLoad={()=>{
      window.gtag("config",GA_MEASUREMENT_ID,{
        send_page_view:false,
        allow_google_signals:false,
        allow_ad_personalization_signals:false,
      });
      setLoaded(true);
    }}
  />;
}
