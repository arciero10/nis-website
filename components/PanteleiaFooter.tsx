import {panteleiaFooter} from "@/data/panteleia";

export default function PanteleiaFooter({compact=false}:{compact?:boolean}){
  return <div className={`panteleia-footer${compact?" panteleia-footer-compact":""}`}>
    <span className="panteleia-footer-powered">{panteleiaFooter.poweredBy}</span>
    <strong>{panteleiaFooter.name}</strong>
    <span className="panteleia-footer-subtitle">{panteleiaFooter.subtitle}</span>
    <div className="panteleia-footer-separator" aria-hidden="true"/>
    <div className="panteleia-footer-legal">
      <span>{panteleiaFooter.copyright}</span>
      <span>{panteleiaFooter.legalLine}</span>
      <span>{panteleiaFooter.fiscalCode}</span>
      <span>{panteleiaFooter.runts}</span>
    </div>
  </div>;
}
