// src/services/responseHandler.ts

import { Response } from "express";

export const handleResponse = (
  res: Response,
  status: number,
  message: string,
  data?: any
) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};
