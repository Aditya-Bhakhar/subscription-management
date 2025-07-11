import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ExpenseAPI } from "../api/expenses.ts";
import {
  // Expense,
  CreateExpenseDTO,
  UpdateExpenseDTO,
} from "../types/expenseTypes.ts";

export const useGetAllExpenses = () => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: ExpenseAPI.getAllExpenses,
  });
};

export const useGetExpenseById = (id: string) => {
  return useQuery({
    queryKey: ["expenses", id],
    queryFn: () => ExpenseAPI.getExpenseById(id),
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (expenseData: CreateExpenseDTO) =>
      ExpenseAPI.createExpense(expenseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};

export const usePutUpdateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      expenseData,
    }: {
      id: string;
      expenseData: UpdateExpenseDTO;
    }) => ExpenseAPI.putUpdateExpense(id, expenseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};

export const usePatchUpdateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      expenseData,
    }: {
      id: string;
      expenseData: Partial<UpdateExpenseDTO>;
    }) => ExpenseAPI.patchUpdateExpense(id, expenseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ExpenseAPI.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};
