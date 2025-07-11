// src/controllers/invoiceAnanlysisController.ts

import { Request, Response, NextFunction } from "express";
import pool from "../db/pool.js";
import { handleResponse } from "../services/responseHandler.js";

// 1️⃣ Invoice Status Breakdown
export const getInvoiceStatusBreakdown = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
        SELECT
          status, 
          COUNT(*) AS total_invoices,  
          SUM(total_amount) AS total_amount  
        FROM invoices
        GROUP BY status
        ORDER BY total_invoices DESC;
      `;

    const result = await pool.query(query);

    const statusBreakdown = result.rows.map((row) => ({
      status: row.status,
      total_invoices: parseInt(row.total_invoices, 10), 
      total_amount: parseFloat(row.total_amount).toFixed(2), 
    }));

    handleResponse(res, 200, "Invoice status breakdown fetched successfully", {
      status_breakdown: statusBreakdown,
    });
  } catch (error) {
    console.error("ERROR: Failed to fetch invoice status breakdown", error);
    next(error);
  }
};

// 2️⃣ Total Invoice with its total amount (excluding canceled status)
export const getTotalInvoicesWithAmount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
      SELECT
        COUNT(*) AS total_invoices,  
        SUM(total_amount) AS total_amount  
      FROM invoices
      WHERE status != 'canceled'; 
    `;

    const result = await pool.query(query);

    const totalInvoices = result.rows[0].total_invoices;
    const totalAmount = parseFloat(result.rows[0].total_amount).toFixed(2); // Formatting total amount to 2 decimal places

    handleResponse(
      res,
      200,
      "Total invoices with total amount (excluding canceled invoices) fetched successfully",
      {
        total_invoices: totalInvoices,
        total_amount: totalAmount,
      }
    );
  } catch (error) {
    console.error(
      "ERROR: Failed to fetch total invoices with amount (excluding canceled invoices)",
      error
    );
    next(error);
  }
};

// 3️⃣  Invoice Payment Status (Paid vs Sent(unpaid))
export const getInvoicePaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
        SELECT
          status,  
          COUNT(*) AS total_invoices,  
          SUM(total_amount) AS total_amount 
        FROM invoices
        WHERE status IN ('paid', 'sent')  
        GROUP BY status;
      `;

    const result = await pool.query(query);

    const statusBreakdown = result.rows.reduce((acc: any, row: any) => {
      if (row.status === "paid") {
        acc.paid = {
          total_invoices: row.total_invoices,
          total_amount: parseFloat(row.total_amount).toFixed(2),
        };
      } else if (row.status === "sent") {
        acc.sent = {
          total_invoices: row.total_invoices,
          total_amount: parseFloat(row.total_amount).toFixed(2),
        };
      }
      return acc;
    }, {});

    handleResponse(
      res,
      200,
      "Invoice payment status (Paid vs Sent) fetched successfully",
      statusBreakdown
    );
  } catch (error) {
    console.error("ERROR: Failed to fetch invoice payment status", error);
    next(error);
  }
};

// 4️⃣  Invoice Trends Over Time
export const getInvoiceTrendsOverTime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
        SELECT
          TO_CHAR(DATE_TRUNC('month', issued_date), 'YYYY-MM') AS month,
          COUNT(*) AS total_invoices, 
          SUM(total_amount) AS total_amount  
        FROM invoices
        WHERE status != 'canceled'  
        GROUP BY month
        ORDER BY month; 
      `;

    const result = await pool.query(query);
    console.log(result.rows);
    const trends = result.rows.map((row: any) => ({
      month: row.month,
      total_invoices: row.total_invoices,
      total_amount: parseFloat(row.total_amount).toFixed(2),
    }));

    handleResponse(
      res,
      200,
      "Invoice trends over time fetched successfully",
      trends
    );
  } catch (error) {
    console.error("ERROR: Failed to fetch invoice trends over time", error);
    next(error);
  }
};
