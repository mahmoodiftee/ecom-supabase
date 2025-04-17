import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { format } from "date-fns";

export interface ReceiptItem {
  title: string;
  quantity: number;
  price: number;
}

export interface ReceiptDetails {
  receiptNumber: string;
  date: Date;
  customerName?: string;
  customerEmail?: string;
  paymentMethod?: string;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  notes?: string;
}

// Helper function to calculate text width
const getTextWidth = (text: string, font: any, fontSize: number) => {
  return font.widthOfTextAtSize(text, fontSize);
};

// Function to wrap text into multiple lines if needed
const wrapText = (
  text: string,
  maxWidth: number,
  font: any,
  fontSize: number
) => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + " " + word;
    const testWidth = getTextWidth(testLine, font, fontSize);

    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};

export const generateReceipt = async (
  items: ReceiptItem[],
  totalPrice: number,
  details: Partial<ReceiptDetails> = {}
) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = page.getSize();

  // Embed fonts
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(
    StandardFonts.HelveticaOblique
  );

  // Set default values for receipt details
  const receiptDetails: ReceiptDetails = {
    receiptNumber:
      details.receiptNumber || `REC-${Date.now().toString().slice(-6)}`,
    date: details.date || new Date(),
    customerName: details.customerName || "",
    customerEmail: details.customerEmail || "",
    paymentMethod: details.paymentMethod || "Credit Card",
    companyName: details.companyName || "Your Company Name",
    companyAddress:
      details.companyAddress || "123 Business Street, City, Country",
    companyPhone: details.companyPhone || "+1 (555) 123-4567",
    companyEmail: details.companyEmail || "contact@yourcompany.com",
    companyWebsite: details.companyWebsite || "www.yourcompany.com",
    notes: details.notes || "Thank you for your business!",
  };

  // Colors
  const primaryColor = rgb(0.2, 0.4, 0.6);
  const secondaryColor = rgb(0.8, 0.8, 0.8);
  const textColor = rgb(0.1, 0.1, 0.1);
  const lightTextColor = rgb(0.5, 0.5, 0.5);

  // Margins and positions
  const margin = 50;
  let y = height - margin;
  const col1 = margin;
  const col2 = width - margin;

  // Draw header
  page.drawRectangle({
    x: 0,
    y: height - 120,
    width: width,
    height: 120,
    color: primaryColor,
  });

  page.drawText(receiptDetails.companyName || "", {
    x: margin,
    y: height - margin - 15,
    size: 24,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  page.drawText("RECEIPT", {
    x: width - margin - 100,
    y: height - margin - 15,
    size: 24,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  // Draw company details
  y = height - margin - 120;
  page.drawText("From:", {
    x: col1,
    y,
    size: 10,
    font: helveticaBold,
    color: textColor,
  });

  y -= 15;
  page.drawText(receiptDetails.companyAddress || "", {
    x: col1,
    y,
    size: 9,
    font: helvetica,
    color: textColor,
  });

  y -= 12;
  page.drawText(`Phone: ${receiptDetails.companyPhone}`, {
    x: col1,
    y,
    size: 9,
    font: helvetica,
    color: textColor,
  });

  y -= 12;
  page.drawText(`Email: ${receiptDetails.companyEmail}`, {
    x: col1,
    y,
    size: 9,
    font: helvetica,
    color: textColor,
  });

  y -= 12;
  page.drawText(`Website: ${receiptDetails.companyWebsite}`, {
    x: col1,
    y,
    size: 9,
    font: helvetica,
    color: textColor,
  });

  // Draw receipt details
  const receiptDetailsY = height - margin - 120;
  page.drawText("Receipt Details:", {
    x: width - margin - 150,
    y: receiptDetailsY,
    size: 10,
    font: helveticaBold,
    color: textColor,
  });

  page.drawText(`Receipt #: ${receiptDetails.receiptNumber}`, {
    x: width - margin - 150,
    y: receiptDetailsY - 15,
    size: 9,
    font: helvetica,
    color: textColor,
  });

  page.drawText(`Date: ${format(receiptDetails.date, "MMM dd, yyyy")}`, {
    x: width - margin - 150,
    y: receiptDetailsY - 27,
    size: 9,
    font: helvetica,
    color: textColor,
  });

  page.drawText(`Payment Method: ${receiptDetails.paymentMethod}`, {
    x: width - margin - 150,
    y: receiptDetailsY - 39,
    size: 9,
    font: helvetica,
    color: textColor,
  });

  // Draw customer details if provided
  if (receiptDetails.customerName || receiptDetails.customerEmail) {
    y -= 30;
    page.drawText("To:", {
      x: col1,
      y,
      size: 10,
      font: helveticaBold,
      color: textColor,
    });

    if (receiptDetails.customerName) {
      y -= 15;
      page.drawText(receiptDetails.customerName, {
        x: col1,
        y,
        size: 9,
        font: helvetica,
        color: textColor,
      });
    }

    if (receiptDetails.customerEmail) {
      y -= 12;
      page.drawText(receiptDetails.customerEmail, {
        x: col1,
        y,
        size: 9,
        font: helvetica,
        color: textColor,
      });
    }
  }

  // Draw items table
  y -= 40;
  const tableWidth = width - 2 * margin;
  const colItem = col1;
  const colQty = col1 + tableWidth * 0.6;
  const colPrice = col1 + tableWidth * 0.75;
  const colTotal = col1 + tableWidth * 0.9;

  // Table header
  page.drawRectangle({
    x: colItem,
    y: y - 5,
    width: tableWidth,
    height: 25,
    color: secondaryColor,
  });

  page.drawText("Item Description", {
    x: colItem + 10,
    y: y + 5,
    size: 10,
    font: helveticaBold,
    color: textColor,
  });

  page.drawText("Qty", {
    x: colQty,
    y: y + 5,
    size: 10,
    font: helveticaBold,
    color: textColor,
  });

  page.drawText("Price", {
    x: colPrice,
    y: y + 5,
    size: 10,
    font: helveticaBold,
    color: textColor,
  });

  page.drawText("Total", {
    x: colTotal,
    y: y + 5,
    size: 10,
    font: helveticaBold,
    color: textColor,
  });

  // Draw items with proper text wrapping
  y -= 25;
  let isAlternate = false;
  const itemColWidth = colQty - colItem - 20;
  const lineHeight = 12;
  const minRowHeight = 20;
  const rowPadding = 8;

  items.forEach((item) => {
    const itemTotal = item.quantity * item.price;
    const wrappedLines = wrapText(item.title, itemColWidth, helvetica, 9);
    const textHeight = wrappedLines.length * lineHeight;
    const itemHeight = Math.max(minRowHeight, textHeight + rowPadding);

    // Alternating row background
    if (isAlternate) {
      page.drawRectangle({
        x: colItem,
        y: y - itemHeight + minRowHeight - 5,
        width: tableWidth,
        height: itemHeight,
        color: rgb(0.95, 0.95, 0.95),
      });
    }
    isAlternate = !isAlternate;

    // Draw wrapped item description
    wrappedLines.forEach((line, i) => {
      page.drawText(line, {
        x: colItem + 10,
        y: y - i * lineHeight,
        size: 9,
        font: helvetica,
        color: textColor,
      });
    });

    // Draw other columns
    page.drawText(item.quantity.toString(), {
      x: colQty,
      y: y,
      size: 9,
      font: helvetica,
      color: textColor,
    });

    page.drawText(`$${item.price.toFixed(2)}`, {
      x: colPrice,
      y: y,
      size: 9,
      font: helvetica,
      color: textColor,
    });

    page.drawText(`$${itemTotal.toFixed(2)}`, {
      x: colTotal,
      y: y,
      size: 9,
      font: helvetica,
      color: textColor,
    });

    y -= itemHeight + 2;
  });

  // Draw totals
  y -= 15;
  page.drawLine({
    start: { x: colItem, y: y - 5 },
    end: { x: col2, y: y - 5 },
    thickness: 1,
    color: primaryColor,
  });

  y -= 25;
  page.drawText("Subtotal:", {
    x: colTotal - 60,
    y,
    size: 10,
    font: helveticaBold,
    color: textColor,
  });

  page.drawText(`$${totalPrice.toFixed(2)}`, {
    x: colTotal,
    y,
    size: 10,
    font: helveticaBold,
    color: textColor,
  });

  y -= 20;
  page.drawText("Tax:", {
    x: colTotal - 60,
    y,
    size: 10,
    font: helveticaBold,
    color: textColor,
  });

  const tax = totalPrice * 0.0;
  page.drawText(`$${tax.toFixed(2)}`, {
    x: colTotal,
    y,
    size: 10,
    font: helveticaBold,
    color: textColor,
  });

  y -= 20;
  page.drawText("Total:", {
    x: colTotal - 60,
    y,
    size: 12,
    font: helveticaBold,
    color: primaryColor,
  });

  const grandTotal = totalPrice + tax;
  page.drawText(`$${grandTotal.toFixed(2)}`, {
    x: colTotal,
    y,
    size: 12,
    font: helveticaBold,
    color: primaryColor,
  });

  // Draw notes
  y -= 50;
  page.drawText("Notes:", {
    x: colItem,
    y,
    size: 10,
    font: helveticaBold,
    color: textColor,
  });

  y -= 15;
  page.drawText(receiptDetails.notes || '', {
    x: colItem,
    y,
    size: 9,
    font: helveticaOblique,
    color: lightTextColor,
  });

  // Draw footer
  const footerY = 40;
  page.drawLine({
    start: { x: margin, y: footerY + 10 },
    end: { x: width - margin, y: footerY + 10 },
    thickness: 1,
    color: secondaryColor,
  });

  page.drawText(
    `Generated on ${format(new Date(), "MMM dd, yyyy 'at' h:mm a")}`,
    {
      x: margin,
      y: footerY - 5,
      size: 8,
      font: helvetica,
      color: lightTextColor,
    }
  );

  page.drawText("Page 1 of 1", {
    x: width - margin - 50,
    y: footerY - 5,
    size: 8,
    font: helvetica,
    color: lightTextColor,
  });

  // Save and download the PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `receipt-${receiptDetails.receiptNumber}.pdf`;
  link.click();
};
