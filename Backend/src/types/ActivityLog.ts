// src/types/ActivityLog.ts

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  ip_address?: string;
  timestamp: Date;
}
