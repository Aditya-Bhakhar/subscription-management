// src/routes/auth.routes.ts

import { Router, Request, Response } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";
import upload from "../middlewares/upload.js";
import { JwtPayload } from "jsonwebtoken";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { handleResponse } from "../services/responseHandler.js";
import {
  validateLoginUser,
  validateRegisterUser,
} from "../middlewares/authInputValidator.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload;
  }
}

const router = Router();

router.post(
  "/register",
  upload.single("profile_picture"),
  validateRegisterUser,
  registerUser
);
router.post("/login", validateLoginUser, loginUser);
router.post("/logout", logoutUser);

router.get("/me", authenticateUser, (req: Request, res: Response) => {
  console.log("User Data:", req.user);

  if (!req.user) {
    handleResponse(res, 401, "Not authenticated!!!");
    return;
  }
  handleResponse(res, 200, "Logged in...", { user: req.user });
  return;
  //   return res.json({ user: req.user });
});

export default router;
