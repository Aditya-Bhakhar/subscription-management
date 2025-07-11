export interface AssignSubscription {
  id: string;
  customer: {
    customer_id: string;
    customer_name: string;
  };
  plan: {
    plan_id: string;
    plan_name: string;
  };
  status?:
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
  items: {
    item_id: string;
    item_name: string;
    quantity?: number;
  }[];
}

export interface CreateAssignSubscriptionDTO {
  customer_id: string;
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
  items: {
    item_id: string;
    quantity: number;
  }[];
}

export interface UpdateAssignSubscriptionDTO {
  customer_id?: string;
  plan_id?: string;
  status?:
    | "pending"
    | "active"
    | "suspended"
    | "expired"
    | "canceled"
    | "renewed"
    | "failed";
  start_date?: string;
  end_date?: string;
  auto_renew?: boolean;
}

export interface ApiResponse {
  status: number;
  message: string;
  data: {
    pagination: {
      page: number;
      limit: number;
      totalSubscriptions: number;
      totalPages: number;
    };
    subscriptions: AssignSubscription[];
  };
}

export interface AssignSubscriptionData {
  id: string;
  customer: {
    customer_id: string;
    customer_name: string;
  };
  plan: {
    plan_id: string;
    plan_name: string;
  };
  status?:
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
  items: {
    item_id: string;
    item_name: string;
    quantity?: number;
  }[];
}
