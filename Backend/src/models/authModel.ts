// src/models/authModel.ts

import pool from "../db/pool.js";
import { User } from "../types/User.js";

export const authModel = async (email: string): Promise<User> => {
  try {
    const update_query = `
        UPDATE users SET last_login_at = NOW()
        WHERE email = $1
        RETURNING *
    `;
    const { rows } = await pool.query(update_query, [email]);
    return rows[0];
  } catch (error) {
    console.log("ERROR: Error while entering auth model");
    throw error;
  }
};
