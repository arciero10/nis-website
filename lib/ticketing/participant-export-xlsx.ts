import {strToU8,zipSync} from "fflate";
import {sanitizeSpreadsheetText,typeLabel,type ParticipantExportDataset} from "@/lib/ticketing/participant-export-model";

const esc=(value:string)=>sanitizeSpreadsheetText(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const col=(index:number)=>{let value="";for(let current=index+1;current;current=Math.floor((current-1)/26))value=String.fromCharCode(65+(current-1)%26)+value;return value;};
type Cell={value:string|number|null;style?:number};
function sheet(rows:Cell[][],widths:number[],filter=false){const body=rows.map((row,r)=>`<row r="${r+1}">${row.map((cell,c)=>cell.value===null?"":typeof cell.value==="number"?`<c r="${col(c)}${r+1}" s="${cell.style??0}"><v>${cell.value}</v></c>`:`<c r="${col(c)}${r+1}" t="inlineStr" s="${cell.style??0}"><is><t xml:space="preserve">${esc(cell.value)}</t></is></c>`).join("")}</row>`).join("");return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${widths.map((width,index)=>`<col min="${index+1}" max="${index+1}" width="${width}" customWidth="1"/>`).join("")}</cols><sheetData>${body}</sheetData>${filter&&rows.length?`<autoFilter ref="A1:${col(widths.length-1)}${rows.length}"/>`:""}</worksheet>`;}
const date=(value:string|null)=>value?new Intl.DateTimeFormat("it-IT",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",timeZone:"Europe/Rome"}).format(new Date(value)).replace(",",""):"-";

export function buildParticipantWorkbookParts(data:ParticipantExportDataset){
  const header=(values:string[])=>values.map(value=>({value,style:1}));
  const participants:Cell[][]=[header(["Nominativo","Email","Telefono","Codice biglietto","Tipologia","Azienda/Ente","Modalità di pagamento","Stato pagamento","Importo incassato (€)","Stato check-in","Ora check-in","Data emissione"])];
  for(const row of data.rows)participants.push([{value:`${row.lastName} ${row.firstName}`},{value:row.email},{value:row.phone??""},{value:row.ticketCode},{value:typeLabel(row.invitationType)},{value:row.organization??""},{value:row.paymentMethod},{value:row.paymentState},{value:row.collectedAmount===null?"N/D":row.collectedAmount,style:row.collectedAmount===null?0:2},{value:row.checkInStatus},{value:date(row.checkedInAt)},{value:date(row.issuedAt)}]);
  const cancelled:Cell[][]=[header(["Nominativo","Codice biglietto","Tipologia","Azienda/Ente","Stato"])];
  for(const row of data.cancelledRows)cancelled.push([{value:`${row.lastName} ${row.firstName}`},{value:row.ticketCode},{value:typeLabel(row.invitationType)},{value:row.organization??""},{value:row.ticketStatus==="REFUNDED"?"RIMBORSATO":"ANNULLATO"}]);
  const summary:Cell[][]=[
    [{value:"Riepilogo NIS Gala 2026",style:1}],
    [{value:"Generato il"},{value:date(data.generatedAt)}],
    [{value:"Totale operativo"},{value:data.summary.total}],
    [{value:"di cui omaggio (inclusi nel totale operativo)"},{value:data.summary.complimentary}],
    [{value:"Entrati"},{value:data.summary.used}],
    [{value:"Da arrivare"},{value:data.summary.notUsed}],
    [{value:"Annullati/rimborsati"},{value:data.summary.cancelled}],
    [{value:"Biglietti pagati"},{value:data.summary.paid}],
    [{value:"Biglietti da incassare"},{value:data.summary.toCollect}],
    [{value:"Biglietti da verificare"},{value:data.summary.toVerify}],
    [{value:"Biglietti senza ricavo"},{value:data.summary.notDue}],
    [{value:"Biglietti rimborsati"},{value:data.summary.refunded}],
    [{value:"Stato non determinabile"},{value:data.summary.undetermined}],
    [{value:"Totale incassi confermati"},{value:data.summary.collected,style:2}],
    [{value:"Totale ancora da incassare"},{value:data.summary.pending,style:2}],
    [{value:""}],
    [{value:"Per modalità di pagamento",style:1}],
    ...Object.entries(data.summary.byPaymentMethod).map(([key,value])=>[{value:key},{value}]),
    [{value:""}],
    [{value:"Per tipologia",style:1}],
    ...Object.entries(data.summary.byType).map(([key,value])=>[{value:key},{value}]),
  ];
  const companies:Cell[][]=[header(["Società","Tipo","Email referente","Biglietti assegnati","Emessi","Utilizzati","Residui","Importo partnership (€)"])];
  for(const item of data.companies)companies.push([{value:item.company},{value:item.type},{value:item.contact},{value:item.assigned},{value:item.issued},{value:item.used},{value:item.remaining},{value:item.amount===null?"N/D":item.amount,style:item.amount===null?0:2}]);
  return {
    "[Content_Types].xml":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet4.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
    "_rels/.rels":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    "xl/workbook.xml":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Partecipanti" sheetId="1" r:id="rId1"/><sheet name="Annullati" sheetId="2" r:id="rId2"/><sheet name="Riepilogo" sheetId="3" r:id="rId3"/><sheet name="Aziende" sheetId="4" r:id="rId4"/></sheets></workbook>`,
    "xl/_rels/workbook.xml.rels":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet4.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/><Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    "xl/styles.xml":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="#,##0.00 [$€-it-IT]"/></numFmts><fonts count="2"><font><sz val="10"/><name val="Arial"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="10"/><name val="Arial"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF071D37"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border/></borders><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFill="1"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" applyNumberFormat="1"/></cellXfs></styleSheet>`,
    "xl/worksheets/sheet1.xml":sheet(participants,[28,32,18,20,16,24,24,22,22,18,20,20],true),
    "xl/worksheets/sheet2.xml":sheet(summary,[34,24],false),
    "xl/worksheets/sheet3.xml":sheet(companies,[28,16,30,20,12,12,12,22],true),
    "xl/worksheets/sheet4.xml":sheet(cancelled,[30,22,18,28,16],true),
  };
}

export function buildParticipantXlsx(data:ParticipantExportDataset){const parts=buildParticipantWorkbookParts(data);return zipSync(Object.fromEntries(Object.entries(parts).map(([path,content])=>[path,strToU8(content)])),{level:6});}
