# Handoff tecnico e grafico — NIS

## 1. Direzione grafica inderogabile
Il sito deve replicare la direzione dei mockup in `public/reference/`:
- fondo navy profondo
- blu elettrico per CTA e parole chiave
- verde NIS solo come accento
- tricolore dinamico, ma mai invasivo
- card chiare su fondi molto puliti
- fotografia che unisce sanitari + persone + sport + solidarietà
- logo NIS sempre utilizzato senza reinterpretazioni

NIS deve apparire come **associazione sanitaria nazionale di alto profilo**.  
Lo sport è un mezzo, non l'identità principale.

## 2. Brand hierarchy
- `NIS is NICE.` = firma di brand
- `Perché fare del bene è bello.` = support line
- `In campo per la salute. Uniti per la vita.` = slogan
- `Be NIS Be Nice` = programma associativo e di supporto

## 3. CMS consigliato
Content types:
- Project
- Event
- NewsArticle
- Sector
- Person
- Partner
- TransparencyDocument
- GlobalSettings
- FundraisingCampaign

Campi globali:
- CF
- RUNTS
- IBAN
- sede
- email/PEC
- social
- metriche di impatto validate

## 4. Fundraising
Il componente `FundraisingCard` è già presente graficamente.
In produzione collegarlo a:
- somma raccolta
- obiettivo
- percentuale
- numero donatori opzionale
- aggiornamento da CMS/API
- eventuale gateway Stripe/Nexi/PayPal/altro provider scelto

## 5. Dati demo
`500+ professionisti`, `10.000+ persone raggiunte` e altri KPI mostrati nei mockup sono valori di design/demo finché NIS non li valida ufficialmente.
Non pubblicarli in produzione senza approvazione.

## 6. Responsive
Tre livelli:
- desktop > 1100
- tablet 720–1100
- mobile < 720

## 7. Form
I form sono UI-only. Collegare lato server/API a:
- contatti
- candidatura Be NIS Be Nice
- donazioni
e aggiungere privacy, anti-spam, validazione e gestione consenso.

## 8. Produzione
Prima del go-live sostituire:
- crop immagini prototipo
- foto fondatori
- dati istituzionali placeholder
- partner/logo non autorizzati
- contenuti eventi/news placeholder
