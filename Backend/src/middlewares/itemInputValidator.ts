// src/middlewares/itemInputValidator.ts

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
  }
  next();
};

export const validateCreateItem = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 15 }),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must be at most 500 characters"),
  body("category")
    .notEmpty()
    .custom((value) => ["service", "product"].includes(value.toLowerCase()))
    .withMessage("Invalid category"),
  body("price")
    .notEmpty()
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("quantity")
    .optional()
    .isNumeric()
    .withMessage("Quantity must be a number"),
  handleValidationErrors,
];

export const validatePutUpdateItem = [
  body("name")
    .notEmpty()
    .isLength({ min: 2, max: 15 })
    .withMessage(
      "Name must be at least 2 characters and at most 15 characters"
    ),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must be at most 500 characters"),
  body("category")
    .custom((value) => ["Service", "Product"].includes(value.toLowerCase()))
    .withMessage("Invalid category"),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("quantity")
    .optional()
    .isNumeric()
    .withMessage("Quantity must be a number"),
  handleValidationErrors,
];

export const validatePatchUpdateItem = [
  body("name")
    .optional()
    .isLength({ min: 2, max: 15 })
    .withMessage(
      "Name must be at least 2 characters and at most 15 characters"
    ),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must be at most 500 characters"),
  body("category")
    .custom((value) => ["service", "product"].includes(value.toLowerCase()))
    .withMessage("Invalid category"),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("quantity")
    .optional()
    .isNumeric()
    .withMessage("Quantity must be a number"),
  handleValidationErrors,
];
