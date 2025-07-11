// src/middlewares/expenseValidator.ts

import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { handleResponse } from "../services/responseHandler.js";

const isValidDate = (value: string) => {
    const date = new Date(value);
    return !isNaN(date.getTime()); 
  };

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

export const validateCreateExpense = [
  body("expense_name")
    .notEmpty()
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "Expense name is required and must be in between 2 and 50 characters"
    ),
  body("provider_name")
    .notEmpty()
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "Provider name is required and must be in between 2 and 50 characters"
    ),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage(
      "Amount must be a valid decimal number with up to 2 decimal places"
    ),
  body("status")
    .notEmpty()
    .isIn(["active", "pending", "expired", "canceled"])
    .withMessage(
      "Status is required and must be either 'active', 'pending', 'expired', or 'canceled'"
    ),
  body("purchased_date")
    .notEmpty()
    .withMessage("Purchased date is required")
    .custom(isValidDate)
    .withMessage("Renewal date must be a valid ISO 8601 timestamp"),
  body("renewal_date")
    .optional()
    .custom(isValidDate)
    .withMessage("Renewal date must be a valid ISO 8601 timestamp"),
  body("notes")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Notes must be a string with a maximum of 500 characters"),
  handleValidationErrors,
];

export const validatePutUpdateExpense = [
  body("expense_name")
    .notEmpty()
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "Expense name is required and must be in between 2 and 50 characters"
    ),
  body("provider_name")
    .notEmpty()
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "Provider name is required and must be in between 2 and 50 characters"
    ),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage(
      "Amount must be a valid decimal number with up to 2 decimal places"
    ),
  body("status")
    .notEmpty()
    .isIn(["active", 'pending', "expired", "canceled"])
    .withMessage(
      "Status is required and must be either 'active', 'pending', 'expired', or 'canceled'"
    ),
  body("purchased_date")
    .notEmpty()
    .withMessage("Purchased date is required")
    .custom(isValidDate)
    .withMessage("Renewal date must be a valid ISO 8601 timestamp"),
  body("renewal_date")
    .optional()
    .custom(isValidDate)
    .withMessage("Renewal date must be a valid ISO 8601 timestamp"),
  body("notes")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Notes must be a string with a maximum of 500 characters"),
  handleValidationErrors,
];

export const validatePatchUpdateExpense = [
  body("expense_name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "Expense name is required and must be in between 2 and 50 characters"
    ),
  body("provider_name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "Provider name is required and must be in between 2 and 50 characters"
    ),
  body("amount")
    .optional()
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage(
      "Amount must be a valid decimal number with up to 2 decimal places"
    ),
  body("status")
    .optional()
    .isIn(["active", 'pending', "expired", "canceled"])
    .withMessage(
      "Status is required and must be either 'active', 'pending', 'expired', or 'canceled'"
    ),
  body("purchased_date")
    .optional()
    .custom(isValidDate)
    .withMessage("Renewal date must be a valid ISO 8601 timestamp"),
  body("renewal_date")
    .optional()
    .custom(isValidDate)
    .withMessage("Renewal date must be a valid ISO 8601 timestamp"),
  body("notes")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Notes must be a string with a maximum of 500 characters"),
  handleValidationErrors,
];
