import Image from "next/image";
import Link from "next/link";
import {galaPromotion} from "@/data/gala-promotion";

export default function GalaHomeBanner(){
  if(!galaPromotion.enabled)return null;
  return <section className="gala-home-banner" aria-labelledby="gala-home-title">
    <div className="shell gala-home-banner-inner">
      <div className="gala-home-banner-artwork">
        <Image src={galaPromotion.artwork} alt="The NIS Gala Charity Night" fill sizes="(max-width: 720px) calc(100vw - 40px), 48vw"/>
      </div>
      <div className="gala-home-banner-copy">
        <p className="gala-kicker">28 OTTOBRE 2026 · ROMA</p>
        <h2 id="gala-home-title">THE NIS GALA<span>CHARITY NIGHT</span></h2>
        <p>{galaPromotion.description}</p>
        <Link href={galaPromotion.checkoutPath} className="btn gala-primary-cta">SCOPRI L&apos;EVENTO</Link>
      </div>
    </div>
  </section>;
}

