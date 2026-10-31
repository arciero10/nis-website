import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import {findPublicEvent} from "@/lib/ticketing/public-events";

export const dynamic="force-dynamic";
export const revalidate=0;

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const event=await findPublicEvent(slug);if(!event)return {};const canonical=`https://www.nazionaleitalianasanitari.com/eventi/${event.slug}`;return {title:`${event.title} | Nazionale Italiana Sanitari`,description:event.description,alternates:{canonical},robots:event.visibility==="PUBLIC"?{index:true,follow:true}:{index:false,follow:false,noarchive:true},openGraph:{title:event.title,description:event.description,url:canonical,type:"website",images:event.coverImage?[{url:event.coverImage}]:undefined}};}

export default async function GenericEventPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const event=await findPublicEvent(slug);if(!event)notFound();const date=event.eventDate?new Intl.DateTimeFormat("it-IT",{dateStyle:"full",timeStyle:"short",timeZone:"Europe/Rome"}).format(new Date(event.eventDate)):"Data da definire";return <main className="public-event-page">{event.coverImage&&<Image src={event.coverImage} width={1600} height={900} alt={event.title} priority/>}<div className="container"><span>{event.eventType} · {event.status}</span><h1>{event.title}</h1><p>{event.description}</p><dl><div><dt>Quando</dt><dd>{date}</dd></div><div><dt>Dove</dt><dd>{event.location??"Da definire"}{event.address?` · ${event.address}`:""}</dd></div><div><dt>Accesso</dt><dd>{event.isFree?"Gratuito":event.price!==null?new Intl.NumberFormat("it-IT",{style:"currency",currency:event.currency}).format(event.price):"Da definire"}</dd></div></dl>{event.status==="OPEN"&&<Link className="btn btn-blue" href={`/eventi/${event.slug}/iscrizione`}>ISCRIVITI</Link>}</div></main>;}
