import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { galaSponsors } from "@/data/gala-sponsors";
import {
  typeLabel,
  type ParticipantExportDataset,
} from "@/lib/ticketing/participant-export-model";

const clean = (value: string) =>
  value
    .replace(/[’‘]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[^\x20-\x7EÀ-ÿ]/g, " ");

const when = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Rome",
      }).format(new Date(value)).replace(",", "")
    : "-";

const money = (value: number | null) =>
  value === null
    ? "N/D"
    : `${new Intl.NumberFormat("it-IT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)} EUR`;

export async function buildParticipantPdf(data: ParticipantExportDataset) {
  const doc = await PDFDocument.create();
  doc.setTitle("Gala 2026 - Elenco partecipanti");
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const size: [number, number] = [841.89, 595.28];
  const navy = rgb(7 / 255, 29 / 255, 55 / 255);
  const gold = rgb(216 / 255, 188 / 255, 114 / 255);
  const gray = rgb(0.38, 0.43, 0.49);
  let page;
  let y = 0;

  const logo = await doc.embedPng(
    await readFile(
      path.join(process.cwd(), "public", "logo", "nis-logo-square.png"),
    ),
  );
  const sponsorImages = await Promise.all(
    galaSponsors.map(async (sponsor) => ({
      sponsor,
      image: await doc.embedPng(
        await readFile(
          path.join(
            process.cwd(),
            "public",
            ...sponsor.image.split("/").filter(Boolean),
          ),
        ),
      ),
    })),
  );

  const clipped = (text: string, max: number, fontSize = 6.8) => {
    const original = clean(text);
    let value = original;
    while (value.length && regular.widthOfTextAtSize(value, fontSize) > max) {
      value = value.slice(0, -1);
    }
    return value === original ? value : `${value.slice(0, -3)}...`;
  };

  const drawSponsorBand = () => {
    page!.drawRectangle({
      x: 36,
      y: y - 76,
      width: 770,
      height: 82,
      color: rgb(0.97, 0.98, 0.985),
      borderColor: rgb(0.84, 0.87, 0.9),
      borderWidth: 0.6,
    });
    page!.drawText("CON IL SUPPORTO DI", {
      x: 45,
      y: y - 11,
      size: 6.5,
      font: bold,
      color: gray,
    });
    const cellWidth = 138;
    const drawRow = (
      items: typeof sponsorImages,
      startX: number,
      rowY: number,
    ) =>
      items.forEach(({ image }, index) => {
        const maxWidth = 104;
        const maxHeight = 24;
        const scale = Math.min(
          maxWidth / image.width,
          maxHeight / image.height,
        );
        const width = image.width * scale;
        const height = image.height * scale;
        const x = startX + index * cellWidth + (cellWidth - width) / 2;
        page!.drawImage(image, {
          x,
          y: rowY + (maxHeight - height) / 2,
          width,
          height,
        });
      });
    drawRow(sponsorImages.slice(0, 5), 76, y - 39);
    drawRow(sponsorImages.slice(5), 145, y - 69);
    y -= 92;
  };

  const widths = [145, 90, 70, 95, 80, 95, 80, 115];
  const labels = [
    ["PARTECIPANTE"],
    ["CODICE"],
    ["TIPOLOGIA"],
    ["AZIENDA / ENTE"],
    ["MODALITA", "PAGAMENTO"],
    ["STATO", "PAGAMENTO"],
    ["INCASSATO", "(EUR)"],
    ["CHECK-IN"],
  ];

  const drawHeader = () => {
    let x = 36;
    page!.drawRectangle({
      x,
      y: y - 7,
      width: 770,
      height: 29,
      color: rgb(0.92, 0.94, 0.96),
    });
    labels.forEach((lines, index) => {
      lines.forEach((label, lineIndex) => {
        page!.drawText(label, {
          x: x + 4,
          y: y + 8 - lineIndex * 9,
          size: 6.2,
          font: bold,
          color: navy,
        });
      });
      x += widths[index];
    });
    y -= 34;
  };

  const drawSummaryCard = (
    x: number,
    title: string,
    metrics: Array<{ label: string; value: string }>,
    subtitle?: string,
  ) => {
    const width = 186;
    const height = 82;
    page!.drawRectangle({
      x,
      y: y - height,
      width,
      height,
      color: rgb(0.96, 0.975, 0.985),
      borderColor: rgb(0.82, 0.85, 0.88),
      borderWidth: 0.6,
    });
    const center = (
      text: string,
      left: number,
      areaWidth: number,
      top: number,
      fontSize: number,
      strong = false,
      color = navy,
    ) => {
      const font = strong ? bold : regular;
      let fittedSize = fontSize;
      while (
        fittedSize > 5.5 &&
        font.widthOfTextAtSize(clean(text), fittedSize) > areaWidth - 6
      ) {
        fittedSize -= 0.5;
      }
      page!.drawText(clean(text), {
        x:
          left +
          (areaWidth - font.widthOfTextAtSize(clean(text), fittedSize)) / 2,
        y: top,
        size: fittedSize,
        font,
        color,
      });
    };
    center(title, x, width, y - 15, 6.8, true, gold);
    if (subtitle) center(subtitle, x, width, y - 29, 6.5, false, gray);
    const metricTop = subtitle ? y - 52 : y - 42;
    const slotWidth = width / metrics.length;
    metrics.forEach((metric, index) => {
      const left = x + index * slotWidth;
      center(metric.value, left, slotWidth, metricTop, 11, true);
      center(metric.label, left, slotWidth, metricTop - 14, 5.4, false, gray);
    });
  };

  const drawSummary = () => {
    drawSummaryCard(
      36,
      "RIEPILOGO GENERALE",
      [
        { label: "TOTALE OPERATIVO", value: String(data.summary.total) },
        { label: "DI CUI OMAGGIO", value: String(data.summary.complimentary) },
        { label: "ANNULLATI", value: String(data.summary.cancelled) },
      ],
      `Generato il ${when(data.generatedAt)}`,
    );
    drawSummaryCard(230, "STATO INGRESSI", [
      { label: "EFFETTUATI", value: String(data.summary.used) },
      { label: "DA EFFETTUARE", value: String(data.summary.notUsed) },
    ]);
    drawSummaryCard(424, "STATO PAGAMENTI", [
      { label: "PAGATI", value: String(data.summary.paid) },
      { label: "DA INCASSARE", value: String(data.summary.toCollect) },
      { label: "DA VERIFICARE", value: String(data.summary.toVerify) },
    ]);
    drawSummaryCard(618, "VALORI ECONOMICI", [
      { label: "INCASSATI", value: money(data.summary.collected) },
      { label: "DA INCASSARE", value: money(data.summary.pending) },
      { label: "RICAVI OMAGGI", value: money(0) },
    ]);
    y -= 96;
  };

  const newPage = (first = false, withTableHeader = true) => {
    page = doc.addPage(size);
    const headerHeight = first ? 82 : 54;
    page.drawRectangle({
      x: 0,
      y: size[1] - headerHeight,
      width: size[0],
      height: headerHeight,
      color: navy,
    });
    const logoSize = first ? 55 : 34;
    page.drawImage(logo, {
      x: 36,
      y: size[1] - headerHeight + (headerHeight - logoSize) / 2,
      width: logoSize,
      height: logoSize,
    });
    page.drawText("NAZIONALE ITALIANA SANITARI", {
      x: first ? 105 : 82,
      y: size[1] - (first ? 30 : 22),
      size: first ? 9 : 8,
      font: bold,
      color: gold,
    });
    page.drawText("Gala 2026 - Elenco partecipanti", {
      x: first ? 105 : 82,
      y: size[1] - (first ? 58 : 41),
      size: first ? 18 : 13,
      font: bold,
      color: rgb(1, 1, 1),
    });
    y = size[1] - headerHeight - 20;
    if (first) drawSummary();
    if (withTableHeader) drawHeader();
  };

  newPage(true);
  for (const [index, row] of data.rows.entries()) {
    const remainingRows = data.rows.length - index;
    if (y < 58 || (remainingRows === 2 && y < 80)) newPage();
    let x = 36;
    const values = [
      `${row.lastName} ${row.firstName}`,
      row.ticketCode,
      typeLabel(row.invitationType),
      row.organization ?? "-",
      row.paymentMethod,
      row.paymentState,
      money(row.collectedAmount),
      row.checkedInAt
        ? `ENTRATO ${when(row.checkedInAt)}`
        : row.checkInStatus,
    ];
    values.forEach((value, index) => {
      page!.drawText(clipped(value, widths[index] - 8), {
        x: x + 4,
        y: y - 2,
        size: 6.8,
        font: index === 0 ? bold : regular,
        color:
          index === 7 && row.checkInStatus === "ENTRATO"
            ? rgb(0, 0.42, 0.24)
            : navy,
      });
      x += widths[index];
    });
    page!.drawLine({
      start: { x: 36, y: y - 9 },
      end: { x: 806, y: y - 9 },
      thickness: 0.35,
      color: rgb(0.82, 0.85, 0.88),
    });
    y -= 20;
  }

  const cancelledWidths = [200, 110, 100, 220, 140];
  const cancelledLabels = [
    ["PARTECIPANTE"],
    ["CODICE"],
    ["TIPOLOGIA"],
    ["AZIENDA / ENTE"],
    ["STATO"],
  ];
  const drawCancelledHeader = () => {
    let x = 36;
    page!.drawRectangle({
      x,
      y: y - 7,
      width: 770,
      height: 29,
      color: rgb(0.98, 0.93, 0.94),
    });
    cancelledLabels.forEach((lines, index) => {
      lines.forEach((label) =>
        page!.drawText(label, {
          x: x + 4,
          y: y + 8,
          size: 6.2,
          font: bold,
          color: navy,
        }),
      );
      x += cancelledWidths[index];
    });
    y -= 34;
  };

  y -= 8;
  if (y < 110) newPage(false, false);
  page!.drawText("BIGLIETTI ANNULLATI", {
    x: 36,
    y,
    size: 10,
    font: bold,
    color: rgb(0.62, 0.16, 0.2),
  });
  y -= 30;
  drawCancelledHeader();
  if (!data.cancelledRows.length) {
    page!.drawText("Nessun biglietto annullato nel perimetro selezionato.", {
      x: 40,
      y: y - 2,
      size: 7,
      font: regular,
      color: gray,
    });
    y -= 23;
  }
  for (const row of data.cancelledRows) {
    if (y < 58) {
      newPage(false, false);
      page!.drawText("BIGLIETTI ANNULLATI - SEGUE", {
        x: 36,
        y,
        size: 9,
        font: bold,
        color: rgb(0.62, 0.16, 0.2),
      });
      y -= 29;
      drawCancelledHeader();
    }
    let x = 36;
    const values = [
      `${row.lastName} ${row.firstName}`,
      row.ticketCode,
      typeLabel(row.invitationType),
      row.organization ?? "-",
      row.ticketStatus === "REFUNDED" ? "RIMBORSATO" : "ANNULLATO",
    ];
    values.forEach((value, index) => {
      page!.drawText(clipped(value, cancelledWidths[index] - 8), {
        x: x + 4,
        y: y - 2,
        size: 6.8,
        font: index === 0 ? bold : regular,
        color: index === 4 ? rgb(0.62, 0.16, 0.2) : navy,
      });
      x += cancelledWidths[index];
    });
    page!.drawLine({
      start: { x: 36, y: y - 9 },
      end: { x: 806, y: y - 9 },
      thickness: 0.35,
      color: rgb(0.82, 0.85, 0.88),
    });
    y -= 20;
  }

  y -= 8;
  if (y < 116) newPage(false, false);
  drawSponsorBand();

  const pages = doc.getPages();
  pages.forEach((item, index) => {
    item.drawText("NIS Gala 2026 - Report operativo partecipanti", {
      x: 36,
      y: 24,
      size: 6.5,
      font: regular,
      color: gray,
    });
    item.drawText(`Pagina ${index + 1} di ${pages.length}`, {
      x: 720,
      y: 24,
      size: 7,
      font: regular,
      color: gray,
    });
  });
  return doc.save();
}
