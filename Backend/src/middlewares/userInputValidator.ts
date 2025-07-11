// src/middlewares/userInputValidator.ts

import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { handleResponse } from "../services/responseHandler.js";

const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleResponse(res, 400, "Invalid input", {
      errors: errors.array(),
    });
    //   return res.status(400).json({ status: 400, errors: errors.array() });
  }
  next();
};

export const validateCreateUser = [
  body("firstname")
    .notEmpty()
    .isLength({ min: 2, max: 10 })
    .withMessage(
      "Firstname is required and must be in between 2 and 10 characters"
    ),
  body("lastname")
    .notEmpty()
    .isLength({ min: 2, max: 10 })
    .withMessage(
      "Lastname is required and must be in between 2 and 10 characters"
    ),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[A-Za-z]/)
    .withMessage("Password must contain at least one letter"),
  body("role")
    .notEmpty()
    .custom((value) => ["admin", "finance"].includes(value.toLowerCase()))
    .withMessage("Invalid role"),
  body("profilePicture")
    .optional()
    .custom((value, { req }) => {
      if (!req.file) return true;
      return req.file.mimetype.startsWith("image/");
    })
    .withMessage("Profile picture must be an image"),
  handleValidationErrors,
];

export const validatePutUpdateUser = [
  body("firstname")
    .notEmpty()
    .isLength({ min: 2, max: 10 })
    .withMessage(
      "Firstname is required and must be between 2 and 10 characters"
    ),
  body("lastname")
    .notEmpty()
    .isLength({ min: 2, max: 10 })
    .withMessage(
      "Lastname is required and must be between 2 and 10 characters"
    ),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[A-Za-z]/)
    .withMessage("Password must contain at least one letter"),
  body("role")
    .optional()
    .custom((value) => ["admin", "finance"].includes(value.toLowerCase()))
    .withMessage("Invalid role"),
  body("profilePicture")
    .optional()
    .custom((value, { req }) => {
      if (!req.file) return true;
      return ["image/jpg", "image/jpeg", "image/png", "image/webp"].includes(
        req.file.mimetype
      );
    })
    .withMessage("Profile picture must be a JPG, JPEG, PNG, or WEBP image"),
  handleValidationErrors,
];

export const validatePatchUpdateUser = [
  body("firstname")
    .optional()
    .isLength({ min: 2, max: 10 })
    .withMessage(
      "Firstname cannot be empty and must be between 2 and 10 characters"
    ),
  body("lastname")
    .optional()
    .isLength({ min: 2, max: 10 })
    .withMessage(
      "Lastname cannot be empty and must be between 2 and 10 characters"
    ),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[A-Za-z]/)
    .withMessage("Password must contain at least one letter"),
  body("role")
    .optional()
    .custom((value) => ["admin", "finance"].includes(value.toLowerCase()))
    .withMessage("Invalid role"),
  body("profilePicture")
    .optional()
    .custom((value, { req }) => {
      if (!req.file) return true;
      return ["image/jpg", "image/jpeg", "image/png", "image/webp"].includes(
        req.file.mimetype
      );
    })
    .withMessage("Profile picture must be a JPG, JPEG, PNG, or WEBP image"),
  handleValidationErrors,
];
