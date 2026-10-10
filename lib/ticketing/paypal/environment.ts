export type PayPalEnvironmentName="sandbox"|"live";
export type PayPalProviderEnvironment="SANDBOX"|"LIVE";

const PAYPAL_API_BASES={
  sandbox:"https://api-m.sandbox.paypal.com",
  live:"https://api-m.paypal.com",
} as const;

export function resolvePayPalEnvironment(value:string|undefined){
  const environment=value?.trim();
  if(environment!=="sandbox"&&environment!=="live"){
    throw new Error("PAYPAL_ENV non valido: usare esclusivamente sandbox oppure live.");
  }
  return {
    environment,
    providerEnvironment:(environment==="sandbox"?"SANDBOX":"LIVE") as PayPalProviderEnvironment,
    base:PAYPAL_API_BASES[environment],
  };
}
