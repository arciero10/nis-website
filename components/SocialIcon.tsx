export default function SocialIcon({name}:{name:string}){
  const common={className:"social-icon",width:20,height:20,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.9,strokeLinecap:"round" as const,strokeLinejoin:"round" as const,"aria-hidden":true};

  if(name==="Instagram") return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>;
  if(name==="Facebook") return <svg {...common} fill="currentColor" stroke="none"><path d="M14.1 8.3h3.1l.5-3.3h-3.6c-3.5 0-5.3 2-5.3 5.6v2.1H6v3.2h2.8V22h3.8v-6.1h3.4l.5-3.2h-3.9v-1.8c0-1.8.5-2.6 1.5-2.6Z"/></svg>;
  if(name==="X") return <svg {...common} fill="currentColor" stroke="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.967 6.817H1.68l7.73-8.835L1.254 2.25h6.826l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>;
  if(name==="TikTok") return <svg {...common}><path d="M14 3v11.2a4.4 4.4 0 1 1-3.7-4.3"/><path d="M14 3c.5 3 2.2 4.7 5 5"/></svg>;
  return <svg {...common}><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none"/></svg>;
}
