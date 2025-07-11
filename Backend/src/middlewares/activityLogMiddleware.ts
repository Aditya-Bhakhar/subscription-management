// src/middlewares/activityLogMiddleware.ts
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ActivityLogService } from "../services/activityLogService.js";

export const createActivityLogger = (activityLogService: ActivityLogService) => {
  return (action: string | ((req: Request) => string)) => {
    return (req: Request, res: Response, next: NextFunction) => {
      // Store the original end method
      const originalEnd = res.end;
      
      // Override the end method
      res.end = function(chunk?: any, encoding?: any, callback?: any) {
        // Restore the original end method to avoid multiple calls
        res.end = originalEnd;
        
        // Only log for successful responses (2xx status codes)
        if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
          const user = req.user as JwtPayload;
          const actionStr = typeof action === "function" ? action(req) : action;
          const ipAddress = req.ip || req.socket.remoteAddress;
          
          // Don't await - fire and forget to avoid blocking response
          activityLogService.logActivity({
            userId: user.id.toString(),
            action: actionStr,
            ipAddress,
          }).catch(err => console.error("Failed to log activity:", err));
        }
        
        // Call the original end method
        return originalEnd.call(this, chunk, encoding, callback);
      };
      
      next();
    };
  };
};