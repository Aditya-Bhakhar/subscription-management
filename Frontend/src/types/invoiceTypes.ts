export interface Invoice {
  id: string;
  //   customer: {
  //     customer_id: string;
  //     customer_name: string;
  //     customer_email: string;
  //   }
  customer_id: string;
  customer_name: string;
  customer_email: string;
  subscription_id: string;
  plan_name: string;
  plan_price: string;
  invoice_number?: string;
  total_amount: number;
  items: {
    item_id: string;
    item_name: string;
    quantity: number;
    price_per_unit: number;
  }[];
  status:
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

export enum InvoiceStatus {
  PENDING = "pending",
  GENERATED = "generated",
  SENT = "sent",
  PAID = "paid",
  OVERDUE = "overdue",
  CANCELED = "canceled",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface CreateInvoiceDTO {
  customer_id: string;
  customer_name: string;
  customer_email: string;
  subscription_id: string;
  plan_name: string;
  plan_price: string;
  total_amount: number;
  items: {
    item_id: string;
    item_name: string;
    quantity: number;
    price_per_unit: number;
  }[];
  status:
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
}

export interface UpdateInvoiceDTO {
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  subscription_id?: string;
  plan_name?: string;
  plan_price?: string;
  total_amount?: number;
  items?: {
    item_id?: string;
    item_name?: string;
    quantity?: number;
    price_per_unit?: number;
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
}

export interface ApiResponse {
  status: number;
  message: string;
  data: {
    pagination: {
      page: number;
      limit: number;
      totalInvoices: number;
      totalPages: number;
    };
    invoices: Invoice[];
  };
}
