// src/types/Expense.ts

export interface Expense {
  id?: string;
  expense_name: string;
  provider_name: string;
  amount: number;
  status: "active" | "pending" | "expired" | "canceled";
  purchased_date: string; 
  renewal_date?: string | null;
  notes?: string; 
  created_at?: string; 
  updated_at?: string;
}
