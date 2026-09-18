import Link from "next/link";
export default function PageHero({eyebrow,title,accent,intro,image,children}:{eyebrow:string,title:string,accent?:string,intro:string,image:string,children?:React.ReactNode}){
 return <section className="page-hero">
  <div className="page-hero-bg" style={{backgroundImage:`linear-gradient(90deg,rgba(5,28,57,.98) 0%,rgba(5,28,57,.93) 37%,rgba(5,28,57,.15) 67%,rgba(5,28,57,.18) 100%),url('${image}')`}}/>
  <div className="shell hero-content">
    <div className="eyebrow white">{eyebrow}</div>
    <h1>{title} {accent&&<span>{accent}</span>}</h1>
    <p>{intro}</p>
    {children}
  </div>
  <div className="tricolor-swoosh"/>
 </section>
}
