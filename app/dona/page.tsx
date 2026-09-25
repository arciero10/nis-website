import Image from "next/image";
import type {Metadata} from "next";

const paypalUrl="https://www.paypal.com/fundraiser/charity/6169624";

export const metadata:Metadata={
  title:"Dona | Nazionale Italiana Sanitari",
  description:"Sostieni i progetti di salute, prevenzione, sport e solidarietà della Nazionale Italiana Sanitari.",
  alternates:{canonical:"/dona"},
};

export default function Page(){return <section className="donation-page">
  <div className="shell donation-layout">
    <div className="donation-brand" aria-hidden="true">
      <Image src="/logo/nis-logo-square.png" alt="" width={240} height={240} priority/>
    </div>
    <div className="donation-content">
      <div className="eyebrow white">DONA ORA</div>
      <h1>Sostieni la Nazionale Italiana Sanitari</h1>
      <p className="donation-intro">Il tuo contributo sostiene i progetti di salute, prevenzione, sport e solidarietà della Nazionale Italiana Sanitari.</p>
      <div className="donation-actions">
        <a className="btn btn-blue donation-paypal donation-paypal-desktop" href={paypalUrl} target="_blank" rel="noopener noreferrer">CONTINUA SU PAYPAL</a>
        <a className="btn btn-blue donation-paypal donation-paypal-mobile" href={paypalUrl} rel="noopener noreferrer">CONTINUA SU PAYPAL</a>
      </div>
      <p className="donation-note">Verrai indirizzato alla pagina ufficiale PayPal della Nazionale Italiana Sanitari.</p>
      <a className="donation-browser-link" href={paypalUrl} rel="noopener noreferrer">Se PayPal apre l’app senza mostrare la raccolta, continua dal browser</a>
    </div>
  </div>
</section>}
