// src/jobs/trashoutActivityLogs.ts

import pool from "../db/pool.js";
import cron from "node-cron";

const trashoutActivityLogs = async () => {
  console.log("Trashing request logs...");
  try {
    const delete_query = `DELETE FROM activity_logs WHERE timestamp < NOW() - INTERVAL '1 day'`;
    await pool.query(delete_query);
    console.log("Old request logs cleaned up...");
  } catch (error) {
    console.error("Error trashing request logs:", error);
  }
};

cron.schedule("0 * * * *", trashoutActivityLogs); // every hour at 0 minute

export default trashoutActivityLogs;