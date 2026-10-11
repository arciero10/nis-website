import "server-only";

const publicOrigin="https://www.nazionaleitalianasanitari.com";
const appleKeys=["APPLE_WALLET_PASS_TYPE_ID","APPLE_WALLET_TEAM_ID","APPLE_WALLET_CERTIFICATE_BASE64","APPLE_WALLET_CERTIFICATE_PASSWORD","APPLE_WALLET_WWDR_CERTIFICATE_BASE64"] as const;
const googleKeys=["GOOGLE_WALLET_ISSUER_ID","GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL","GOOGLE_WALLET_PRIVATE_KEY","GOOGLE_WALLET_CLASS_ID"] as const;

type Environment=Record<string,string|undefined>;

function hasValues(environment:Environment,keys:readonly string[]){return keys.every(key=>Boolean(environment[key]?.trim()));}

export function isAppleWalletConfigured(environment:Environment=process.env){return hasValues(environment,appleKeys);}
export function isGoogleWalletConfigured(environment:Environment=process.env){return hasValues(environment,googleKeys);}

export function walletLinksForToken(qrToken:string,environment:Environment=process.env){
  const encoded=encodeURIComponent(qrToken);
  return {
    apple:isAppleWalletConfigured(environment)?`${publicOrigin}/api/ticketing/wallet/apple/${encoded}`:null,
    google:isGoogleWalletConfigured(environment)?`${publicOrigin}/api/ticketing/wallet/google/${encoded}`:null,
  };
}

export function requireAppleWalletConfiguration(environment:Environment=process.env){
  if(!isAppleWalletConfigured(environment))throw new Error("Apple Wallet non configurato");
  return {
    passTypeIdentifier:environment.APPLE_WALLET_PASS_TYPE_ID!,
    teamIdentifier:environment.APPLE_WALLET_TEAM_ID!,
    certificateBase64:environment.APPLE_WALLET_CERTIFICATE_BASE64!,
    certificatePassword:environment.APPLE_WALLET_CERTIFICATE_PASSWORD!,
    wwdrCertificateBase64:environment.APPLE_WALLET_WWDR_CERTIFICATE_BASE64!,
  };
}

export function requireGoogleWalletConfiguration(environment:Environment=process.env){
  if(!isGoogleWalletConfigured(environment))throw new Error("Google Wallet non configurato");
  return {
    issuerId:environment.GOOGLE_WALLET_ISSUER_ID!,
    serviceAccountEmail:environment.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL!,
    privateKey:environment.GOOGLE_WALLET_PRIVATE_KEY!.replace(/\\n/g,"\n"),
    classId:environment.GOOGLE_WALLET_CLASS_ID!,
  };
}
