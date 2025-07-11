// src/middlewares/subscriptionPlanValidator.ts

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

export const validateCreateSubscriptionPlan = [
  body("name")
    .notEmpty()
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "SubscriptionPlan name is required and must be between 2 and 50 characters"
    ),
  body("description")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Description can be a maximum of 100 characters"),
  body("status")
    .notEmpty()
    .isIn(["active", "inactive"])
    .withMessage(
      "Status is required and must be either 'active' or 'inactive'"
    ),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage("Price must be a valid decimal number up to 2 decimal places"),
  body("duration_days")
    .notEmpty()
    .withMessage("Duration is required")
    .isInt({ min: 0, max: 999999 })
    .withMessage("Duration must be a valid integer"),
  body("features")
    .notEmpty()
    .withMessage("Features are required")
    .isArray()
    .withMessage("Features must be an array of strings")
    .custom((features) =>
      features.every((feature: string[]) => typeof feature === "string")
    )
    .withMessage("Each feature must be a string"),
  handleValidationErrors,
];

export const validatePutUpdateSubscriptionPlan = [
  body("name")
    .notEmpty()
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "SubscriptionPlan name is required and must be between 2 and 50 characters"
    ),
  body("description")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Description can be a maximum of 100 characters"),
  body("status")
    .notEmpty()
    .isIn(["active", "inactive"])
    .withMessage(
      "Status is required and must be either 'active' or 'inactive'"
    ),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage("Price must be a valid decimal number up to 2 decimal places"),
  body("duration_days")
    .notEmpty()
    .withMessage("Duration is required")
    .isInt({ min: 0, max: 999999 })
    .withMessage("Duration must be a valid integer"),
  body("features")
    .notEmpty()
    .withMessage("Features are required")
    .isArray()
    .withMessage("Features must be an array of strings")
    .custom((features) =>
      features.every((feature: string[]) => typeof feature === "string")
    )
    .withMessage("Each feature must be a string"),
  handleValidationErrors,
];

export const validatePatchUpdateSubscriptionPlan = [
  body("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("SubscriptionPlan name must be between 2 and 50 characters"),
  body("description")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Description can be a maximum of 100 characters"),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage(
      "Status is required and must be either 'active' or 'inactive'"
    ),
  body("price")
    .optional()
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage("Price must be a valid decimal number up to 2 decimal places"),
  body("duration_days")
    .optional()
    .isInt({ min: 0, max: 999999 })
    .withMessage("Duration must be a valid integer"),
  body("features")
    .optional()
    .isArray()
    .withMessage("Features must be an array of strings")
    .custom((features) =>
      features.every((feature: string[]) => typeof feature === "string")
    )
    .withMessage("Each feature must be a string"),
  handleValidationErrors,
];
