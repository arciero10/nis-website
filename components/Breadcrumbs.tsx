import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import {createBreadcrumbJsonLd,type BreadcrumbItem} from "@/lib/seo";

export default function Breadcrumbs({items,className=""}:{items:BreadcrumbItem[];className?:string}){
  return <>
    <StructuredData data={createBreadcrumbJsonLd(items)}/>
    <nav className={`breadcrumbs${className?` ${className}`:""}`} aria-label="Percorso di navigazione">
      <ol>{items.map((item,index)=><li key={item.path}>
        {index<items.length-1?<Link href={item.path}>{item.name}</Link>:<span aria-current="page">{item.name}</span>}
      </li>)}</ol>
    </nav>
  </>;
}
