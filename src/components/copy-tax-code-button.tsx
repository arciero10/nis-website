"use client";

import { useState } from "react";

type CopyTaxCodeButtonProps = {
  taxCode: string;
};

export function CopyTaxCodeButton({ taxCode }: CopyTaxCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(taxCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-slate-800"
    >
      {copied ? "Codice copiato" : "Copia codice fiscale"}
    </button>
  );
}
