import {GALA_SPONSOR_LABEL,NIS_PUBLIC_ORIGIN,galaSponsors} from "@/data/gala-sponsors";

const sponsorEscapeHtml=(value:string)=>value.replace(/[&<>"']/g,character=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[character]??character);

export function buildGalaSponsorEmailHtml(){
  const rows=Array.from({length:3},(_,row)=>`<tr>${galaSponsors.slice(row*3,row*3+3).map(sponsor=>`<td width="33.33%" height="64" align="center" valign="middle" style="padding:6px 8px"><img src="${NIS_PUBLIC_ORIGIN}${sponsor.image}" width="96" alt="${sponsorEscapeHtml(sponsor.name)}" style="display:block;width:96px;max-width:100%;height:auto;max-height:52px;margin:0 auto"></td>`).join("")}</tr>`).join("");
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;border-collapse:collapse;background:#f7f8fa"><tr><td colspan="3" align="center" style="padding:15px 12px 5px;color:#526b83;font-size:10px;font-weight:bold;letter-spacing:.12em">${GALA_SPONSOR_LABEL}</td></tr>${rows}</table>`;
}

export function galaSponsorEmailText(){return `${GALA_SPONSOR_LABEL}\n${galaSponsors.map(sponsor=>sponsor.name).join(" · ")}`;}
