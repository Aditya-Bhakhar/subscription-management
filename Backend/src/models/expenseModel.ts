// src/models/expenseModel.ts

import pool from "../db/pool.js";
import { Expense } from "../types/Expense.js";

export const createExpenseModel = async (
  expense: Expense
): Promise<Expense> => {
  try {
    const insert_query = `
        INSERT INTO expenses (expense_name, provider_name, amount, status, purchased_date, renewal_date, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;
    const values = [
      expense.expense_name,
      expense.provider_name,
      expense.amount,
      expense.status,
      expense.purchased_date,
      expense.renewal_date,
      expense.notes,
    ];
    const { rows } = await pool.query(insert_query, values);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Failed to create expense model: ", error);
    throw error;
  }
};

export const getAllExpensesModel = async (
  page: number,
  limit: number,
  sortBy: string,
  order: string
): Promise<{
  expenses: Expense[];
  totalExpenses: number;
}> => {
  try {
    const offset = (page - 1) * limit;
    const validSortColumns = [
      "id",
      "expense_name",
      "provider_name",
      "amount",
      "status",
      "purchased_date",
      "renewal_date",
      "notes",
      "created_at",
      "updated_at",
    ];

    const validOrders = ["asc", "desc"];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "id";
    const sortOrder = validOrders.includes(order.toLowerCase()) ? order : "asc";
    const select_query = `SELECT * FROM expenses ORDER BY ${sortColumn} ${sortOrder} LIMIT $1 OFFSET $2`;
    const { rows: expenses } = await pool.query(select_query, [limit, offset]);
    const count_query = `SELECT count(*) FROM expenses`;
    const { rows } = await pool.query(count_query);
    const totalExpenses = parseInt(rows[0].count, 10);
    return {
      expenses,
      totalExpenses,
    };
  } catch (error) {
    console.error("ERROR: Failed to get all expenses model: ", error);
    throw error;
  }
};

export const getExpenseByExpenseAndProviderNameModel = async (
  expense_name: string,
  provider_name: string
): Promise<Expense | null> => {
  try {
    const select_query = "SELECT * FROM expenses WHERE expense_name = $1 AND provider_name = $2";
    const { rows } = await pool.query(select_query, [expense_name, provider_name]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("ERROR: Failed to get expense by expense_name and provider_name: ", error);
    throw error;
  }
};

export const getExpenseByIdModel = async (id: string): Promise<Expense> => {
  try {
    const select_query = "SELECT * FROM expenses WHERE id = $1";
    const { rows } = await pool.query(select_query, [id]);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Failed to get expense by id: ", error);
    throw error;
  }
};

export const putUpdateExpenseByIdModel = async (
  id: string,
  expense_name: string,
  provider_name: string,
  amount: number,
  status: string,
  purchased_date: Date,
  renewal_date: Date,
  notes: string
): Promise<Expense> => {
  try {
    console.log("🔍 renewal_date before DB update:", renewal_date);
    console.log("🔍 Type of renewal_date:", typeof renewal_date);
    const renewalDateValue = renewal_date ? renewal_date : null;

    const update_query = `
        UPDATE expenses SET expense_name=$1, provider_name=$2, amount=$3, status=$4, purchased_date=$5, renewal_date=$6, notes=$7
        WHERE id=$8 
        RETURNING *
    `;
    const values = [
      expense_name,
      provider_name,
      amount,
      status,
      purchased_date,
      renewalDateValue,
      notes,
      id,
    ];
    const { rows } = await pool.query(update_query, values);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Failed to put update expense by id: ", error);
    throw error;
  }
};

export const patchUpdateExpenseByIdModel = async (
  id: string,
  updates: Partial<Expense>
): Promise<Expense> => {
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
          UPDATE expenses SET 
          ${fields.join(", ")}
          WHERE id=$${index} 
          RETURNING *
      `;
    const { rows } = await pool.query(update_query, values);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Failed to patch update expense by id: ", error);
    throw error;
  }
};

export const deleteExpenseByIdModel = async (id: string): Promise<Expense> => {
  try {
    const delete_query = `DELETE FROM expenses WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(delete_query, [id]);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Error deleting expense model: ", error);
    throw error;
  }
};
