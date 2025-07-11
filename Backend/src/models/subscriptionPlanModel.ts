// src/models/subscriptionPlanModel.ts

import pool from "../db/pool.js";
import { SubscriptionPlan } from "../types/SubscriptionPlan.js";

export const createSubscriptionPlanModel = async (
  subscription_plan: SubscriptionPlan
): Promise<SubscriptionPlan> => {
  try {
    const insert_query = `
        INSERT INTO subscription_plans (name, description, status, price, duration_days, features)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    const values = [
      subscription_plan.name,
      subscription_plan.description,
      subscription_plan.status,
      subscription_plan.price,
      subscription_plan.duration_days,
      subscription_plan.features,
    ];
    const { rows } = await pool.query(insert_query, values);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Failed to create subscription_plan model: ", error);
    throw error;
  }
};

export const getAllSubscriptionPlansModel = async (
  page: number,
  limit: number,
  sortBy: string,
  order: string
): Promise<{
  subscription_plans: SubscriptionPlan[];
  totalSubscriptionPlans: number;
}> => {
  try {
    const offset = (page - 1) * limit;
    const validSortColumns = [
      "id",
      "name",
      "description",
      "status",
      "price",
      "duration_days",
      "features",
      "created_at",
      "updated_at",
    ];

    const validOrders = ["asc", "desc"];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "id";
    const sortOrder = validOrders.includes(order.toLowerCase()) ? order : "asc";
    const select_query = `SELECT * FROM subscription_plans ORDER BY ${sortColumn} ${sortOrder} LIMIT $1 OFFSET $2`;
    const { rows: subscription_plans } = await pool.query(select_query, [limit, offset]);
    const count_query = `SELECT count(*) FROM subscription_plans`;
    const { rows } = await pool.query(count_query);
    const totalSubscriptionPlans = parseInt(rows[0].count, 10);
    return {
      subscription_plans,
      totalSubscriptionPlans,
    };
  } catch (error) {
    console.error("ERROR: Failed to get all subscription_plans model: ", error);
    throw error;
  }
};

export const getSubscriptionPlanByPlanNameModel = async (
  name: string,
): Promise<SubscriptionPlan | null> => {
  try {
    const select_query = "SELECT * FROM subscription_plans WHERE name = $1";
    const { rows } = await pool.query(select_query, [name]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("ERROR: Failed to get subscription_plan by name: ", error);
    throw error;
  }
};

export const getSubscriptionPlanByIdModel = async (id: string): Promise<SubscriptionPlan> => {
  try {
    const select_query = "SELECT * FROM subscription_plans WHERE id = $1";
    const { rows } = await pool.query(select_query, [id]);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Failed to get subscription_plan by id: ", error);
    throw error;
  }
};

export const putUpdateSubscriptionPlanByIdModel = async (
    id: string,
    name: string,
    description: string | null,
    status: "active" | "inactive",
    price: number,
    duration_days: number,
    features: string[],
): Promise<SubscriptionPlan> => {
  try {
    const update_query = `
        UPDATE subscription_plans SET name=$1, description=$2, status=$3, price=$4, duration_days=$5, features=$6 
        WHERE id=$7 
        RETURNING *
    `;
    const values = [
        name,
        description,
        status,
        price,
        duration_days,
        features,
        id,
    ];
    const { rows } = await pool.query(update_query, values);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Failed to put update subscription_plan by id: ", error);
    throw error;
  }
};

export const patchUpdateSubscriptionPlanByIdModel = async (
  id: string,
  updates: Partial<SubscriptionPlan>
): Promise<SubscriptionPlan> => {
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
          UPDATE subscription_plans SET 
          ${fields.join(", ")}
          WHERE id=$${index} 
          RETURNING *
      `;
    const { rows } = await pool.query(update_query, values);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Failed to patch update subscription_plan by id: ", error);
    throw error;
  }
};

export const deleteSubscriptionPlanByIdModel = async (id: string): Promise<SubscriptionPlan> => {
  try {
    const delete_query = `DELETE FROM subscription_plans WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(delete_query, [id]);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Error deleting subscription_plan model: ", error);
    throw error;
  }
};
