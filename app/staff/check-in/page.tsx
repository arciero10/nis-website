import type {Metadata} from "next";
import CheckInPanel from "@/components/CheckInPanel";

export const metadata:Metadata={
  title:"Check-in eventi | NIS Staff",
  description:"Console operativa per il check-in degli eventi NIS.",
  robots:{index:false,follow:false},
};

export default function StaffCheckInPage(){
  return <>
    <header className="ticketing-page-head ticketing-staff-head">
      <div className="shell">
        <div className="eyebrow white">AREA STAFF · BASE OPERATIVA</div>
        <h1>Check-in eventi</h1>
        <p>Inserimento manuale del codice e predisposizione per la futura scansione QR.</p>
      </div>
    </header>
    <section className="checkin-section">
      <div className="shell checkin-layout">
        <div className="checkin-intro">
          <span>EVENTO</span>
          <h2>{"NIS Gala Charity Night"}</h2>
          <p>Questa console è una base di interfaccia. Autenticazione staff, database e validazione effettiva dei ticket saranno collegati nei prossimi blocchi.</p>
        </div>
        <CheckInPanel/>
      </div>
    </section>
  </>;
}
