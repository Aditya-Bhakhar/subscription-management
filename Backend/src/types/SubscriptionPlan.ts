// src/types/SubscriptionPlan.ts

export interface SubscriptionPlan {
    id?: string;
    name: string;
    description?: string | null;
    status: "active" | "inactive";
    price: number;
    duration_days: number;
    features: string[];
    created_at?: Date; 
    updated_at?: Date; 
  }
  