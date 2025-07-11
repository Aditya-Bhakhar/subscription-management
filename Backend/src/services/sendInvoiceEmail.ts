// src/services/sendInvoiceEmail.ts

import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import { Invoice } from "../types/Invoice.js";
import pool from "../db/pool.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const showToast = (message: string, type: "success" | "error" | "warning") => {
  console.log(`[${type.toUpperCase()}] ${message}`);
};

const sendInvoiceEmail = async (invoice: Invoice): Promise<void> => {
  try {
    console.log(`Sending invoice email to ${invoice.customer_email}...`);
    console.log(`Invoice at "sendInvoiceEmail.ts": `, invoice);

    if (!invoice.pdf_url) {
      showToast(
        `Skipping email for Invoice #${invoice.invoice_number}: No PDF attached.`,
        "warning"
      );
      return; 
    }

    const pdfPath = path.join(
      __dirname,
      "../../public",
      invoice.pdf_url as string
    );
    console.log("PDF Path:", pdfPath);
    if (!fs.existsSync(pdfPath)) {
      showToast(
        `Skipping email for Invoice #${invoice.invoice_number}: PDF file not found.`,
        "warning"
      );
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail App Password
      },
    });
    console.log("GMAIL_USER: ", process.env.GMAIL_USER);
    console.log("GMAIL_APP_PASSWORD: ", process.env.GMAIL_APP_PASSWORD);

    const mailOptions = {
      from: `"Memighty" <${process.env.GMAIL_USER}>`,
      to: invoice.customer_email,
      subject: `Invoice #${invoice.invoice_number} - Payment Due`,
      html: `
          <p>Dear ${invoice.customer_name},</p>
          <p>Thank you for your subscription to <strong>${invoice.plan_name}</strong>.</p>
          <p>Your total amount due is <strong>₹${invoice.total_amount}</strong>.</p>
          <p>Please find your invoice attached.</p>
          <p>Best Regards, <br/> Memighty</p>
        `,
      attachments: [
        {
          filename: `invoice_${invoice.invoice_number}.pdf`,
          path: pdfPath,
          contentType: "application/pdf",
        },
      ],
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    if (info.response.includes("OK")) {
      // Check if email was sent successfully
      console.log("Email sent successfully!");
      showToast(
        `Email sent successfully to ${invoice.customer_email}`,
        "success"
      );

      // Update invoice status in the database**
      const updateQuery = `
          UPDATE invoices 
          SET status = 'sent'
          WHERE id = $1
        `;
      await pool.query(updateQuery, [invoice.id]);
      console.log(
        `Invoice #${invoice.invoice_number} status updated to 'sent'.`
      );
      showToast(
        `Invoice #${invoice.invoice_number} marked as 'sent'.`,
        "success"
      );
    } else {
      showToast(`Email sent but response was not 'OK'`, "warning");
    }
  } catch (error) {
    showToast(`Error sending email: ${error}`, "error");
  }
};

export default sendInvoiceEmail;
