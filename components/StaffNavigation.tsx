"use client";

import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
import type {StaffRole} from "@/lib/ticketing/checkin-rules";

const superadminLinks=[
  {href:"/staff",label:"Dashboard"},
  {href:"/staff/eventi",label:"Eventi"},
  {href:"/staff/partecipanti",label:"Partecipanti"},
  {href:"/staff/emissione",label:"Biglietti"},
  {href:"/checkin",label:"Check-in"},
  {href:"/staff/partner",label:"Aziende"},
  {href:"/staff/partecipanti#report",label:"Report"},
];
const staffLinks=[
  {href:"/checkin",label:"Check-in"},
  {href:"/staff/partecipanti",label:"Partecipanti"},
  {href:"/staff/ingressi",label:"Ingressi"},
];

export default function StaffNavigation({role="SUPERADMIN",selectedEventTitle}:{role?:StaffRole;selectedEventTitle?:string|null}){
  const pathname=usePathname();
  const [loggingOut,setLoggingOut]=useState(false);
  const [open,setOpen]=useState(false);
  const links=role==="SUPERADMIN"?superadminLinks:staffLinks;
  const current=(href:string)=>{const path=href.split("#")[0];return path==="/staff"?pathname===path:pathname===path||pathname.startsWith(`${path}/`);};

  async function logout(){
    setLoggingOut(true);
    try{await fetch("/api/ticketing/checkin/session",{method:"DELETE"});}
    finally{window.location.assign("/checkin");}
  }

  return <>
    <button className="staff-sidebar-toggle" type="button" aria-label="Apri navigazione staff" aria-expanded={open} aria-controls="staff-sidebar" onClick={()=>setOpen(true)}><span aria-hidden="true">☰</span><strong>Menu</strong></button>
    {open&&<button className="staff-sidebar-backdrop" type="button" aria-label="Chiudi navigazione staff" onClick={()=>setOpen(false)}/>}
    <aside id="staff-sidebar" className={`staff-navigation staff-sidebar ${role==="STAFF"?"is-staff":"is-superadmin"} ${open?"is-open":""}`} aria-label="Navigazione staff">
      <div className="staff-sidebar-brand"><Image src="/logo/nis-logo-square.png" width={58} height={58} alt="Nazionale Italiana Sanitari"/><div><strong>NIS</strong><span>Event Management</span></div><button type="button" aria-label="Chiudi navigazione staff" onClick={()=>setOpen(false)}>×</button></div>
      <nav className="staff-sidebar-links" aria-label="Sezioni backoffice">{links.map(link=><Link key={`${link.href}-${link.label}`} href={link.href} aria-current={current(link.href)?"page":undefined} onClick={()=>setOpen(false)}>{link.label}</Link>)}</nav>
      <div className="staff-sidebar-divider"/>
      <section className="staff-sidebar-event" aria-label="Evento selezionato"><span>Evento selezionato</span><strong>{selectedEventTitle||"Selezione corrente"}</strong></section>
      <div className="staff-sidebar-account"><div><span>Account</span><strong>{role==="SUPERADMIN"?"Superadmin":"Staff operativo"}</strong></div><button type="button" onClick={logout} disabled={loggingOut}>{loggingOut?"Uscita...":"Esci"}</button></div>
    </aside>
  </>;
}
