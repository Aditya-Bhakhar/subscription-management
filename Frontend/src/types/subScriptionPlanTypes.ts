export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string | null;
  status: "active" | "inactive";
  price: number;
  duration_days: number;
  features: string[];
  created_at?: string;
  updated_at?: string;
}

export enum SubscriptionPlanStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface CreateSubscriptionPlanDTO {
  name: string;
  description?: string | null;
  status: SubscriptionPlanStatus;
  price: number;
  duration_days: number;
  features: string[];
}

export interface UpdateSubscriptionPlanDTO {
  name: string;
  description?: string | null;
  status: "active" | "inactive";
  price: number;
  duration_days: number;
  features: string[];
}

export interface ApiResponse {
  status: number;
  message: string;
  data: {
    pagination: {
      page: number;
      limit: number;
      totalSubscriptionPlans: number;
      totalPages: number;
    };
    subscription_plans: SubscriptionPlan[];
  };
}
