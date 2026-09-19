import Link from "next/link";
import {site, socialLinks} from "@/data/site";
import SocialIcon from "./SocialIcon";
import CookieSettings from "./CookieSettings";

const quickLinks = [
  {label:"Home",href:"/"},
  {label:"Chi siamo",href:"/chi-siamo"},
  {label:"Progetti",href:"/progetti"},
  {label:"Eventi",href:"/eventi"},
  {label:"5x1000",href:"/5x1000"},
  {label:"Diventa Socio",href:"/be-nis-be-nice"},
  {label:"Contatti",href:"/contatti"},
];

export default function Footer(){return <footer className="footer">
  <div className="shell footer-grid">
    <div className="footer-column"><h2>Link rapidi</h2>{quickLinks.map(link=><Link key={link.href} href={link.href}>{link.label}</Link>)}</div>
    <div className="footer-column"><h2>Contatti</h2><a href={`mailto:${site.email}`}>{site.email}</a><a href={`mailto:${site.pressEmail}`}>{site.pressEmail}</a></div>
    <div className="footer-column"><h2>Informazioni</h2><Link href="/privacy-policy">Privacy Policy</Link><Link href="/cookie-policy">Cookie Policy</Link><Link href="/trasparenza">Trasparenza</Link><CookieSettings/></div>
    <div className="footer-column footer-social"><h2>Seguici</h2><div className="social-links">{socialLinks.map(link=><a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}><SocialIcon name={link.label}/><span>{link.label}</span></a>)}</div></div>
  </div>
  <div className="shell footer-bottom">
    <p>© All rights reserved. Sito realizzato da PANTELEIA - Associazione Promozione Sociale. CF: 96647400587</p>
    <p>Iscrizione RUNTS: Rep. n. 165890 – Det. n. G03684 del 19/03/2026.</p>
  </div>
</footer>}
