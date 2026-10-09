"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";

const links=[
  {href:"/checkin",label:"Scanner"},
  {href:"/staff/cerca",label:"Cerca ticket"},
  {href:"/staff/ingressi",label:"Ingressi"},
];

export default function StaffNavigation(){
  const pathname=usePathname();
  const [loggingOut,setLoggingOut]=useState(false);

  async function logout(){
    setLoggingOut(true);
    try{await fetch("/api/ticketing/checkin/session",{method:"DELETE"});}
    finally{window.location.assign("/checkin");}
  }

  return <nav className="staff-navigation" aria-label="Navigazione staff">
    {links.map(link=><Link key={link.href} href={link.href} aria-current={pathname===link.href?"page":undefined}>{link.label}</Link>)}
    <button type="button" onClick={logout} disabled={loggingOut}>{loggingOut?"Uscita...":"Esci"}</button>
  </nav>;
}
