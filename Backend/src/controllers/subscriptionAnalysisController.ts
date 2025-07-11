// src/controllers/subscriptionAnalysisController.ts

import { Request, Response, NextFunction } from "express";
import pool from "../db/pool.js";
import { handleResponse } from "../services/responseHandler.js";

// 1️⃣ Total Subscriptions Breakdown
export const getTotalSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
        SELECT 
          status, 
          COUNT(*) AS count
        FROM subscriptions
        GROUP BY status;
      `;
    const result = await pool.query(query);
    const formattedData: Record<string, number> = result.rows.reduce(
      (acc, row) => {
        acc[row.status] = Number(row.count);
        return acc;
      },
      {} as Record<string, number>
    );
    // Compute total subscriptions
    const totalSubscriptions = Object.values(formattedData).reduce(
      (sum, num) => sum + num,
      0
    );
    // Respond with structured data
    handleResponse(res, 200, "Total subscriptions fetched successfully", {
      totalSubscriptions,
      breakdown: formattedData,
    });
  } catch (error) {
    console.error("ERROR: Failed to fetch total subscriptions:", error);
    next(error);
  }
};

// 2️⃣ New Subscriptions in Given Period
export const getNewSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { startDate, endDate } = req.query;
  if (typeof startDate !== "string" || typeof endDate !== "string") {
    return handleResponse(res, 400, "Start and end dates are required");
  }
  startDate = new Date(startDate).toISOString();
  endDate = new Date(endDate).toISOString();
  if (!startDate || !endDate) {
    return handleResponse(res, 400, "Start and end dates are required");
  }
  try {
    const query = `
        SELECT COUNT(*) AS new_subscriptions 
        FROM subscriptions 
        WHERE start_date BETWEEN $1 AND $2;
      `;
    const result = await pool.query(query, [startDate, endDate]);
    handleResponse(
      res,
      200,
      "New subscriptions fetched successfully",
      result.rows[0]
    );
  } catch (error) {
    console.error("ERROR: Failed to fetch new subscriptions:", error);
    next(error);
  }
};

// 3️⃣ Renewal vs. Cancellations (Churn Rate)
export const getRenewalsVsCancellations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
        SELECT 
          (SELECT COUNT(*) FROM subscriptions WHERE status = 'renewed') AS renewals,
          (SELECT COUNT(*) FROM subscriptions WHERE status = 'canceled') AS cancellations;
      `;
    const result = await pool.query(query);
    handleResponse(
      res,
      200,
      "Renewals vs Cancellations fetched successfully",
      result.rows[0]
    );
  } catch (error) {
    console.error("ERROR: Failed to fetch renewals vs cancellations:", error);
    next(error);
  }
};

// 4️⃣ Monthly Revenue Trends
export const getMonthlyRevenue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
        SELECT 
          TO_CHAR(start_date, 'YYYY-MM') AS month,
          SUM(sp.price) AS total_revenue
        FROM subscriptions s
        JOIN subscription_plans sp ON s.plan_id = sp.id
        WHERE s.status = 'active'
        GROUP BY month
        ORDER BY month;
      `;
    const result = await pool.query(query);
    handleResponse(
      res,
      200,
      "Monthly revenue trends fetched successfully",
      result.rows
    );
  } catch (error) {
    console.error("ERROR: Failed to fetch monthly revenue:", error);
    next(error);
  }
};

// 5️⃣ Plan Popularity (Most Subscribed Plans)
export const getPlanPopularity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
        SELECT 
          sp.name AS plan_name,
          COUNT(s.id) AS total_subscriptions
        FROM subscriptions s
        JOIN subscription_plans sp ON s.plan_id = sp.id
        GROUP BY sp.name
        ORDER BY total_subscriptions DESC;
      `;
    const result = await pool.query(query);
    const formattedData = result.rows.reduce(
      (acc: Record<string, string>, row) => {
        acc[row.plan_name] = row.total_subscriptions;
        return acc;
      },
      {}
    );
    handleResponse(
      res,
      200,
      "Plan popularity fetched successfully",
      formattedData
    );
  } catch (error) {
    console.error("ERROR: Failed to fetch plan popularity:", error);
    next(error);
  }
};

// 6️⃣ Subscription Growth Rate
export const getSubscriptionGrowthRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
        SELECT 
          TO_CHAR(start_date, 'YYYY-MM') AS month,
          COUNT(id) AS total_subscriptions
        FROM subscriptions
        GROUP BY month
        ORDER BY month;
      `;
    const result = await pool.query(query);
    handleResponse(
      res,
      200,
      "Subscription growth rate fetched successfully",
      result.rows
    );
  } catch (error) {
    console.error("ERROR: Failed to fetch subscription growth:", error);
    next(error);
  }
};
