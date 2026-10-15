"use client";
import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {nav} from "@/data/site";

export default function Header(){
  const [open,setOpen]=useState(false);
  return <header className="site-header">
    <div className="shell header-row">
      <Link href="/" className="logo-lockup" aria-label="NIS - Home" onClick={()=>setOpen(false)}>
        <Image src="/logo/nis-logo-square.png" width={150} height={150} alt="Nazionale Italiana Sanitari" sizes="(max-width: 720px) 128px, 150px"/>
      </Link>
      <nav className="desktop-nav" aria-label="Navigazione principale">{nav.map(n=><Link key={n.href} href={n.href}>{n.label}</Link>)}</nav>
      <span className="header-balance" aria-hidden="true"/>
      <button className="burger" type="button" aria-label={open?"Chiudi menu":"Apri menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(!open)}>
        <span/><span/><span/>
      </button>
    </div>
    {open&&<nav id="mobile-navigation" className="mobile-nav" aria-label="Navigazione mobile">{nav.map(n=><Link onClick={()=>setOpen(false)} key={n.href} href={n.href}>{n.label}</Link>)}</nav>}
  </header>
}
