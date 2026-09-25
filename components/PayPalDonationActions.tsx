"use client";

import {useState} from "react";

const paypalUrl="https://www.paypal.com/fundraiser/charity/6169624";

export default function PayPalDonationActions(){
  const [copyMessage,setCopyMessage]=useState("");

  async function copyPayPalLink(){
    try{
      await navigator.clipboard.writeText(paypalUrl);
      setCopyMessage("Link copiato. Incollalo in Safari o Chrome.");
    }catch{
      setCopyMessage("Copia non riuscita. Seleziona e copia il link PayPal dal browser.");
    }
  }

  return <>
    <div className="donation-actions">
      <a className="btn btn-blue donation-paypal donation-paypal-desktop" href={paypalUrl} target="_blank" rel="noopener noreferrer">APRI PAYPAL NEL BROWSER</a>
      <a className="btn btn-blue donation-paypal donation-paypal-mobile" href={paypalUrl} rel="noopener noreferrer">APRI PAYPAL NEL BROWSER</a>
      <button className="btn donation-copy" type="button" onClick={copyPayPalLink}>COPIA LINK PAYPAL</button>
    </div>
    <p className="donation-copy-status" role="status" aria-live="polite">{copyMessage}</p>
  </>;
}
