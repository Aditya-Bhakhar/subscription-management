// Subscription Analysis Types

export interface TotalSubscriptionsResponse {
  status: number;
  message: string;
  data: {
    totalSubscriptions: number;
    breakdown: Record<string, number>;
  };
}
export interface NewSubscriptionsResponse {
  status: number;
  message: string;
  data: {
    new_subscriptions: string;
  };
}
export interface RenewalsVsCancellationsResponse {
  status: number;
  message: string;
  data: {
    renewals: string;
    cancellations: string;
  };
}
export interface MonthlyRevenueTrendsResponse {
  status: number;
  message: string;
  data: {
    month: string;
    total_revenue: string;
  }[];
}
export interface PlanPopularityResponse {
  status: number;
  message: string;
  data: Record<string, string>;
}
export interface SubscriptionGrowthTrendsResponse {
  status: number;
  message: string;
  data: {
    month: string;
    total_subscriptions: string;
  }[];
}

// Customer Analysis Types

export interface NewCustomerOverTimeResponse {
  status: number;
  message: string;
  data: {
    month: string;
    new_customers: string;
  }[];
}
export interface CustomerLifetimeValueResponse {
  status: number;
  message: string;
  data: {
    id: string;
    firstname: string;
    lastname: string;
    lifetime_value: string;
  }[];
}
export interface CustomerSubscriptionFrequencyResponse {
  status: number;
  message: string;
  data: {
    id: string;
    firstname: string;
    lastname: string;
    subscription_count: string;
  }[];
}
export interface CustomerRetentionRateResponse {
  status: number;
  message: string;
  data: {
    retention_rate: string;
  };
}

// Expense Analysis Types
export interface TotalExpenseOverTimeResponse {
  status: number;
  message: string;
  data: {
    month: string;
    totalExpenses: number;
    breakdown: Record<string, number>;
  }[];
}
export interface ExpenseByProviderCategoryResponse {
  status: number;
  message: string;
  data: {
    provider: string;
    count: string;
    totalamount: number;
  }[];
}
export interface RecurringVsOneTimeExpensesResponse {
  status: number;
  message: string;
  data: {
    recurring: {
      count: number;
      totalAmount: number;
    };
    oneTime: {
      count: number;
      totalAmount: number;
    };
  };
}
export interface TopExpenseProvidersResponse {
  status: number;
  message: string;
  data: {
    provider_name: string;
    expense_count: string;
    total_amount: number;
  }[];
}
export interface ExpenseVsRevenueComparisonResponse {
  status: number;
  message: string;
  data: {
    month: string;
    total_expenses: number;
    total_revenue: number;
  }[];
}
export interface PendingOverdueExpensesResponse {
  status: number;
  message: string;
  data: {
    pending: number;
    overdue: number;
  };
}

// Items & Subscription Usage Analysis Types
export interface TotalItemsSubscribedOverTimeResponse {
  status: number;
  message: string;
  data: {
    month: string;
    total_items_subscribed: string;
  }[];
}
export interface TopSubscribedItemsResponse {
  status: number;
  message: string;
  data: {
    item_name: string;
    total_subscriptions: string;
  }[];
}
export interface TopItemRevenueContributionResponse {
  status: number;
  message: string;
  data: {
    item_name: string;
    total_revenue: number;
  }[];
}
export interface MonthlySubscribedItemsTrendResponse {
  status: number;
  message: string;
  data: {
    month: string;
    total_items_subscribed: string;
  }[];
}
export interface ItemUsageByPlanResponse {
  status: number;
  message: string;
  data: {
    plan_name: string;
    item_name: string;
    total_quantity: string;
  }[];
}

// Invoice Analysis Types
export interface InvoiceStatusBreakdownResponse {
  status: number;
  message: string;
  data: {
    status_breakdown: {
      status: string;
      total_invoices: number;
      total_amount: string;
    }[];
  };
}
export interface TotalInvoicesWithAmountResponse {
  status: number;
  message: string;
  data: {
    total_invoices: string;
    total_amount: string;
  };
}
export interface InvoicePaymentStatusResponse {
  status: number;
  message: string;
  data: {
    paid: {
      total_invoices: string;
      total_amount: string;
    };
    sent: {
      total_invoices: string;
      total_amount: string;
    };
  };
}
export interface InvoiceTrendsOverTimeResponse {
  status: number;
  message: string;
  data: {
    month: string;
    total_invoices: string;
    total_amount: string;
  }[];
}
