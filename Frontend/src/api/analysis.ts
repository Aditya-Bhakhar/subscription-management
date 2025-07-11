import { apiClient } from "./apiClient.ts";
import {
  CustomerLifetimeValueResponse,
  CustomerRetentionRateResponse,
  CustomerSubscriptionFrequencyResponse,
  ExpenseByProviderCategoryResponse,
  ExpenseVsRevenueComparisonResponse,
  InvoicePaymentStatusResponse,
  InvoiceStatusBreakdownResponse,
  InvoiceTrendsOverTimeResponse,
  ItemUsageByPlanResponse,
  MonthlyRevenueTrendsResponse,
  MonthlySubscribedItemsTrendResponse,
  NewCustomerOverTimeResponse,
  NewSubscriptionsResponse,
  PendingOverdueExpensesResponse,
  PlanPopularityResponse,
  RecurringVsOneTimeExpensesResponse,
  RenewalsVsCancellationsResponse,
  SubscriptionGrowthTrendsResponse,
  TopExpenseProvidersResponse,
  TopItemRevenueContributionResponse,
  TopSubscribedItemsResponse,
  TotalExpenseOverTimeResponse,
  TotalInvoicesWithAmountResponse,
  TotalItemsSubscribedOverTimeResponse,
  TotalSubscriptionsResponse,
} from "../types/analysisTypes.ts";

const ANALYSIS_SUBSCRIPTION_ENDPOINT = "/analysis/subscription";
const ANALYSIS_CUSTOMER_ENDPOINT = "/analysis/customer";
const ANALYSIS_EXPENSE_ENDPOINT = "/analysis/expense";
const ANALYSIS_ITEM_ENDPOINT = "/analysis/item";
const ANALYSIS_INVOICE_ENDPOINT = "/analysis/invoice";

