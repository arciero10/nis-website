"use client";

import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
import Icon from "@/components/Icon";
import {resolveLegacyAdminPath} from "@/lib/admin-routing";
import type {StaffRole} from "@/lib/ticketing/checkin-rules";

const superadminLinks=[
  {href:"/admin/dashboard",label:"Dashboard",icon:"dashboard"},
  {href:"/admin/eventi",label:"Eventi",icon:"calendar"},
  {href:"/admin/partecipanti",label:"Partecipanti",icon:"people"},
  {href:"/admin/biglietti",label:"Biglietti",icon:"ticket"},
  {href:"/admin/checkin",label:"Check-in",icon:"scan"},
  {href:"/admin/aziende",label:"Aziende",icon:"handshake"},
  {href:"/admin/report",label:"Report",icon:"chart"},
  {href:"/admin/ordini-nissettone",label:"Ordini NISSETTONE",icon:"box"},
];
const staffLinks=[
  {href:"/admin/dashboard",label:"Dashboard",icon:"dashboard"},
  {href:"/admin/checkin",label:"Check-in",icon:"scan"},
  {href:"/admin/cerca",label:"Cerca partecipanti",icon:"search"},
  {href:"/admin/partecipanti",label:"Partecipanti",icon:"people"},
  {href:"/admin/ingressi",label:"Ingressi",icon:"door"},
];

export default function StaffNavigation({role="SUPERADMIN",selectedEventTitle}:{role?:StaffRole;selectedEventTitle?:string|null}){
  const pathname=usePathname();
  const [loggingOut,setLoggingOut]=useState(false);
  const [open,setOpen]=useState(false);
  const links=role==="SUPERADMIN"?superadminLinks:staffLinks;
  const navigationPath=resolveLegacyAdminPath(pathname)??pathname;
  const current=(href:string)=>{const path=href.split("#")[0];return navigationPath===path||navigationPath.startsWith(`${path}/`);};
  const activeLabel=links.find(link=>current(link.href))?.label??"Dashboard";

  async function logout(){
    setLoggingOut(true);
    try{await fetch("/api/ticketing/checkin/session",{method:"DELETE"});}
    finally{window.location.assign("/admin");}
  }

  return <>
    <button className="staff-sidebar-toggle" type="button" aria-label="Apri navigazione" aria-expanded={open} aria-controls="staff-sidebar" onClick={()=>setOpen(true)}><span aria-hidden="true">☰</span><strong>Menu</strong></button>
    {open&&<button className="staff-sidebar-backdrop" type="button" aria-label="Chiudi navigazione staff" onClick={()=>setOpen(false)}/>}
    <aside id="staff-sidebar" className={`staff-navigation staff-sidebar ${role==="STAFF"?"is-staff":"is-superadmin"} ${open?"is-open":""}`} aria-label="Navigazione NIS Management">
      <div className="staff-sidebar-brand"><Image src="/logo/nis-logo-square.png" width={58} height={58} alt="Nazionale Italiana Sanitari"/><div><strong>NIS</strong><span>Management</span></div><button type="button" aria-label="Chiudi navigazione staff" onClick={()=>setOpen(false)}>×</button></div>
      <nav className="staff-sidebar-links" aria-label="Sezioni gestionali">{links.map(link=><Link key={link.href} href={link.href} aria-current={current(link.href)?"page":undefined} onClick={()=>setOpen(false)}><Icon name={link.icon} size={19}/><span>{link.label}</span></Link>)}</nav>
      <div className="staff-sidebar-divider"/>
      <section className="staff-sidebar-event" aria-label="Evento selezionato"><span>Evento selezionato</span><strong>{selectedEventTitle||"Selezione corrente"}</strong></section>
      <div className="staff-sidebar-account"><div><span>Profilo attivo</span><strong>{role==="SUPERADMIN"?"Superadmin":"Staff operativo"}</strong></div></div>
    </aside>
    <header className="management-topbar"><div><span>NIS MANAGEMENT</span><strong>{activeLabel}</strong></div><div className="management-topbar-account"><span>{role==="SUPERADMIN"?"Superadmin":"Staff operativo"}</span><button type="button" onClick={logout} disabled={loggingOut}><Icon name="logout" size={17}/><span>{loggingOut?"Uscita...":"Esci"}</span></button></div></header>
  </>;
}
