# NIS — Sito definitivo Next.js / React

Pacchetto di handoff per lo sviluppatore della Nazionale Italiana Sanitari.

## Avvio
```bash
npm install
npm run dev
```

## Stack
- Next.js App Router
- React
- TypeScript
- CSS globale senza framework UI
- next/image
- nessuna dipendenza UI esterna

## Rotte
- /
- /chi-siamo
- /progetti
- /progetti/il-1-battito
- /progetti/spirito-nis
- /progetti/prevenzione
- /settori
- /settori/[slug]
- /eventi
- /news
- /sostienici
- /dona
- /be-nis-be-nice
- /partner
- /trasparenza
- /contatti

## Importante
I mockup approvati sono dentro `public/reference/`. Sono il riferimento visivo prioritario.
Alcune fotografie utilizzate nel frontend sono crop ricavati dai mockup approvati e vanno considerate **asset di prototipo**: per produzione sostituire con fotografie/licenze definitive mantenendo composizione e trattamento.

I dati racchiusi in `[DA COMPLETARE]` non devono essere inventati.

## Invio email con Microsoft Graph

Le email dei biglietti e delle candidature sono inviate server-side tramite Microsoft Graph con OAuth 2.0 Client Credentials. Configurare in Azure App Service:

```text
MICROSOFT_TENANT_ID=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
TICKETING_EMAIL_FROM=biglietti@nazionaleitalianasanitari.com
NIS_TICKETING_ADMIN_EMAIL=biglietti@nazionaleitalianasanitari.com
CANDIDATURE_TO=info@nazionaleitalianasanitari.com
```

L'App Registration Microsoft Entra deve avere il permesso **Microsoft Graph > Application > Mail.Send** con **Admin Consent**. Non sono richiesti login utente o permessi delegated. Il mittente deve essere una casella esistente nel tenant; per mostrare esattamente `Biglietti NIS` come nome mittente, configurare quel display name sulla casella Microsoft 365.

Tutte le variabili sono esclusivamente server-side. Il client secret e gli access token non devono essere esposti nel browser, nelle risposte API o nei log.

## Apple Wallet e Google Wallet

I wallet riutilizzano il ticket NIS esistente: stesso `ticket_code`, stesso payload QR `NIS:<qrToken>` e stessa verifica atomica al check-in. L'apertura o il salvataggio di un pass non consuma il biglietto. I pulsanti vengono mostrati nella pagina biglietto e nelle email solo quando il relativo provider è configurato.

Apple Wallet richiede un Pass Type ID attivo, il relativo certificato `.p12` esportato in Base64, la password del certificato e il certificato Apple WWDR in Base64:

```text
APPLE_WALLET_PASS_TYPE_ID=
APPLE_WALLET_TEAM_ID=
APPLE_WALLET_CERTIFICATE_BASE64=
APPLE_WALLET_CERTIFICATE_PASSWORD=
APPLE_WALLET_WWDR_CERTIFICATE_BASE64=
```

Google Wallet richiede un issuer approvato, un service account autorizzato nell'account Google Wallet e una classe **Event Ticket** già creata. `GOOGLE_WALLET_CLASS_ID` può contenere il solo suffisso o l'ID completo `issuerId.classId`:

```text
GOOGLE_WALLET_ISSUER_ID=
GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL=
GOOGLE_WALLET_PRIVATE_KEY=
GOOGLE_WALLET_CLASS_ID=
```

Certificati, chiavi private e password devono essere configurati esclusivamente come App Service settings server-side. Non vanno salvati nel repository, esposti nel client o stampati nei log. Apple Wallet usa pass `eventTicket` firmati; Google Wallet firma JWT `savetowallet` con RS256 e crea un `EventTicketObject` stabile collegato alla classe configurata.

## Ruoli e finestra check-in NIS Gala

L'accesso operativo usa sessioni server-side di 8 ore. Configurare PIN distinti per i due ruoli:

```text
NIS_STAFF_PIN=
NIS_SUPERADMIN_PIN=
NIS_STAFF_DISPLAY_NAME=Staff
NIS_SUPERADMIN_DISPLAY_NAME=Superadmin
```

`STAFF` può verificare e confermare gli ingressi. `SUPERADMIN` può inoltre annullare un check-in mantenendone l'audit e, con conferma esplicita, superare la finestra operativa.

La finestra può essere salvata nelle colonne evento `checkin_opens_at` e `checkin_closes_at` oppure impostata per il Gala tramite variabili server-side in formato ISO 8601, per esempio `2026-10-28T17:00:00+01:00`:

```text
NIS_GALA_CHECKIN_OPENS_AT=
NIS_GALA_CHECKIN_CLOSES_AT=
```

Se le variabili sono valorizzate prevalgono sui valori del database. I PIN, il ruolo e gli identificativi operatore non vengono mai salvati nel browser.

## Pulizia dati PayPal Sandbox

La migration `008_paypal_provider_environment.sql` aggiunge agli ordini il marker tecnico `SANDBOX`/`LIVE`. Gli ordini preesistenti vengono marcati `SANDBOX` perché le versioni precedenti dell'integrazione accettavano esclusivamente PayPal Sandbox.

Eseguire sempre prima l'anteprima:

```bash
npm run ticketing:cleanup-sandbox -- --dry-run
```

La modalità mostra conteggi e ordini interessati senza modificare il database. Solo dopo aver verificato il report, la cancellazione può essere avviata esplicitamente con:

```bash
npm run ticketing:cleanup-sandbox -- --execute
```

La pulizia elimina esclusivamente ordini marcati `PAYPAL` + `SANDBOX` e i relativi partecipanti, biglietti, check-in e stati di consegna email. Non modifica eventi, inviti, `used_count`, capienza, `public_slug`, sessioni staff, configurazioni applicative o storico migrazioni. L'operazione è transazionale e idempotente.

## Contabili bonifici ticketing

Le emissioni manuali da bonifico salvano nel database soltanto i metadati della contabile. Il file viene archiviato in un container Azure Blob privato ed è leggibile esclusivamente dalla route autenticata riservata al ruolo `SUPERADMIN`.

```text
AZURE_STORAGE_CONNECTION_STRING=
NIS_TICKETING_DOCUMENTS_CONTAINER=nis-ticketing-private
```

Il container viene creato senza accesso pubblico quando non esiste. La connection string è un'impostazione esclusivamente server-side e non deve essere inserita in variabili `NEXT_PUBLIC_*`, log o risposte API. Applicare la migration incrementale `013_manual_ticket_issuance.sql` prima di usare la pagina `/staff/emissione`.
