// src/services/expenseService.ts

import {
  createExpenseModel,
  deleteExpenseByIdModel,
  getAllExpensesModel,
  getExpenseByExpenseAndProviderNameModel,
  getExpenseByIdModel,
  patchUpdateExpenseByIdModel,
  putUpdateExpenseByIdModel,
} from "../models/expenseModel.js";
import { Expense } from "../types/Expense.js";

export const createExpenseService = async (expense: Expense) => {
  const newExpense = await createExpenseModel(expense);
  return newExpense;
};

export const getAllExpensesService = async (
  page: number,
  limit: number,
  sortBy: string,
  order: string
) => {
  const expenses = await getAllExpensesModel(page, limit, sortBy, order);
  return expenses;
};

export const getExpenseByExpenseAndProviderNameService = async (
  expense_name: string,
  provider_name: string
) => {
  const expense = await getExpenseByExpenseAndProviderNameModel(
    expense_name,
    provider_name
  );
  return expense;
};

export const getExpenseByIdService = async (id: string) => {
  const expense = await getExpenseByIdModel(id);
  return expense;
};

export const putUpdateExpenseByIdService = async (
  id: string,
  expense_name: string,
  provider_name: string,
  amount: number,
  status: string,
  purchased_date: Date,
  renewal_date: Date,
  notes: string
) => {
  const updatedExpense = await putUpdateExpenseByIdModel(
    id,
    expense_name,
    provider_name,
    amount,
    status,
    new Date(purchased_date),
    new Date(renewal_date),
    notes
  );
  return updatedExpense;
};

export const patchUpdateExpenseByIdService = async (
  id: string,
  updates: Partial<Expense>
) => {
  const updatedExpense = await patchUpdateExpenseByIdModel(id, updates);
  return updatedExpense;
};

export const deleteExpenseByIdService = async (id: string) => {
  const deletedExpense = await deleteExpenseByIdModel(id);
  return deletedExpense;
};
