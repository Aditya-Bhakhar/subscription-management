// src/models/itemModel.ts

import pool from "../db/pool.js";
import { Item } from "../types/Item.js";

export const createItemModel = async (item: Item): Promise<Item> => {
  try {
    const insert_query = `
            INSERT INTO items (name, description, category, price, quantity) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
    const values = [
      item.name,
      item.description,
      item.category,
      item.price,
      item.quantity,
    ];
    const { rows } = await pool.query(insert_query, values);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Error creating item model: ", error);
    throw error;
  }
};

export const getAllItemsModel = async (
  page: number,
  limit: number,
  sortBy: string,
  order: string
): Promise<{ items: Item[]; totalItems: number }> => {
  try {
    const offset = (page - 1) * limit;
    const validSortColumns = [
      "id",
      "name",
      "description",
      "category",
      "price",
      "quantity",
      "created_at",
      "updated_at",
      "updated_at",
    ];
    const validOrders = ["asc", "desc"];
    const sortColumn = validSortColumns.includes(sortBy)
      ? sortBy
      : "updated_at";
    const sortOrder = validOrders.includes(order.toLowerCase()) ? order : "asc";
    const select_query = `SELECT * FROM items ORDER BY ${sortColumn} ${sortOrder} LIMIT $1 OFFSET $2`;
    const { rows: items } = await pool.query(select_query, [limit, offset]);
    const count_query = `SELECT count(*) FROM items`;
    const { rows } = await pool.query(count_query);
    const totalItems = parseInt(rows[0].count, 10);
    return { items, totalItems };
  } catch (error) {
    console.error("ERROR: Error fetching all items model: ", error);
    throw error;
  }
};

export const getItemByIdModel = async (id: string): Promise<Item> => {
  try {
    const select_query = `SELECT * FROM items WHERE id=$1`;
    const { rows } = await pool.query(select_query, [id]);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Error fetching item by id model: ", error);
    throw error;
  }
};

export const getItemByNameModel = async (name: string): Promise<Item> => {
  try {
    const select_query = `SELECT * FROM items WHERE name=$1`;
    const { rows } = await pool.query(select_query, [name]);
    return rows[0];
  } catch (error) {
    console.error("ERROR: Error getting item by name model", error);
    throw error;
  }
};

export const putUpdateItemByIdModel = async (
  id: string,
  name: string,
  description: string,
  category: string,
  price: number,
  quantity: null | number
): Promise<Item> => {
  try {
    const update_query = `
        UPDATE items SET name=$1, description=$2, category=$3, price=$4, quantity=$5 
        WHERE id=$6
        RETURNING *
    `;
    const values = [name, description, category, price, quantity, id];
    const { rows } = await pool.query(update_query, values);
    return rows[0];
  } catch (error) {
    console.log("ERROR: Error put updating item by id: ", error);
    throw error;
  }
};

export const patchUpdateItemByIdModel = async (
  id: string,
  updates: Partial<Item>
) => {
  try {
    if (Object.keys(updates).length === 0) {
      throw new Error("No fields provided for update!!!");
    }
    const fields: string[] = [];
    const values: (string | number | null)[] = [];
    let index = 1;
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key}=$${index}`);
        values.push(value as string | number | null);
        index++;
      }
    });
    values.push(id);
    const update_query = `
        UPDATE items SET ${fields.join(", ")} WHERE id=$${index} RETURNING *
    `;
    const { rows } = await pool.query(update_query, values);
    return rows[0];
  } catch (error) {
    console.log("ERROR: Error patch updating item by id: ", error);
    throw error;
  }
};

export const deleteItemByIdModel = async (id: string) => {
  try {
    const delete_query = `DELETE FROM items WHERE id=$1 RETURNING *`;
    const { rows } = await pool.query(delete_query, [id]);
    return rows[0];
  } catch (error) {
    console.log("ERROR: Error deleting item by id: ", error);
    throw error;
  }
};
