// src/services/authService.ts

import { authModel } from "../models/authModel.js";

export const authService = async (email: string) => {
  return await authModel(email);
};
