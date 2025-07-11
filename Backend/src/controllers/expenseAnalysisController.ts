// src/controllers/expenseAnalysisController.ts

import { Request, Response, NextFunction } from "express";
import pool from "../db/pool.js";
import { handleResponse } from "../services/responseHandler.js";

// 1️⃣ Total Expenses Over Time
export const getTotalExpensesOverTimeWithBreakdown = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
        SELECT 
          TO_CHAR(DATE_TRUNC('month', purchased_date), 'YYYY-MM') AS month,
          status,
          SUM(amount)::FLOAT AS total
        FROM expenses
        GROUP BY month, status
        ORDER BY month ASC;
      `;

    const result = await pool.query(query);

    // Step 1: Organize rows by month
    const monthlyData: Record<
      string,
      { breakdown: Record<string, number>; totalExpenses: number }
    > = {};

    result.rows.forEach((row) => {
      const { month, status, total } = row;

      if (!monthlyData[month]) {
        monthlyData[month] = {
          breakdown: {},
          totalExpenses: 0,
        };
      }

      monthlyData[month].breakdown[status] = total;
      monthlyData[month].totalExpenses += total;
    });

    // Step 2: Convert object into array for frontend
    const data = Object.entries(monthlyData).map(([month, values]) => ({
      month,
      totalExpenses: values.totalExpenses,
      breakdown: values.breakdown,
    }));

    handleResponse(
      res,
      200,
      "Total expenses over time with status breakdown fetched successfully",
      data
    );
  } catch (error) {
    console.error("ERROR: Failed to fetch expense breakdown over time", error);
    next(error);
  }
};

// 2️⃣ Expenses by Provider Category
export const getExpensesByProviderCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
        SELECT 
          provider_name AS provider,
          COUNT(*) AS count,
          SUM(amount)::FLOAT AS totalAmount
        FROM expenses
        GROUP BY provider_name
        ORDER BY totalAmount DESC;
      `;

    const result = await pool.query(query);

    handleResponse(
      res,
      200,
      "Expenses grouped by provider fetched successfully",
      result.rows
    );
  } catch (error) {
    console.error(
      "ERROR: Failed to fetch expenses by provider category",
      error
    );
    next(error);
  }
};

// 3️⃣ Recurring vs. One-Time Expenses
export const getRecurringVsOneTimeExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
        SELECT 
          CASE 
            WHEN renewal_date IS NOT NULL THEN 'recurring'
            ELSE 'oneTime'
          END AS type,
          COUNT(*) AS count,
          SUM(amount)::FLOAT AS totalAmount
        FROM expenses
        GROUP BY type;
      `;

    const result = await pool.query(query);

    // Transform into structured object
    type ExpenseType = "recurring" | "oneTime";

    const data: Record<ExpenseType, { count: number; totalAmount: number }> = {
      recurring: { count: 0, totalAmount: 0 },
      oneTime: { count: 0, totalAmount: 0 },
    };

    result.rows.forEach((row) => {
      const type = row.type as ExpenseType;
      data[type] = {
        count: Number(row.count),
        totalAmount: parseFloat(row.totalamount),
      };
    });

    handleResponse(
      res,
      200,
      "Recurring vs One-Time expenses fetched successfully",
      data
    );
  } catch (error) {
    console.error(
      "ERROR: Failed to fetch recurring vs one-time expenses",
      error
    );
    next(error);
  }
};

// 4️⃣ Top Expense Providers
export const getTopExpenseProviders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 10 } = req.query;
    const query = `
        SELECT 
          provider_name,
          COUNT(*) AS expense_count,
          SUM(amount)::FLOAT AS total_amount
        FROM expenses
        GROUP BY provider_name
        ORDER BY total_amount DESC
        LIMIT $1;
      `;

    const result = await pool.query(query, [limit]);

    handleResponse(
      res,
      200,
      "Top 5 expense providers fetched successfully",
      result.rows
    );
  } catch (error) {
    console.error("ERROR: Failed to fetch top expense providers", error);
    next(error);
  }
};

// 5️⃣ Expense vs. Revenue Comparison
export const getExpenseVsRevenueComparison = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
        SELECT
          COALESCE(DATE_TRUNC('month', e.purchased_date), DATE_TRUNC('month', i.issued_date)) AS month,
          COALESCE(SUM(e.amount), 0)::FLOAT AS total_expenses,
          COALESCE(SUM(i.total_amount), 0)::FLOAT AS total_revenue
        FROM expenses e
        FULL OUTER JOIN invoices i
          ON DATE_TRUNC('month', e.purchased_date) = DATE_TRUNC('month', i.issued_date)
        GROUP BY month
        ORDER BY month;
      `;

    const result = await pool.query(query);

    handleResponse(
      res,
      200,
      "Expense vs. revenue comparison fetched successfully",
      result.rows
    );
  } catch (error) {
    console.error(
      "ERROR: Failed to fetch expense vs. revenue comparison",
      error
    );
    next(error);
  }
};

// 6️⃣ Pending & Overdue Expenses
export const getPendingAndOverdueExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
        SELECT
          COUNT(*) FILTER (WHERE status = 'pending') AS pending_count,
          COUNT(*) FILTER (
            WHERE (status = 'pending' OR status = 'active') 
              AND renewal_date IS NOT NULL 
              AND renewal_date < NOW()
          ) AS overdue_count
        FROM expenses;
      `;

    const result = await pool.query(query);

    const { pending_count, overdue_count } = result.rows[0];

    const response = {
      pending: parseInt(pending_count),
      overdue: parseInt(overdue_count),
    };

    handleResponse(
      res,
      200,
      "Pending and overdue expenses fetched successfully",
      response
    );
  } catch (error) {
    console.error("ERROR: Failed to fetch pending & overdue expenses", error);
    next(error);
  }
};

// Total Expenses Over Time,
// Expense Categories,
// Recurring vs. One-Time Expenses,
// Top Expense Providers,
// Expense vs. Revenue Comparison,
// Pending & Overdue Expenses
