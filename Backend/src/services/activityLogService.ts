// src/services/activityLogService.ts

import { Pool } from "pg";

interface ActivityLogParams {
  userId: string;
  action: string;
  ipAddress?: string;
}

export class ActivityLogService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async logActivity({
    userId,
    action,
    ipAddress,
  }: ActivityLogParams): Promise<void> {
    const query = `
      INSERT INTO activity_logs (user_id, action, ip_address)
      VALUES ($1, $2, $3)
    `;
    
    try {
      await this.pool.query(query, [userId, action, ipAddress || null]);
    } catch (error) {
      console.error("Error logging activity:", error);
      // Log the error but don't throw - we don't want logging failures to break the app
    }
  }
}