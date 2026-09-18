import Link from "next/link";
import Icon from "./Icon";
import {sectors} from "@/data/site";
export default function SectorGrid(){return <div className="sector-grid">
 {sectors.map((s,i)=><Link href={`/settori/${s.slug}`} className={`sector-card c${i}`} key={s.slug}><Icon name={s.icon} size={44}/><strong>{s.title.toUpperCase()}</strong><p>{s.text}</p><span className="circle-arrow">›</span></Link>)}
</div>}
