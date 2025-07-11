// src/services/listenForNewInvoices.ts

import pool from "../db/pool.js";
import sendInvoiceEmail from "./sendInvoiceEmail.js";

const fetchInvoiceWithPdfUrl = async (
  invoiceId: number,
  retries = 5,
  delay = 2000
) => {
  for (let i = 0; i < retries; i++) {
    const { rows } = await pool.query("SELECT * FROM invoices WHERE id = $1", [
      invoiceId,
    ]);

    if (rows.length > 0 && rows[0].pdf_url) {
      console.log("✅ PDF URL found:", rows[0].pdf_url);
      return rows[0];
    }

    console.log(
      `⏳ Waiting for PDF to be generated... Attempt ${i + 1}/${retries}`
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  console.error("❌ PDF URL was never set. Skipping email.");
  return null;
};

const listenForNewInvoices = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    console.log("Setting up listener for new invoices...");
    await client.query("LISTEN new_invoice");

    client.on("notification", async (msg) => {
      try {
        if (!msg.payload) {
          console.warn("Received an empty notification payload.");
          return;
        }
        const invoice = JSON.parse(msg.payload);
        console.log("New Invoice Detected: ", invoice);
        if (!invoice.pdf_url) {
          console.log("🔍 PDF URL is missing. Waiting for PDF generation...");
          const updatedInvoice = await fetchInvoiceWithPdfUrl(invoice.id);

          if (!updatedInvoice) return; // PDF URL was never updated, skip email.

          await sendInvoiceEmail(updatedInvoice);
        } else {
          await sendInvoiceEmail(invoice);
        }
      } catch (error) {
        console.error(
          "ERROR: Error processing new invoice notification:",
          error
        );
      }
    });
  } catch (error) {
    console.error("ERROR: Could not listen for new invoices:", error);
  }
};

export default listenForNewInvoices;
