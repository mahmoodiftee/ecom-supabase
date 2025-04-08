// lib/pdf-generator.ts
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const generateReceipt = async (items: any, totalPrice: number) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = height - 50;
  page.drawText("Receipt", { x: 50, y, size: 30, font, color: rgb(0, 0, 0) });
  y -= 30;

  items.forEach((item: any) => {
    page.drawText(
      `${item.title} - ${item.quantity} x $${item.price.toFixed(2)}`,
      {
        x: 50,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      }
    );
    y -= 15;
  });

  page.drawText(`Total: $${totalPrice.toFixed(2)}`, {
    x: 50,
    y,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "receipt.pdf";
  link.click();
};
