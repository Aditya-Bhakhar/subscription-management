// src/controllers/filteredIController.ts

import { NextFunction, Request, Response } from "express";
import pool from "../db/pool.js";

export const getFilteredInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, customer_name, plan_name } = req.query;

    const whereClauses = [];
    const values: any[] = [];

    if (status) {
      values.push(status);
      whereClauses.push(`status = $${values.length}`);
    }

    if (customer_name) {
      values.push(customer_name);
      whereClauses.push(`customer_name = $${values.length}`);
    }

    if (plan_name) {
      values.push(plan_name);
      whereClauses.push(`plan_name = $${values.length}`);
    }

    // if (start_date) {
    //   values.push(start_date);
    //   whereClauses.push(`issued_date >= $${values.length}`);
    // }

    // if (end_date) {
    //   values.push(end_date);
    //   whereClauses.push(`issued_date <= $${values.length}`);
    // }

    const whereQuery =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const query = `
        SELECT *
        FROM invoices
        ${whereQuery}
        ORDER BY issued_date DESC
      `;

    const result = await pool.query(query, values);

    res.status(200).json({
      status: 200,
      message: "Filtered invoices fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("ERROR fetching filtered invoices:", error);
    next(error);
  }
};

// if (search) {
//   values.push(`%${search}%`);
//   whereClauses.push(`invoice_number ILIKE $${values.length}`);
// }

// const limit = parseInt(req.query.limit as string) || 10;
// const offset = parseInt(req.query.offset as string) || 0;

// const finalQuery = `
//   SELECT * FROM invoices
//   ${whereQuery}
//   ORDER BY issued_date DESC
//   LIMIT ${limit} OFFSET ${offset}
// `;
