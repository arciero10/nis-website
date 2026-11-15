export default function Icon({name,size=32}:{name:string,size?:number}){
  const c={width:size,height:size,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round" as const,strokeLinejoin:"round" as const};
  const paths:Record<string,React.ReactNode>={
    heart:<><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></>,
    people:<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    run:<><circle cx="14" cy="4" r="2"/><path d="m10 22 2-6 2 2 4 4M6 12l3-3 3 2 3 1 2-2M12 16l-3-2-3 6"/></>,
    ball:<><circle cx="12" cy="12" r="9"/><path d="m9 9 3-2 3 2-1 4h-4zM4 10l4 1M16 11l4-1M8 18l2-5M16 18l-2-5"/></>,
    tennis:<><circle cx="9" cy="9" r="6"/><path d="m13.5 13.5 6 6M4.8 4.8c3 3 5.2 5.2 8.4 8.4M13.2 4.8 4.8 13.2"/></>,
    padel:<><path d="M8 3h8l2 5-2 8-4 4-4-4-2-8zM12 20v2"/><circle cx="10" cy="8" r=".5" fill="currentColor"/><circle cx="14" cy="8" r=".5" fill="currentColor"/><circle cx="12" cy="11" r=".5" fill="currentColor"/></>,
    golf:<><path d="M6 22V3l10 3-10 3M3 22h8"/><path d="M15 18c3 0 5 .8 5 2s-2 2-5 2"/></>,
    calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/><path d="m9 15 2 2 4-4"/></>,
    education:<><path d="m2 9 10-5 10 5-10 5zM6 11.5V16c3 2 9 2 12 0v-4.5M22 9v7"/></>,
    shield:<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></>,
    document:<><path d="M6 2h9l5 5v15H6zM14 2v6h6M9 13h6M9 17h6"/></>,
    handshake:<><path d="m8 12 3 3c1 1 2.5 1 3.5 0l5-5M3 7l4-3 4 4-5 5M21 7l-4-3-4 4 5 5"/></>,
    mail:<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    pin:<><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/></>,
    euro:<><path d="M18 7a7 7 0 1 0 0 10M4 10h10M4 14h9"/></>,
    project:<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v16M8 10h13M14 10v10"/></>,
    room:<><path d="M4 21V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v17M2 21h20"/><path d="M13 12h.01"/></>,
    medical:<><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/><path d="M5 12h3l1.5-3 3 6 1.5-3h5"/></>,
    dashboard:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    ticket:<><path d="M3 7a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-3a2 2 0 0 0 0-4Z"/><path d="M13 5v2M13 11v2M13 17v2"/></>,
    scan:<><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10"/></>,
    chart:<><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
    box:<><path d="m3 6 9-4 9 4-9 4Z"/><path d="m3 6 9 4 9-4v12l-9 4-9-4Z"/><path d="M12 10v12"/></>,
    search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    door:<><path d="M4 21h16M6 21V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17M14 12h.01"/></>,
    logout:<><path d="M10 17l5-5-5-5M15 12H3M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></>,
  };
  return <svg {...c}>{paths[name]||paths.heart}</svg>
}
