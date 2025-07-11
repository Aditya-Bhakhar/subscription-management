// src/middlewares/authMiddleware.ts

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { handleResponse } from "../services/responseHandler.js";
import dotenv from "dotenv";
dotenv.config();

declare module "jsonwebtoken" {
  export interface JwtPayload {
    id: number;
    email: string;
    role: string;
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");
  const userToken =
    req.cookies.authToken ||
    (authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null);
  if (!userToken)
    return handleResponse(res, 401, "Access Denied... No Token Provided...");

  try {
    const secretKey = process.env.JWT_SECRET as string;
    if (!secretKey) throw new Error("JWT_SECRET is missing in .env file");
    const decodedToken = jwt.verify(userToken, secretKey) as JwtPayload;
    req.user = decodedToken;
    next();
  } catch (error) {
    return handleResponse(
      res,
      403,
      "Invalid or expired token... Please try again to refresh the token..."
    );
  }
};

export const checkRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return handleResponse(res, 401, "You must be logged in");
    const user = req.user as JwtPayload;
    if (!roles.includes(user.role))
      return handleResponse(res, 403, "Forbidden: Insufficient permissions");
    next();
  };
};
