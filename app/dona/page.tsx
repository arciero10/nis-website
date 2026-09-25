import Image from "next/image";
import type {Metadata} from "next";
import PayPalDonationActions from "@/components/PayPalDonationActions";

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
      <PayPalDonationActions/>
      <p className="donation-note">Se l’app PayPal si apre sulla home, torna indietro e scegli “Apri nel browser”.</p>
      <section className="donation-help" aria-labelledby="donation-help-title">
        <h2 id="donation-help-title">Problemi con l’app PayPal?</h2>
        <p>Su alcuni iPhone l’app PayPal può aprirsi senza mostrare direttamente la raccolta. In questo caso copia il link e aprilo manualmente in Safari o Chrome.</p>
      </section>
    </div>
  </div>
</section>}
