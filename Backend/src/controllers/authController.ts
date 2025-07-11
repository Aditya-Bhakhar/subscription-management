// src/controllers/authController.ts

import { Request, Response, NextFunction } from "express";
import {
  createUserService,
  getUserByEmailService,
} from "../services/userServices.js";
import { handleResponse } from "../services/responseHandler.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { authService } from "../services/authService.js";
import logger from "../utils/logger.js";
dotenv.config();

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("🔥 Request Body:", req.body); 
    console.log("📸 File Received:", req.file);
    const { firstname, lastname, email, password, role } = req.body;
    if (!firstname || !lastname || !email || !password || !role) {
      return handleResponse(res, 400, "All fields are required");
    }
    const user = await getUserByEmailService(email);
    if (user) {
      return handleResponse(res, 400, "User already exists with this email");
    }
    console.log("File Received:", req.file);
    let profilePicture;
    if (req.file) {
      profilePicture = `/uploads/profile_pictures/${req.file.filename}`;
    }
    const createdUser = await createUserService({
      firstname,
      lastname,
      email,
      password,
      role,
      profilePicture,
    });
    handleResponse(res, 201, "User registered successfully...", {
      user: createdUser,
    });
  } catch (error) {
    console.error("ERROR: Error while registering user: ", error);
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    logger.info("🔥 loginUser controller triggered");
    logger.info("📦 Request body: " + JSON.stringify(req.body));
    logger.info("📸 File received: " + JSON.stringify(req.file));
    if (!email || !password) {
      return handleResponse(res, 400, "Email and password are required!!!");
    }
    const user = await getUserByEmailService(email);
    logger.info("🟢 User found: " + JSON.stringify(user));
    if (!user) return handleResponse(res, 401, "Invalid credentials!!!");
    const matchPassword = await bcrypt.compare(password, user.password);
    console.log("🟢 Password: " + password);
    console.log("🟢 typeof Password: " + typeof password);
    console.log("🟢 User password: " + user.password);
    console.log("🟢 typeof User password: " + typeof user.password);
    logger.info("🟢 Password match: " + matchPassword);
    if (!matchPassword)
      return handleResponse(res, 401, "Invalid credentials!!!");

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables.");
      return handleResponse(res, 500, "Internal server error.");
    }

    const token = Jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.cookie("authToken", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    await authService(email);

    handleResponse(res, 200, "Logged in successfully...", {
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("ERROR: Error while login user: ", error);
    next(error);
  }
};

export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
    });
    console.log("User logged out, cookies cleared.");
    handleResponse(res, 200, "Logged out successfully.");
  } catch (error) {
    console.error("ERROR: Error while logout user: ", error);
    next(error);
  }
};
