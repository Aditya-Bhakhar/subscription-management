// src/routes/expense.routes.ts

import { Router } from "express";
import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  putUpdateExpenseById,
  patchUpdateExpenseById,
  deleteExpenseById,
} from "../controllers/expenseController.js";
import {
  validateCreateExpense,
  validatePatchUpdateExpense,
  validatePutUpdateExpense,
} from "../middlewares/expenseInputValidator.js";

const router = Router();

router.post("/", validateCreateExpense, createExpense);
router.get("/", getAllExpenses);
router.get("/:id", getExpenseById);
router.put("/:id", validatePutUpdateExpense, putUpdateExpenseById);
router.patch("/:id", validatePatchUpdateExpense, patchUpdateExpenseById);
router.delete("/:id", deleteExpenseById);

export default router;
