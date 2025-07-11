// src/services/invoicePdfService.ts

import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { Invoice } from "../types/Invoice.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoicePDF = (invoice: Invoice): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const pdfPath = path.join(
        __dirname,
        "../../public/invoices",
        `invoice_${invoice.invoice_number}.pdf`
      );
      const doc = new PDFDocument({ margin: 50 });
      const writeStream = fs.createWriteStream(pdfPath);
      doc.pipe(writeStream);

      // 🔹 Company Header
      doc.fontSize(24).text("Company Name", { align: "center" });
      doc.fontSize(12).text("Company Address", { align: "center" });
      doc.fontSize(12).text("Email: company@example.com", { align: "center" });
      doc.moveDown(2);

      // 🔹 Invoice Header
      doc.fontSize(20).text("Invoice", { align: "center", underline: true });
      doc.moveDown();
      doc.fontSize(14).text(`Invoice Number: ${invoice.invoice_number}`);
      doc.text(`Customer: ${invoice.customer_name}`);
      doc.text(`Email: ${invoice.customer_email}`);
      doc.text(`Plan: ${invoice.plan_name} - Rs.${invoice.plan_price}`);
      doc.moveDown(1.5);

      // 🔹 Items Section
      doc.fontSize(16).text("Items", { underline: true });
      doc.moveDown(0.5);
      if (Array.isArray(invoice.items) && invoice.items.length > 0) {
        invoice.items.forEach((item, index) => {
          doc
            .fontSize(12)
            .text(
              `${index + 1}. ${item.item_name} - ${item.quantity || 1} x Rs.${
                item.price_per_unit
              } = Rs.${(item.quantity || 1) * item.price_per_unit}`,
              { indent: 20 }
            );
        });
      } else {
        doc.text("No items available", { indent: 20 });
      }
      doc.moveDown(1.5);

      // 🔹 Invoice Summary
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .text(`Total Amount: Rs.${invoice.total_amount}`);
      doc.font("Helvetica");
      doc.text(`Status: ${invoice.status || "Pending"}`);
      doc.text(`Issued Date: ${invoice.issued_date?.toLocaleDateString()}`);
      doc.text(`Due Date: ${invoice.due_date?.toLocaleDateString()}`);
      doc.moveDown(1.5);

      // 🔹 Notes Section
      if (invoice.notes) {
        doc.fontSize(12).text("Notes:", { underline: true });
        doc.text(invoice.notes, { indent: 20 });
      }

      // 🔹 Footer
      doc.moveDown(2);
      doc
        .fontSize(10)
        .text("Thank you for your business!", { align: "center" });

      doc.end();
      writeStream.on("finish", () => {
        resolve(`/invoices/invoice_${invoice.invoice_number}.pdf`);
      });
      writeStream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};

// import { fileURLToPath } from "url";
// import fs from "fs";
// import path from "path";
// import PDFDocument from "pdfkit";
// import { Invoice } from "../types/Invoice.ts";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Define consistent colors for branding
// const COLORS = {
//   primary: "#3366CC",
//   secondary: "#6699FF",
//   accent: "#FF9900",
//   text: "#333333",
//   lightGray: "#F5F5F5",
//   mediumGray: "#DDDDDD",
//   success: "#28a745",
//   warning: "#ffc107",
//   danger: "#dc3545",
// };

// // Define status colors
// const getStatusColor = (status: string): string => {
//   switch (status?.toLowerCase()) {
//     case "paid":
//       return COLORS.success;
//     case "overdue":
//       return COLORS.danger;
//     case "pending":
//       return COLORS.warning;
//     default:
//       return COLORS.text;
//   }
// };

// export const generateInvoicePDF = (invoice: Invoice): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     try {
//       const pdfPath = path.join(
//         __dirname,
//         "../../public/invoices",
//         `invoice_${invoice.invoice_number}.pdf`
//       );

//       // Create PDF with slightly larger margins for better aesthetics
//       const doc = new PDFDocument({
//         margin: 60,
//         size: "A4",
//         info: {
//           Title: `Invoice ${invoice.invoice_number}`,
//           Author: "Company Name",
//         },
//       });

