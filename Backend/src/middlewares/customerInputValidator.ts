// src/middlewares/customerValidator.ts

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

export const validateCreateCustomer = [
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
  body("phone_number").notEmpty().isMobilePhone("en-IN", { strictMode: false }),
  body("address").optional(),
  handleValidationErrors,
];

export const validatePutUpdateCustomer = [
  body("firstname")
    .notEmpty()
    .isLength({ min: 2, max: 10 })
    .withMessage(
      "Firstname cannot be empty and must be between 2 and 10 characters"
    ),
  body("lastname")
    .notEmpty()
    .isLength({ min: 2, max: 10 })
    .withMessage(
      "Lastname cannot be empty and must be between 2 and 10 characters"
    ),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("phone_number").optional().isMobilePhone("en-IN", { strictMode: false }),
  body("address").optional(),
  handleValidationErrors,
];

export const validatePatchUpdateCustomer = [
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
  body("phone_number").optional().isMobilePhone("en-IN", { strictMode: false }),
  body("address").optional(),
  handleValidationErrors,
];
