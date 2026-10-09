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
CANDIDATURE_TO=info@nazionaleitalianasanitari.com
```

L'App Registration Microsoft Entra deve avere il permesso **Microsoft Graph > Application > Mail.Send** con **Admin Consent**. Non sono richiesti login utente o permessi delegated. Il mittente deve essere una casella esistente nel tenant; per mostrare esattamente `Biglietti NIS` come nome mittente, configurare quel display name sulla casella Microsoft 365.

Tutte le variabili sono esclusivamente server-side. Il client secret e gli access token non devono essere esposti nel browser, nelle risposte API o nei log.
