// src/models/invoiceModel.ts

import pool from "../db/pool.js";
import { generateInvoiceNumber } from "../services/invoiceService.js";
import { Invoice } from "../types/Invoice.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createInvoiceModel = async (
  invoiceData: Invoice
): Promise<Invoice> => {
  try {
    const invoiceQuery = `
    SELECT 
      s.id AS subscription_id,
      s.customer_id, 
      c.firstname || ' ' || c.lastname AS customer_name, 
      c.email AS customer_email, 
      s.plan_id, 
      p.name AS plan_name, 
      p.price AS plan_price,
      p.price AS total_amount,
      COALESCE(
        JSON_AGG(
          JSONB_BUILD_OBJECT(
            'item_id', si.item_id,
            'item_name', i.name,
            'quantity', si.quantity,
            'price_per_unit', i.price
          )
        ) FILTER (WHERE si.item_id IS NOT NULL), '[]'::json
      ) AS items
    FROM subscriptions s
    JOIN customers c ON s.customer_id = c.id
    JOIN subscription_plans p ON s.plan_id = p.id
    LEFT JOIN subscription_items si ON s.id = si.subscription_id
    LEFT JOIN items i ON si.item_id = i.id
    WHERE s.id = $1
    GROUP BY s.id, c.id, p.id;
  `;
    const data = await pool.query(invoiceQuery, [invoiceData.subscription_id]);
    const itemsJson = JSON.stringify(data.rows[0].items);
    const invoiceNumber = await generateInvoiceNumber();
    const newInvoiceQuery = `
      INSERT INTO invoices (customer_id, customer_name, customer_email, 
        subscription_id, plan_name, plan_price, invoice_number, 
        total_amount, items, status, issued_date, due_date, pdf_url, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'generated', 
        NOW(), NOW() + INTERVAL '30 days', $10, $11)
      RETURNING *;
    `;
    const newInvoiceValues = [
      data.rows[0].customer_id,
      data.rows[0].customer_name,
      data.rows[0].customer_email,
      data.rows[0].subscription_id,
      data.rows[0].plan_name,
      data.rows[0].plan_price,
      invoiceNumber,
      data.rows[0].total_amount,
      itemsJson,
      data.rows[0].pdf_url,
      data.rows[0].notes,
    ];
    const { rows: newInvoice } = await pool.query(
      newInvoiceQuery,
      newInvoiceValues
    );
    return newInvoice[0];
  } catch (error) {
    console.error("ERROR: Failed to create invoice (model): ", error);
    throw error;
  }
};

export const updateInvoicePDFUrl = async (
  invoiceId: string,
  pdfUrl: string
) => {
  try {
    const update_query = `UPDATE invoices SET pdf_url = $1 WHERE id = $2`;
    const { rows: updatedPdfUrl } = await pool.query(update_query, [
      pdfUrl,
      invoiceId,
    ]);
    return updatedPdfUrl[0];
  } catch (error) {
    console.error("ERROR: Failed to update invoice PDF URL (model): ", error);
    throw error;
  }
};

export const getAllInvoicesModel = async (
  page: number,
  limit: number,
  sortBy: string,
  order: string
): Promise<{
  invoices: Invoice[];
  totalInvoices: number;
}> => {
  try {
    const offset = (page - 1) * limit;
    const validSortColumns = [
      "id",
      "customer_id",
      "customer_name",
      "customer_email",
      "subscription_id",
      "plan_name",
      "plan_price",
      "invoice_number",
      "total_amount",
      "status",
      "issued_date",
      "due_date",
      "pdf_url",
      "notes",
      "created_at",
      "updated_at",
    ];
    const validOrders = ["asc", "desc"];
    const sortColumn = validSortColumns.includes(sortBy)
      ? sortBy
      : "updated_at";
    const sortOrder = validOrders.includes(order.toLowerCase())
      ? order
      : "desc";
    const select_query = `
      SELECT * FROM invoices 
      ORDER BY ${sortColumn} ${sortOrder} 
      LIMIT $1 OFFSET $2;
    `;
    const { rows: invoices } = await pool.query(select_query, [limit, offset]);
    const count_query = `SELECT COUNT(*) FROM invoices;`;
    const { rows } = await pool.query(count_query);
    const totalInvoices = parseInt(rows[0].count, 10);
    return { invoices, totalInvoices };
  } catch (error) {
    console.error("ERROR: Failed to fetch all invoices (model): ", error);
    throw error;
  }
};