//       const writeStream = fs.createWriteStream(pdfPath);
//       doc.pipe(writeStream);

//       // Helper function to draw a rounded rectangle
//       const drawRoundedRect = (
//         x: number,
//         y: number,
//         width: number,
//         height: number,
//         radius: number,
//         fillColor?: string
//       ) => {
//         doc.roundedRect(x, y, width, height, radius);
//         if (fillColor) {
//           doc.fillAndStroke(fillColor, COLORS.mediumGray);
//         } else {
//           doc.stroke();
//         }
//       };

//       // Header with logo and company info in a nicely formatted box
//       doc.font("Helvetica-Bold");

//       // Logo placeholder (replace with actual company logo)
//       doc
//         .rect(50, 60, 80, 80)
//         .lineWidth(1)
//         .fillAndStroke(COLORS.lightGray, COLORS.mediumGray);
//       doc.fontSize(16).fill(COLORS.primary).text("LOGO", 67, 95);

//       // Company contact info
//       doc.fontSize(22).fill(COLORS.primary).text("Company Name", 150, 70);
//       doc.font("Helvetica").fontSize(10).fill(COLORS.text);
//       doc.text("123 Business Avenue, Suite 200", 150, doc.y + 5);
//       doc.text("Business City, State 12345", 150, doc.y + 2);
//       doc.text("Phone: (555) 123-4567", 150, doc.y + 2);
//       doc.text("Email: billing@company.com", 150, doc.y + 2);
//       doc.text("Web: www.companyname.com", 150, doc.y + 2);

//       // Invoice Title Banner
//       doc.rect(50, 170, 495, 40).fillAndStroke(COLORS.primary, COLORS.primary);
//       doc.fill("#FFFFFF").fontSize(18).text("INVOICE", 270, 182);

//       // Customer and Invoice Details in two columns
//       doc.fill(COLORS.text).fontSize(10);

//       // Left Column - Customer Details
//       doc.font("Helvetica-Bold").text("BILL TO:", 50, 230);
//       doc.font("Helvetica");
//       doc.text(invoice.customer_name, 50, doc.y + 5);
//       doc.text(invoice.customer_email, 50, doc.y + 2);

//       // Right Column - Invoice Details
//       const detailsX = 350;
//       doc.font("Helvetica-Bold").text("INVOICE DETAILS:", detailsX, 230);
//       doc.font("Helvetica");
//       doc.text(
//         `Invoice Number: #${invoice.invoice_number}`,
//         detailsX,
//         doc.y + 5
//       );
//       doc.text(
//         `Issue Date: ${invoice.issued_date?.toLocaleDateString()}`,
//         detailsX,
//         doc.y + 2
//       );
//       doc.text(
//         `Due Date: ${invoice.due_date?.toLocaleDateString()}`,
//         detailsX,
//         doc.y + 2
//       );

//       // Plan information in an accent box
//       const planY = doc.y + 15;
//       drawRoundedRect(50, planY, 495, 35, 5, COLORS.lightGray);
//       doc.fill(COLORS.primary).font("Helvetica-Bold").fontSize(12);
//       doc.text(`Plan: ${invoice.plan_name}`, 70, planY + 12);
//       doc.text(`Rs.${invoice.plan_price.toLocaleString()}`, 450, planY + 12, {
//         align: "right",
//         width: 75,
//       });

//       // Items Table Header
//       const tableTop = planY + 55;
//       doc.fill(COLORS.primary).rect(50, tableTop, 495, 25).fill();
//       doc.fill("#FFFFFF").fontSize(10);
//       doc.text("Item", 70, tableTop + 8);
//       doc.text("Quantity", 270, tableTop + 8);
//       doc.text("Price", 350, tableTop + 8);
//       doc.text("Amount", 450, tableTop + 8);

//       // Items Table Content
//       let yPos = tableTop + 25;
//       const lineHeight = 25;

//       doc.font("Helvetica").fontSize(10).fill(COLORS.text);

//       if (Array.isArray(invoice.items) && invoice.items.length > 0) {
//         invoice.items.forEach((item, index) => {
//           // Alternating row colors for better readability
//           if (index % 2 === 0) {
//             doc.rect(50, yPos, 495, lineHeight).fill(COLORS.lightGray);
//           }

