// src/types/Invoice.ts

export interface Invoice {
  id?: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  subscription_id: string;
  plan_name: string;
  plan_price: number;
  invoice_number?: string;
  total_amount: number;
  items: {
    item_id: string;
    item_name: string;
    quantity: number;
    price_per_unit: number;
  }[];
  status?:
    | "pending"
    | "generated"
    | "sent"
    | "paid"
    | "overdue"
    | "canceled"
    | "failed"
    | "refunded";
  issued_date?: Date;
  due_date?: Date;
  pdf_url?: string | null;
  notes?: string | null;
  created_at?: Date;
  updated_at?: Date;
}