export const getInvoiceByInvoiceNumberModel = async (
  invoiceNumber: string
): Promise<Invoice | null> => {
  try {
    const select_query = `SELECT * FROM invoices WHERE invoice_number = $1;`;
    const { rows } = await pool.query(select_query, [invoiceNumber]);
    return rows[0];
  } catch (error) {
    console.error(
      "ERROR: Failed to fetch invoice by invoice number (model): ",
      error
    );
    throw error;
  }
};

export const getInvoiceByCustomerAndSubscriptionIdModel = async (
  customer_id: string,
  subscription_id: string
): Promise<Invoice | null> => {
  try {
    const select_query = `SELECT * FROM invoices WHERE customer_id = $1 AND subscription_id = $2;`;
    const { rows } = await pool.query(select_query, [
      customer_id,
      subscription_id,
    ]);
    return rows[0];
  } catch (error) {
    console.error(
      "ERROR: Failed to fetch invoice by customer and subscription id (model): ",
      error
    );
    throw error;
  }
};

export const getInvoiceByIdModel = async (
  id: string
): Promise<Invoice | null> => {
  try {
    const select_query = `SELECT * FROM invoices WHERE id = $1;`;
    const { rows } = await pool.query(select_query, [id]);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Failed to fetch invoice by id (model): ", error);
    throw error;
  }
};

export const getInvoicesByIdsModel = async (
  invoiceIds: string[]
): Promise<Invoice[]> => {
  try {
    const query = `
      SELECT * FROM invoices
      WHERE id = ANY($1::uuid[]);
    `;
    const { rows } = await pool.query(query, [invoiceIds]);
    return rows;
  } catch (error) {
    console.error("ERROR: Failed to get invoices by IDs (model): ", error);
    throw error;
  }
};

// export const cancelInvoiceModel = async (
//   invoiceId: string
// ): Promise<Invoice> => {
//   try {
//     const update_query = `UPDATE invoices SET status = 'canceled' WHERE id = $1;`;
//     const { rows } = await pool.query(update_query, [invoiceId]);
//     return rows[0];
//   } catch (error) {
//     console.error("ERROR: Failed to cancel invoice (model): ", error);
//     throw error;
//   }
// };

export const patchUpdateInvoiceByIdModel = async (
  id: string,
  updates: Partial<Invoice>
): Promise<Invoice | null> => {
  try {
    if (Object.keys(updates).length === 0) {
      throw new Error("No fields provided for update");
    }
    const fields: string[] = [];
    const values: (string | number | Date | null)[] = [];
    let index = 1;
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key}=$${index}`);
        values.push(value as string | number | Date | null);
        index++;
      }
    });
    values.push(id);
    const update_query = `
          UPDATE invoices SET 
          ${fields.join(", ")}
          WHERE id=$${index} 
          RETURNING *
      `;
    const { rows } = await pool.query(update_query, values);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Failed to patch update invoice by id: ", error);
    throw error;
  }
};

export const deleteInvoicesByIdsModel = async (
  invoiceIds: string[]
): Promise<Invoice[] | null> => {
  try {
    await pool.query("BEGIN");
    const select_query = `
      SELECT id, pdf_url FROM invoices
      WHERE id = ANY($1::uuid[]);
    `;
    const { rows: invoices } = await pool.query(select_query, [invoiceIds]);
    console.log("Invoices: ", invoices);

    const delete_query = `
      DELETE FROM invoices
      WHERE id = ANY($1::uuid[])
      RETURNING *;
    `;
    const { rows: deletedInvoices } = await pool.query(delete_query, [
      invoiceIds,
    ]);
    await pool.query("COMMIT");

    invoices.forEach(({ pdf_url }) => {
      if (pdf_url) {
        const filePath = path.join(
          __dirname,
          "../..",
          "public",
          "invoices",
          path.basename(pdf_url)
        );
        console.log("Attempting to delete:", filePath);

        fs.unlink(filePath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error(
              `ERROR: Failed to delete invoice PDF (${pdf_url}):`,
              err
            );
          } else if (!err) {
            console.log(`Successfully deleted: ${filePath}`);
          }
        });
      }
    });

    return deletedInvoices;
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("ERROR: Failed to delete invoices by ids (model): ", error);
    throw error;
  }
};