//           doc.fill(COLORS.text);
//           doc.text(item.item_name, 70, yPos + 8);
//           doc.text(item.quantity?.toString() || "1", 270, yPos + 8);
//           doc.text(`Rs.${item.price_per_unit.toLocaleString()}`, 350, yPos + 8);
//           doc.text(
//             `Rs.${(
//               (item.quantity || 1) * item.price_per_unit
//             ).toLocaleString()}`,
//             450,
//             yPos + 8
//           );

//           yPos += lineHeight;
//         });
//       } else {
//         doc.rect(50, yPos, 495, lineHeight).fill(COLORS.lightGray);
//         doc.fill(COLORS.text).text("No items available", 70, yPos + 8);
//         yPos += lineHeight;
//       }

//       // Calculate taxes and total (add 15% tax as an example)
//       const subtotal = invoice.total_amount;
//       const taxRate = 0.15;
//       const taxAmount = subtotal * taxRate;
//       const grandTotal = subtotal + taxAmount;

//       // Add subtotal, tax and total
//       yPos += 10;
//       doc.font("Helvetica").fontSize(10).fill(COLORS.text);
//       doc.text("Subtotal:", 350, yPos);
//       doc.text(`Rs.${subtotal.toLocaleString()}`, 450, yPos, {
//         align: "right",
//         width: 75,
//       });

//       yPos += 20;
//       doc.text("Tax (15%):", 350, yPos);
//       doc.text(`Rs.${taxAmount.toLocaleString()}`, 450, yPos, {
//         align: "right",
//         width: 75,
//       });

//       yPos += 5;
//       doc
//         .moveTo(350, yPos + 10)
//         .lineTo(525, yPos + 10)
//         .stroke();

//       yPos += 20;
//       doc.font("Helvetica-Bold").fontSize(14).fill(COLORS.primary);
//       doc.text("TOTAL:", 350, yPos);
//       doc.text(`Rs.${grandTotal.toLocaleString()}`, 450, yPos, {
//         align: "right",
//         width: 75,
//       });

//       // Payment Status
//       yPos += 40;
//       const statusColor = getStatusColor(invoice.status || "pending");
//       drawRoundedRect(50, yPos, 495, 40, 5);
//       doc.fill(statusColor).fontSize(14).font("Helvetica-Bold");
//       doc.text("Payment Status:", 70, yPos + 14);
//       doc.text(invoice.status || "Pending", 200, yPos + 14);

//       // Notes Section
//       if (invoice.notes) {
//         yPos += 60;
//         doc.font("Helvetica-Bold").fill(COLORS.text).fontSize(11);
//         doc.text("Notes:", 50, yPos);
//         doc.font("Helvetica").fontSize(10);
//         doc.text(invoice.notes, 50, yPos + 20, { width: 495 });
//       }

//       // Payment Instructions
//       const footerY = doc.page.height - 150;
//       drawRoundedRect(50, footerY, 495, 70, 5, COLORS.lightGray);
//       doc.fill(COLORS.primary).font("Helvetica-Bold").fontSize(10);
//       doc.text("Payment Instructions:", 70, footerY + 15);
//       doc.fill(COLORS.text).font("Helvetica").fontSize(9);
//       doc.text("Please make payment via bank transfer to:", 70, footerY + 30);
//       doc.text("Bank Name: ABC Bank", 70, footerY + 42);
//       doc.text("Account No: 1234567890", 70, footerY + 54);

//       // Footer
//       doc
//         .fontSize(8)
//         .fill(COLORS.text)
//         .text(
//           "Thank you for your business. This invoice was generated electronically and is valid without a signature.",
//           50,
//           doc.page.height - 50,
//           { align: "center", width: 495 }
//         );

//       // Add page number to current page (no need to switch pages)
//       doc
//         .fontSize(8)
//         .fill(COLORS.text)
//         .text("Page 1", 50, doc.page.height - 30, {
//           align: "center",
//           width: 495,
//         });

//       doc.end();
//       writeStream.on("finish", () => {
//         resolve(`/invoices/invoice_${invoice.invoice_number}.pdf`);
//       });
//       writeStream.on("error", reject);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };
