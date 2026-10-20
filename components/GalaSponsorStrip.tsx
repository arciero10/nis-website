import Image from "next/image";
import {GALA_SPONSOR_LABEL,galaSponsors} from "@/data/gala-sponsors";

export default function GalaSponsorStrip({compact=false,className=""}:{compact?:boolean;className?:string}){
  return <section className={`gala-sponsors${compact?" is-compact":""}${className?` ${className}`:""}`} aria-label="Sponsor ufficiali NIS Gala 2026">
    <p>{GALA_SPONSOR_LABEL}</p>
    <div className="gala-sponsors-grid">
      {galaSponsors.map(sponsor=><div className={`gala-sponsor-logo ${sponsor.className}`} key={sponsor.id}>
        <Image src={sponsor.image} width={sponsor.width} height={sponsor.height} sizes={compact?"(max-width: 620px) 34vw, 110px":"(max-width: 620px) 38vw, 180px"} alt={sponsor.name}/>
      </div>)}
    </div>
  </section>;
}