export const AnalysisAPI = {
  // Subscription Analysis APIs
  getTotalSubscriptions: async (): Promise<TotalSubscriptionsResponse> => {
    const response = await apiClient.get(
      `${ANALYSIS_SUBSCRIPTION_ENDPOINT}/total`
    );
    return response.data;
  },
  getNewSubscriptions: async (
    startDate: string,
    endDate: string
  ): Promise<NewSubscriptionsResponse> => {
    const response = await apiClient.get(
      `${ANALYSIS_SUBSCRIPTION_ENDPOINT}/new`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data;
  },
  getRenewalVsCancellation:
    async (): Promise<RenewalsVsCancellationsResponse> => {
      const response = await apiClient.get(
        `${ANALYSIS_SUBSCRIPTION_ENDPOINT}/renewals-vs-cancellations`
      );
      return response.data;
    },
  getMonthlyRevenueStats: async (): Promise<MonthlyRevenueTrendsResponse> => {
    const response = await apiClient.get(
      `${ANALYSIS_SUBSCRIPTION_ENDPOINT}/monthly-revenue`
    );
    return response.data;
  },
  getPlanPopularity: async (): Promise<PlanPopularityResponse> => {
    const response = await apiClient.get(
      `${ANALYSIS_SUBSCRIPTION_ENDPOINT}/plan-popularity`
    );
    return response.data;
  },
  getSubscriptionGrowthTrends:
    async (): Promise<SubscriptionGrowthTrendsResponse> => {
      const response = await apiClient.get(
        `${ANALYSIS_SUBSCRIPTION_ENDPOINT}/growth-trends`
      );
      return response.data;
    },

  // Customer Analysis APIs
  getNewCustomerOverTime: async (): Promise<NewCustomerOverTimeResponse> => {
    const response = await apiClient.get(`${ANALYSIS_CUSTOMER_ENDPOINT}/new`);
    return response.data;
  },
  getCustomerLifetimeValue:
    async (): Promise<CustomerLifetimeValueResponse> => {
      const response = await apiClient.get(
        `${ANALYSIS_CUSTOMER_ENDPOINT}/lifetime-value?limit=5`
      );
      return response.data;
    },
  getCustomerSubscriptionFrequency:
    async (): Promise<CustomerSubscriptionFrequencyResponse> => {
      const response = await apiClient.get(
        `${ANALYSIS_CUSTOMER_ENDPOINT}/subscription-frequency`
      );
      return response.data;
    },
  getCustomerRetentionRate:
    async (): Promise<CustomerRetentionRateResponse> => {
      const response = await apiClient.get(
        `${ANALYSIS_CUSTOMER_ENDPOINT}/retention-rate`
      );
      return response.data;
    },

  // Expense Analysis APIs
  getTotalExpenseOverTime: async (): Promise<TotalExpenseOverTimeResponse> => {
    const response = await apiClient.get(
      `${ANALYSIS_EXPENSE_ENDPOINT}/total-expense-over-time`
    );
    return response.data;
  },
  getExpenseByProviderCategory:
    async (): Promise<ExpenseByProviderCategoryResponse> => {
      const response = await apiClient.get(
        `${ANALYSIS_EXPENSE_ENDPOINT}/provider-categories`
      );
      return response.data;
    },
  getRecurringVsOneTimeExpenses:
    async (): Promise<RecurringVsOneTimeExpensesResponse> => {
      const response = await apiClient.get(
        `${ANALYSIS_EXPENSE_ENDPOINT}/recurring-vs-onetime`
      );
      return response.data;
    },
  getTopExpenseProviders: async (): Promise<TopExpenseProvidersResponse> => {
    const response = await apiClient.get(
      `${ANALYSIS_EXPENSE_ENDPOINT}/top-providers?limit=5`
    );
    return response.data;
  },
  getExpenseVsRevenueComparison:
    async (): Promise<ExpenseVsRevenueComparisonResponse> => {
      const response = await apiClient.get(
        `${ANALYSIS_EXPENSE_ENDPOINT}/expense-vs-revenue`
      );
      return response.data;
    },
  getPendingOverdueExpenses:
    async (): Promise<PendingOverdueExpensesResponse> => {
      const response = await apiClient.get(
        `${ANALYSIS_EXPENSE_ENDPOINT}/pending-overdue`
      );
      return response.data;
    },

  // Items & Subscription Usage APIs
  getTotalItemsSubscribedOverTime:
    async (): Promise<TotalItemsSubscribedOverTimeResponse> => {
      const response = await apiClient.get(
        `${ANALYSIS_ITEM_ENDPOINT}/total-over-time`
      );
      return response.data;
    },
  getTopSubscribedItems: async (): Promise<TopSubscribedItemsResponse> => {
    const response = await apiClient.get(
      `${ANALYSIS_ITEM_ENDPOINT}/top-subscribed?limit=5`
    );
    return response.data;
  },
  getTopItemRevenueContribution:
    async (): Promise<TopItemRevenueContributionResponse> => {
      const response = await apiClient.get(
        `${ANALYSIS_ITEM_ENDPOINT}/revenue-contribution?limit=5`
      );
      return response.data;
    },
  getMonthlySubscribedItemsTrends:
    async (): Promise<MonthlySubscribedItemsTrendResponse> => {
      const response = await apiClient.get(
        `${ANALYSIS_ITEM_ENDPOINT}/monthly-trend`
      );
      return response.data;
    },
  getItemUsageByPlan: async (): Promise<ItemUsageByPlanResponse> => {
    const response = await apiClient.get(
      `${ANALYSIS_ITEM_ENDPOINT}/usage-by-top-plan`
    );
    return response.data;
  },

  // Invoice Analysis APIs
  getInvoiceStatusBreakdown:
    async (): Promise<InvoiceStatusBreakdownResponse> => {
      const response = await apiClient.get(
        `${ANALYSIS_INVOICE_ENDPOINT}/status-breakdown`
      );
      return response.data;
    },
  getTotalInvoicesWithAmount:
    async (): Promise<TotalInvoicesWithAmountResponse> => {
      const response = await apiClient.get(
        `${ANALYSIS_INVOICE_ENDPOINT}/total`
      );
      return response.data;
    },
  getInvoicePaymentStatus: async (): Promise<InvoicePaymentStatusResponse> => {
    const response = await apiClient.get(
      `${ANALYSIS_INVOICE_ENDPOINT}/payment-status`
    );
    return response.data;
  },
  getInvoiceTrendsOverTime:
    async (): Promise<InvoiceTrendsOverTimeResponse> => {
      const response = await apiClient.get(
        `${ANALYSIS_INVOICE_ENDPOINT}/trends-over-time`
      );
      return response.data;
    },
};
