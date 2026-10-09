import Breadcrumbs from "@/components/Breadcrumbs";
import type {BreadcrumbItem} from "@/lib/seo";

export default function PageHero({eyebrow,title,accent,intro,image,path,parents=[],children}:{eyebrow:string;title:string;accent?:string;intro:string;image:string;path?:string;parents?:BreadcrumbItem[];children?:React.ReactNode}){
 return <section className="page-hero">
  <div className="page-hero-bg" style={{backgroundImage:`linear-gradient(90deg,rgba(5,28,57,.98) 0%,rgba(5,28,57,.93) 37%,rgba(5,28,57,.15) 67%,rgba(5,28,57,.18) 100%),url('${image}')`}}/>
  <div className="shell hero-content">
    {path&&<Breadcrumbs items={[{name:"Home",path:"/"},...parents,{name:eyebrow,path}]} className="breadcrumbs-on-dark"/>}
    <div className="eyebrow white">{eyebrow}</div>
    <h1>{title} {accent&&<span>{accent}</span>}</h1>
    <p>{intro}</p>
    {children}
  </div>
  <div className="tricolor-swoosh"/>
 </section>
}
