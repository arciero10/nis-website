"use client";

import {useState} from "react";

const TAX_CODE = "18254491006";

export default function CopyTaxCode(){
  const [copied,setCopied]=useState(false);

  async function copyCode(){
    await navigator.clipboard.writeText(TAX_CODE);
    setCopied(true);
    window.setTimeout(()=>setCopied(false),2000);
  }

  return <div className="tax-code-card">
    <span>Codice fiscale NIS</span>
    <code>{TAX_CODE}</code>
    <button type="button" onClick={copyCode} aria-live="polite">
      {copied?"Codice copiato":"Copia il codice"}
    </button>
  </div>;
}
