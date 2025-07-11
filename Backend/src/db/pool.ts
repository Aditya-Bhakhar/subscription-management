// src/db/pool.ts

import dotenv from "dotenv";
dotenv.config();
import pg from "pg";

const { Pool } = pg;

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
});

pool
  .connect()
  .then((client) => {
    console.log("Database connection established successfully...");
    client.release();
  })
  .catch((err) => console.error("Database connection error:", err));

export default pool;
