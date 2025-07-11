// src/models/customerModel.ts

import pool from "../db/pool.js";
import { Customer } from "../types/Customer.js";

export const createCustomerModel = async (
  customer: Customer
): Promise<Customer> => {
  try {
    const insert_query = `
        INSERT INTO customers (firstname, lastname, email, phone_number, address)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const values = [
      customer.firstname,
      customer.lastname,
      customer.email,
      customer.phone_number,
      customer.address,
    ];
    const { rows } = await pool.query(insert_query, values);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Failed to create customer model: ", error);
    throw error;
  }
};

export const getAllCustomersModel = async (
  page: number,
  limit: number,
  sortBy: string,
  order: string
): Promise<{
  customers: Customer[];
  totalCustomers: number;
}> => {
  try {
    const offset = (page - 1) * limit;
    const validSortColumns = [
      "id",
      "firstname",
      "lastname",
      "email",
      "phone_number",
      "address",
      "registered_at",
      "updated_at",
    ];
    const validOrders = ["asc", "desc"];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "id";
    const sortOrder = validOrders.includes(order.toLowerCase()) ? order : "asc";
    const select_query = `SELECT * FROM customers ORDER BY ${sortColumn} ${sortOrder} LIMIT $1 OFFSET $2`;
    const { rows: customers } = await pool.query(select_query, [limit, offset]);
    const count_query = `SELECT count(*) FROM customers`;
    const { rows } = await pool.query(count_query);
    const totalCustomers = parseInt(rows[0].count, 10);
    return {
      customers,
      totalCustomers,
    };
  } catch (error) {
    console.error("ERROR: Failed to get all customers model: ", error);
    throw error;
  }
};

export const getCustomerByEmailModel = async (
  email: string
): Promise<Customer> => {
  try {
    const select_query = "SELECT * FROM customers WHERE email = $1";
    const { rows } = await pool.query(select_query, [email]);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Failed to get customer by email: ", error);
    throw error;
  }
};

export const getCustomerByIdModel = async (id: string): Promise<Customer> => {
  try {
    const select_query = "SELECT * FROM customers WHERE id = $1";
    const { rows } = await pool.query(select_query, [id]);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Failed to get customer by id: ", error);
    throw error;
  }
};

export const putUpdateCustomerByIdModel = async (
  id: string,
  firstname: string,
  lastname: string,
  email: string,
  phone_number: string,
  address: string
): Promise<Customer> => {
  try {
    const update_query = `
        UPDATE customers SET firstname=$1, lastname=$2, email=$3, phone_number=$4, address=$5
        WHERE id=$6 
        RETURNING *
    `;
    const values = [firstname, lastname, email, phone_number, address, id];
    const { rows } = await pool.query(update_query, values);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Failed to put update customer by id: ", error);
    throw error;
  }
};

export const patchUpdateCustomerByIdModel = async (
  id: string,
  updates: Partial<Customer>
): Promise<Customer> => {
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
          UPDATE customers SET 
          ${fields.join(", ")}
          WHERE id=$${index} 
          RETURNING *
      `;
    const { rows } = await pool.query(update_query, values);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Failed to patch update customer by id: ", error);
    throw error;
  }
};

export const deleteCustomerByIdModel = async (
  id: string
): Promise<Customer> => {
  try {
    const delete_query = `DELETE FROM customers WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(delete_query, [id]);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Error deleting customer model: ", error);
    throw error;
  }
};
