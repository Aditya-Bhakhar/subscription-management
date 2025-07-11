// src/controllers/customerAnalysisController.ts

import { Request, Response, NextFunction } from "express";
import pool from "../db/pool.js";
import { handleResponse } from "../services/responseHandler.js";

// 1️⃣ New Customers Over Time
export const getNewCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
        SELECT 
          DATE_TRUNC('month', registered_at) AS month, 
          COUNT(*) AS new_customers
        FROM customers
        GROUP BY month
        ORDER BY month;
      `;
    const result = await pool.query(query);
    handleResponse(res, 200, "New customers fetched successfully", result.rows);
  } catch (error) {
    console.error("ERROR: Failed to fetch new customers", error);
    next(error);
  }
};

// 2️⃣ Customer Lifetime Value (CLV)
export const getCustomerLifetimeValue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 10 } = req.query;
    const query = `
        SELECT 
          c.id, 
          c.firstname, 
          c.lastname, 
          SUM(i.total_amount) AS lifetime_value
        FROM customers c
        JOIN invoices i ON c.id = i.customer_id
        GROUP BY c.id, c.firstname, c.lastname
        ORDER BY lifetime_value DESC LIMIT $1;
      `;
    const result = await pool.query(query, [limit]);
    handleResponse(
      res,
      200,
      "Customer lifetime value fetched successfully",
      result.rows
    );
  } catch (error) {
    console.error("ERROR: Failed to fetch customer lifetime value", error);
    next(error);
  }
};

// 3️⃣ Customer Subscription Frequency
export const getSubscriptionFrequency = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 10 } = req.query;
    const query = `
        SELECT 
          c.id, 
          c.firstname, 
          c.lastname, 
          COUNT(s.id) AS subscription_count
        FROM customers c
        LEFT JOIN subscriptions s ON c.id = s.customer_id
        GROUP BY c.id, c.firstname, c.lastname
        ORDER BY subscription_count DESC LIMIT $1;
      `;
    const result = await pool.query(query, [limit]);
    handleResponse(
      res,
      200,
      "Customer subscription frequency fetched successfully",
      result.rows
    );
  } catch (error) {
    console.error(
      "ERROR: Failed to fetch customer subscription frequency",
      error
    );
    next(error);
  }
};

// 4️⃣ Customer Retention Rate
export const getCustomerRetentionRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
        SELECT 
          ROUND(
            (
              (SELECT COUNT(DISTINCT customer_id) 
               FROM subscriptions 
               WHERE status = 'renewed'
              )::numeric 
              / 
               NULLIF(
                (SELECT COUNT(DISTINCT customer_id) 
                FROM subscriptions
                )::numeric, 
                0
              )
            ) * 100, 2
          ) AS retention_rate;
      `;
    const result = await pool.query(query);
    handleResponse(
      res,
      200,
      "Customer retention rate fetched successfully",
      result.rows[0]
    );
  } catch (error) {
    console.error("ERROR: Failed to fetch customer retention rate", error);
    next(error);
  }
};
