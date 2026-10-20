import {GALA_SPONSOR_LABEL,NIS_PUBLIC_ORIGIN,galaSponsors} from "@/data/gala-sponsors";

const sponsorEscapeHtml=(value:string)=>value.replace(/[&<>"']/g,character=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[character]??character);

export function buildGalaSponsorEmailHtml(){
  const cells=galaSponsors.map(sponsor=>`<td width="25%" align="center" valign="middle" style="padding:8px 6px"><img src="${NIS_PUBLIC_ORIGIN}${sponsor.image}" width="112" alt="${sponsorEscapeHtml(sponsor.name)}" style="display:block;width:100%;max-width:112px;height:52px;object-fit:contain;margin:0 auto"></td>`).join("");
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;border-collapse:collapse;background:#f7f8fa"><tr><td colspan="4" align="center" style="padding:15px 12px 3px;color:#526b83;font-size:10px;font-weight:bold;letter-spacing:.12em">${GALA_SPONSOR_LABEL}</td></tr><tr>${cells}</tr></table>`;
}

export function galaSponsorEmailText(){return `${GALA_SPONSOR_LABEL}\n${galaSponsors.map(sponsor=>sponsor.name).join(" · ")}`;}
