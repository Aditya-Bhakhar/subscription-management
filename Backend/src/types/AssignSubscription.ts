// src/types/AssignSubscription.ts

export interface AssignSubscription {
  id?: string;
  customer_id: string;
  items: { item_id: string; quantity: number}[];
  plan_id: string;
  status:
    | "pending"
    | "active"
    | "suspended"
    | "expired"
    | "canceled"
    | "renewed"
    | "failed";
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  created_at?: string;
  updated_at?: string;
}
