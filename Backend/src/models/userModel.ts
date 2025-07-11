// src/models/userModel.ts

import pool from "../db/pool.js";
import { User } from "../types/User.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createUserModel = async (user: User): Promise<User> => {
  try {
    const insert_query = `INSERT INTO users (firstname, lastname, email, password, role, profile_picture) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING firstname, lastname, email, role, profile_picture, last_login_at, created_at, updated_at`;
    const values = [
      user.firstname,
      user.lastname,
      user.email,
      user.password,
      user.role,
      user.profilePicture,
    ];

    const result = await pool.query(insert_query, values);
    return result.rows[0];
  } catch (error) {
    console.log("ERROR: Failed to create user service: ", error);
    throw error;
  }
};

export const getAllUsersModel = async (
  page: number,
  limit: number,
  sortBy: string,
  order: string
): Promise<{ users: User[]; totalUsers: number }> => {
  try {
    const offset = (page - 1) * limit;
    const validSortColumns = [
      "id",
      "firstname",
      "lastname",
      "email",
      "role",
      "created_at",
    ];
    const validOrders = ["asc", "desc"];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "id";
    const sortOrder = validOrders.includes(order.toLowerCase()) ? order : "asc";

    const select_query = `SELECT id, firstname, lastname, email, role, profile_picture, last_login_at, created_at, updated_at 
      FROM users ORDER BY ${sortColumn} ${sortOrder} LIMIT $1 OFFSET $2`;
    const { rows: users } = await pool.query(select_query, [limit, offset]);
    const count_query = `SELECT count(*) FROM users`;
    const { rows } = await pool.query(count_query);
    const totalUsers = parseInt(rows[0].count, 10);
    return {
      users,
      totalUsers,
    };
  } catch (error) {
    console.log("ERROR: Failed to get all users service: ", error);
    throw error;
  }
};

export const getUserByIdModel = async (id: string): Promise<User> => {
  try {
    const select_query = `SELECT id, firstname, lastname, email, role, profile_picture, last_login_at, created_at, updated_at 
      FROM users WHERE id = $1`;
    const result = await pool.query(select_query, [id]);
    return result.rows[0];
  } catch (error) {
    console.log("ERROR: Failed to get user by id: ", error);
    throw Error;
  }
};

export const getUserByEmailModel = async (
  email: string
): Promise<User> => {
  try {
    const select_query = `SELECT * FROM users WHERE email = $1`;
    console.log("🟢 Select query:", select_query);
    console.log("🟢 Email:", email);
    const result = await pool.query(select_query, [email]);
    return result.rows[0];
  } catch (error) {
    console.error("ERROR: Error fetching user by email:", error);
    throw error;
  }
};

export const putUpdateUserByIdModel = async (
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string | null,
  role: string,
  profilePicture: string | null
): Promise<User> => {
  try {
    const userQuery = `SELECT profile_picture FROM users WHERE id=$1`;
    const { rows } = await pool.query(userQuery, [id]);
    if (rows.length === 0) {
      throw new Error("User not found");
    }
    const profilePictureOld = rows[0].profile_picture;
    console.log("🟢 Profile picture from DB:", profilePictureOld);
    if (!profilePicture || profilePicture.trim() === "") {
      profilePicture = profilePictureOld;
    }
    const update_query = `
      UPDATE users
      SET firstname=$1, lastname=$2, email=$3, password=COALESCE($4, password), role=$5, profile_picture=$6
      WHERE id=$7
      RETURNING id, firstname, lastname, email, role, profile_picture, last_login_at, created_at, updated_at
    `;
    const values = [
      firstName,
      lastName,
      email,
      password,
      role,
      profilePicture,
      id,
    ];
    const result = await pool.query(update_query, values);
    if (
      profilePicture &&
      profilePictureOld &&
      profilePicture !== profilePictureOld
    ) {
      const uploadDir = path.join(__dirname, "../../uploads/profile_pictures/");
      const filePath = path.join(uploadDir, path.basename(profilePictureOld));
      console.log("🟡 Attempting to delete:", filePath);
      if (fs.existsSync(filePath)) {
        try {
          await fs.promises.unlink(filePath);
          console.log("✅ Profile picture deleted:", filePath);
        } catch (err) {
          console.error("❌ Failed to delete profile picture:", err);
        }
      } else {
        console.warn("⚠️ Profile picture not found:", filePath);
      }
    }
    return result.rows[0];
  } catch (error) {
    console.error("Failed to put update user by ID:", error);
    throw error;
  }
};

export const patchUpdateUserByIdModel = async (
  id: string,
  updates: Partial<User>
): Promise<User> => {
  try {
    const userQuery = `SELECT profile_picture FROM users WHERE id=$1`;
    const { rows } = await pool.query(userQuery, [id]);
    if (rows.length === 0) {
      throw new Error("User not found");
    }
    const profilePictureOld = rows[0].profile_picture;
    console.log("🟢 Profile picture from DB:", profilePictureOld);
    
    const fields: string[] = [];
    const values: (string | number | boolean | Date | null)[] = [];
    let index = 1;
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbKey = key === "profilePicture" ? "profile_picture" : key;
        fields.push(`${dbKey} = $${index}`);
        values.push(value as string | number | boolean | Date | null);
        index++;
      }
    });
    if (fields.length === 0) {
      throw new Error("No fields provided for update");
    }
    values.push(id);
    const update_query = `
          UPDATE users
          SET ${fields.join(", ")}
          WHERE id=$${index}
          RETURNING id, firstname, lastname, email, role, profile_picture, created_at, updated_at
        `;
    const result = await pool.query(update_query, values);
    if (updates.profilePicture  && profilePictureOld) {
      const uploadDir = path.join(__dirname, "../../uploads/profile_pictures/");
      const filePath = path.join(uploadDir, path.basename(profilePictureOld));

      console.log("🟡 Attempting to delete old profile picture:", filePath);
      if (fs.existsSync(filePath)) {
        try {
          await fs.promises.unlink(filePath);
          console.log("✅ Profile picture deleted:", filePath);
        } catch (err) {
          console.error("❌ Failed to delete profile picture:", err);
        }
      } else {
        console.warn("⚠️ Old profile picture not found:", filePath);
      }
    }
    return result.rows[0];
  } catch (error) {
    console.error("ERROR: Failed to patch update user by ID:", error);
    throw error;
  }
};

export const deleteUserByIdModel = async (id: string): Promise<User> => {
  try {
    const userQuery = `SELECT profile_picture FROM users WHERE id=$1`;
    const { rows } = await pool.query(userQuery, [id]);
    if (rows.length === 0) {
      throw new Error("User not found");
    }
    const profilePicture = rows[0].profile_picture;
    console.log("🟢 Profile picture from DB:", profilePicture);
    const delete_query = `DELETE FROM users WHERE id = $1 
      RETURNING id, firstname, lastname, email, role, profile_picture, last_login_at, created_at, updated_at`;
    const result = await pool.query(delete_query, [id]);
    if (profilePicture) {
      const uploadDir = path.join(__dirname, "../../uploads/profile_pictures/");
      const filePath = path.join(
        uploadDir,
        "../../uploads/profile_pictures",
        path.basename(profilePicture)
      );
      console.log("🟡 Attempting to delete:", filePath);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("❌ Failed to delete profile picture:", err);
          } else {
            console.log("✅ Profile picture deleted:", filePath);
          }
        });
      } else {
        console.warn("⚠️ Profile picture not found:", filePath);
      }
    }
    return result.rows[0];
  } catch (error) {
    console.log("ERROR: Failed to delete user by id: ", error);
    throw error;
  }
};
