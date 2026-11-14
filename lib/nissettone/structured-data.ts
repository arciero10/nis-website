import type {NissettoneProduct} from "@/lib/nissettone/repository";
import {SITE_URL} from "@/lib/seo";

const productUrl=`${SITE_URL}/nissettone`;
const productDescription="Il panettone da 1 kg al cioccolato che sostiene i progetti benefici della Nazionale Italiana Sanitari.";
const productImages=[
  `${SITE_URL}/images/nissettone/nissettone-3.jpeg`,
  `${SITE_URL}/images/nissettone/nissettone-01.jpeg`,
  `${SITE_URL}/images/nissettone/nissettone-2.jpeg`,
];

export function createNissettoneProductJsonLd(product:NissettoneProduct,commerceConfigured:boolean){
  const hasPublicOffer=commerceConfigured&&(product.status==="ACTIVE"||product.status==="SOLD_OUT");
  if(!hasPublicOffer)return null;

  const soldOut=product.status==="SOLD_OUT"||product.available<=0;
  return {
    "@context":"https://schema.org",
    "@type":"Product",
    "@id":`${productUrl}#product`,
    name:"NISSETTONE 2026",
    description:productDescription,
    image:productImages,
    brand:{"@type":"Brand",name:"NISSETTONE"},
    offers:{
      "@type":"Offer",
      url:productUrl,
      price:(product.unitPriceCents/100).toFixed(2),
      priceCurrency:product.currency,
      itemCondition:"https://schema.org/NewCondition",
      availability:soldOut?"https://schema.org/SoldOut":"https://schema.org/InStock",
    },
  };
}
