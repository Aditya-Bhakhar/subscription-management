// src/controllers/itemSunscriptionAnalysisController.tsx

import { Request, Response, NextFunction } from "express";
import pool from "../db/pool.js";
import { handleResponse } from "../services/responseHandler.js";

// 1️⃣ Total Items Subscribed Over Time
export const getTotalItemsSubscribedOverTime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
        SELECT 
          DATE_TRUNC('month', si.created_at) AS month,
          COUNT(*) AS total_items_subscribed
        FROM subscription_items si
        GROUP BY month
        ORDER BY month;
      `;

    const result = await pool.query(query);

    handleResponse(
      res,
      200,
      "Total items subscribed over time fetched successfully",
      result.rows
    );
  } catch (error) {
    console.error(
      "ERROR: Failed to fetch total items subscribed over time",
      error
    );
    next(error);
  }
};

// 2️⃣ Top Subscribed Items
export const getTopSubscribedItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 10 } = req.query; // Default limit to 10 if not provided
    const query = `
        SELECT 
          i.name AS item_name,
          COUNT(si.item_id) AS total_subscriptions
        FROM subscription_items si
        JOIN items i ON si.item_id = i.id
        GROUP BY i.name
        ORDER BY total_subscriptions DESC
        LIMIT $1;
      `;

    const result = await pool.query(query, [limit]);

    handleResponse(
      res,
      200,
      "Top subscribed items fetched successfully",
      result.rows
    );
  } catch (error) {
    console.error("ERROR: Failed to fetch top subscribed items", error);
    next(error);
  }
};

// 3️⃣ Top Item-wise Revenue Contribution
export const getTopItemWiseRevenueContribution = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 10 } = req.query;
    const query = `
        SELECT 
          i.name AS item_name,
          SUM(i.price * si.quantity)::FLOAT AS total_revenue
        FROM subscription_items si
        JOIN items i ON si.item_id = i.id
        GROUP BY i.name
        ORDER BY total_revenue DESC LIMIT $1;
      `;

    const result = await pool.query(query, [limit]);

    handleResponse(
      res,
      200,
      "Item-wise revenue contribution fetched successfully",
      result.rows
    );
  } catch (error) {
    console.error(
      "ERROR: Failed to fetch item-wise revenue contribution",
      error
    );
    next(error);
  }
};

// 4️⃣ Monthly Subscribed Items Trend
export const getMonthlySubscribedItemsTrend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
        SELECT 
          TO_CHAR(s.created_at, 'YYYY-MM') AS month,
          COUNT(si.id) AS total_items_subscribed
        FROM subscription_items si
        JOIN subscriptions s ON si.subscription_id = s.id
        GROUP BY month
        ORDER BY month ASC;
      `;

    const result = await pool.query(query);

    handleResponse(
      res,
      200,
      "Monthly subscribed items trend fetched successfully",
      result.rows
    );
  } catch (error) {
    console.error(
      "ERROR: Failed to fetch monthly subscribed items trend",
      error
    );
    next(error);
  }
};

// 5️⃣ Item Usage by Top Plan
export const getItemUsageByTopPlans = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    const query = `
            SELECT 
                sp.name AS plan_name,
                i.name AS item_name,
                SUM(si.quantity)::INTEGER AS total_quantity
            FROM subscription_items si
            JOIN subscriptions s ON si.subscription_id = s.id
            JOIN subscription_plans sp ON s.plan_id = sp.id
            JOIN items i ON si.item_id = i.id
            WHERE sp.id IN (
                SELECT sp.id
                FROM subscription_plans sp
                JOIN subscriptions s ON s.plan_id = sp.id
                GROUP BY sp.id
                ORDER BY COUNT(s.id) DESC
                LIMIT $1
            )
            GROUP BY sp.name, i.name
            ORDER BY sp.name, total_quantity DESC;
        `;
    const result = await pool.query(query, [limit]);

    res.status(200).json({
      status: 200,
      message: "Item usage by top plans fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching item usage by plan:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

// 1. Total Items Subscribed Over Time
// 2. Top Subscribed Items
// 3. Item-wise Revenue Contribution
// 4. Monthly Subscribed Items Trend
// 5. Item Usage by Plan
