import Icon from "./Icon";
export default function FundraisingCard(){return <aside className="fund-card">
 <div className="eyebrow">RACCOLTA FONDI</div>
 <div className="fund-amount">€ 50.000</div>
 <strong>OBIETTIVO: € 50.000</strong>
 <div className="progress"><i style={{width:"100%"}}/><b>100%</b></div>
 <div className="fund-success"><Icon name="people" size={34}/><span><strong>INSIEME CE L&apos;ABBIAMO FATTA!</strong><br/>Grazie a tutti voi.</span><Icon name="heart" size={34}/></div>
 </aside>}
