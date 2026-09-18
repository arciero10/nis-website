import {impactMetrics} from "@/data/site";
import Icon from "./Icon";
export default function MetricStrip(){return <section className="impact-section" aria-labelledby="impact-title">
  <div className="shell">
    <div className="impact-heading"><span>Il nostro impatto</span><strong id="impact-title">Il 1° Battito, in numeri</strong></div>
    <div className="metrics-strip">
      {impactMetrics.map(m=><div className="metric" key={m.label}><Icon name={m.icon} size={38}/><div><strong>{m.value}</strong><span>{m.label}</span></div></div>)}
    </div>
  </div>
</section>}
