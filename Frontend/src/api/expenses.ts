import { apiClient } from "./apiClient.ts";
import { Expense, CreateExpenseDTO, UpdateExpenseDTO, ApiResponse } from "../types/expenseTypes.ts";

const EXPENSE_ENDPOINT = "/expense";

export const ExpenseAPI = {
  getAllExpenses: async (): Promise<ApiResponse> => {
    const response = await apiClient.get(EXPENSE_ENDPOINT);
    return response.data;
  },
  getExpenseById: async (id: string): Promise<Expense> => {
    const response = await apiClient.get(`${EXPENSE_ENDPOINT}/${id}`);
    return response.data;
  },
  createExpense: async (expenseData: CreateExpenseDTO): Promise<Expense> => {
    const response = await apiClient.post(EXPENSE_ENDPOINT, expenseData);
    return response.data;
  },
  putUpdateExpense: async (id: string, expenseData: UpdateExpenseDTO): Promise<Expense> => {
    const response = await apiClient.put(`${EXPENSE_ENDPOINT}/${id}`, expenseData);
    return response.data;
  },
  patchUpdateExpense: async (
    id: string,
    expenseData: Partial<UpdateExpenseDTO>
  ): Promise<Expense> => {
    const response = await apiClient.patch(`${EXPENSE_ENDPOINT}/${id}`, expenseData);
    return response.data;
  },
  deleteExpense: async (id: string): Promise<void> => {
    await apiClient.delete(`${EXPENSE_ENDPOINT}/${id}`);
  },
};
