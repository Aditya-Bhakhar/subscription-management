export interface Expense {
    id: string;
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
  
  export interface CreateExpenseDTO {
    expense_name: string;
    provider_name: string;
    amount: number;
    status: "active" | "pending" | "expired" | "canceled";
    purchased_date: string; 
    renewal_date?: string | null;
    notes?: string; 
  }
  
  export interface UpdateExpenseDTO {
    expense_name?: string;
    provider_name?: string;
    amount?: number;
    status?: "active" | "pending" | "expired" | "canceled";
    purchased_date?: string; 
    renewal_date?: string | null;
    notes?: string; 
  }
  
  export interface ApiResponse {
    status: number;
    message: string;
    data: {
      pagination: {
        page: number;
        limit: number;
        totalExpenses: number;
        totalPages: number;
      };
      expenses: Expense[];
    };
  }
  