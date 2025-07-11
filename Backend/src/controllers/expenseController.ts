// src/controllers/expenseController.ts

import { NextFunction, Request, Response } from "express";
import {
  createExpenseService,
  deleteExpenseByIdService,
  getAllExpensesService,
  getExpenseByExpenseAndProviderNameService,
  getExpenseByIdService,
  patchUpdateExpenseByIdService,
  putUpdateExpenseByIdService,
} from "../services/expenseService.js";
import { handleResponse } from "../services/responseHandler.js";

export const createExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    expense_name,
    provider_name,
    amount,
    status,
    purchased_date,
    renewal_date,
    notes,
  } = req.body;
  try {
    if (
      !expense_name ||
      !provider_name ||
      !amount ||
      !status ||
      !purchased_date
    ) {
      throw new Error("All fields are required");
    }
    const user = await getExpenseByExpenseAndProviderNameService(
      expense_name,
      provider_name
    );
    if (user) {
      handleResponse(
        res,
        400,
        "Expense already exists with this expnese_name and provider_name!!!"
      );
    }
    const createdExpense = await createExpenseService({
      expense_name,
      provider_name,
      amount,
      status,
      purchased_date,
      renewal_date: renewal_date ?? null,
      notes,
    });
    handleResponse(res, 201, "Expense created successfully...", {
      expense: createdExpense,
    });
  } catch (error) {
    console.error("ERROR: Error creating expense controller: ", error);
    next(error);
  }
};

export const getAllExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const sortBy = (req.query.sortby as string) || "updated_at";
    const order = (req.query.order as string) || "desc";
    const { expenses, totalExpenses } = await getAllExpensesService(
      page,
      limit,
      sortBy,
      order
    );
    const totalPages = Math.ceil(totalExpenses / limit);
    const pagination = { page, limit, totalExpenses, totalPages };
    handleResponse(res, 200, "All Expenses fetched successfully...", {
      expenses,
      pagination,
    });
  } catch (error) {
    console.error("ERROR: Error getting all expenses controller: ", error);
    next(error);
  }
};

export const getExpenseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "Expense ID is required");
    const expense = await getExpenseByIdService(id);
    if (!expense) return handleResponse(res, 404, "Expense not found");
    handleResponse(res, 200, "Expense retrieved successfully...", {
      expense,
    });
  } catch (error) {
    console.error("ERROR: Error getting expense by id controller: ", error);
    next(error);
  }
};

export const putUpdateExpenseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const {
      expense_name,
      provider_name,
      amount,
      status,
      purchased_date,
      renewal_date,
      notes,
    } = req.body;
    if (!id) return handleResponse(res, 400, "Id is required");
    const expense = await getExpenseByIdService(id);
    if (!expense) return handleResponse(res, 404, "Expense not found");
    const updatedExpense = await putUpdateExpenseByIdService(
      id,
      expense_name,
      provider_name,
      amount,
      status,
      purchased_date,
      renewal_date,
      notes
    );
    handleResponse(res, 200, "Expense put updated successfully...", {
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("ERROR: Error put updatedating expense: ", error);
    next(error);
  }
};

export const patchUpdateExpenseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "Id is required!");
    const expense = await getExpenseByIdService(id);
    if (!expense) return handleResponse(res, 404, "Expense not found!");
    const updates = req.body;
    const updatedExpense = await patchUpdateExpenseByIdService(id, updates);
    handleResponse(res, 200, "Expense patch updated successfully...", {
      expense: updatedExpense,
    });
  } catch (error) {
    console.log("ERROR: Error patch updating expense: ", error);
    next(error);
  }
};

export const deleteExpenseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "Expense ID is required");
    const expense = await getExpenseByIdService(id);
    if (!expense) return handleResponse(res, 404, "Expense not found");
    const deletedExpense = await deleteExpenseByIdService(id);
    handleResponse(res, 200, "Expense deleted successfully...", {
      expense: deletedExpense,
    });
  } catch (error) {
    console.error("ERROR: Error deleting expense: ", error);
    next(error);
  }
};
