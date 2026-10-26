"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
import type {StaffRole} from "@/lib/ticketing/checkin-rules";

const operationalLinks=[
  {href:"/checkin",label:"Scanner"},
  {href:"/staff/partecipanti",label:"Partecipanti"},
  {href:"/staff/ingressi",label:"Ingressi"},
];
const administrativeLinks=[
  {href:"/staff/partner",label:"Aziende"},
  {href:"/staff/emissione",label:"Emissione"},
];

export default function StaffNavigation({role="SUPERADMIN"}:{role?:StaffRole}){
  const pathname=usePathname();
  const [loggingOut,setLoggingOut]=useState(false);
  const links=role==="SUPERADMIN"?[...operationalLinks.slice(0,2),...administrativeLinks,operationalLinks[2]]:operationalLinks;

  async function logout(){
    setLoggingOut(true);
    try{await fetch("/api/ticketing/checkin/session",{method:"DELETE"});}
    finally{window.location.assign("/checkin");}
  }

  return <nav className={`staff-navigation ${role==="STAFF"?"is-staff":"is-superadmin"}`} aria-label="Navigazione staff">
    {links.map(link=><Link key={link.href} href={link.href} aria-current={pathname===link.href?"page":undefined}>{link.label}</Link>)}
    <button type="button" onClick={logout} disabled={loggingOut}>{loggingOut?"Uscita...":"Esci"}</button>
  </nav>;
}
