import type {Metadata} from "next";
import Link from "next/link";

export const metadata:Metadata={robots:{index:false,follow:false}};

export default function NotFound(){return <section className="section" style={{paddingTop:150}}><div className="shell"><h1>Pagina non trovata</h1><p>La pagina richiesta non esiste o non è più disponibile.</p><Link className="btn btn-blue" href="/">TORNA ALLA HOME</Link></div></section>}
