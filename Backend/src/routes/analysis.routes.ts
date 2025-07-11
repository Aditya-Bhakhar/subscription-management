// src/routes/analysis.routes.ts

import { Router } from "express";
import {
  getTotalSubscriptions,
  getNewSubscriptions,
  getRenewalsVsCancellations,
  getMonthlyRevenue,
  getPlanPopularity,
  getSubscriptionGrowthRate,
} from "../controllers/subscriptionAnalysisController.js";
import {
  getCustomerLifetimeValue,
  getCustomerRetentionRate,
  getNewCustomers,
  getSubscriptionFrequency,
} from "../controllers/customerAnalysisController.js";
import {
  getExpensesByProviderCategory,
  getExpenseVsRevenueComparison,
  getPendingAndOverdueExpenses,
  getRecurringVsOneTimeExpenses,
  getTopExpenseProviders,
  getTotalExpensesOverTimeWithBreakdown,
} from "../controllers/expenseAnalysisController.js";
import {
  getItemUsageByTopPlans,
  getTopItemWiseRevenueContribution,
  getMonthlySubscribedItemsTrend,
  getTopSubscribedItems,
  getTotalItemsSubscribedOverTime,
} from "../controllers/itemSubscriptionAnalysisController.js";
import { getInvoicePaymentStatus, getInvoiceStatusBreakdown, getInvoiceTrendsOverTime, getTotalInvoicesWithAmount } from "../controllers/invoiceAnanlysisController.js";

const router = Router();

// Subscription Analytics Routes
router.get("/subscription/total", getTotalSubscriptions);
router.get("/subscription/new", getNewSubscriptions);
router.get(
  "/subscription/renewals-vs-cancellations",
  getRenewalsVsCancellations
);
router.get("/subscription/monthly-revenue", getMonthlyRevenue);
router.get("/subscription/plan-popularity", getPlanPopularity);
router.get("/subscription/growth-trends", getSubscriptionGrowthRate);

// Customer Analytics Routes
router.get("/customer/new", getNewCustomers);
router.get("/customer/lifetime-value", getCustomerLifetimeValue);
router.get("/customer/subscription-frequency", getSubscriptionFrequency);
router.get("/customer/retention-rate", getCustomerRetentionRate);

// Expense Analytics Routes
router.get(
  "/expense/total-expense-over-time",
  getTotalExpensesOverTimeWithBreakdown
);
router.get("/expense/provider-categories", getExpensesByProviderCategory);
router.get("/expense/recurring-vs-onetime", getRecurringVsOneTimeExpenses);
router.get("/expense/top-providers", getTopExpenseProviders);
router.get("/expense/expense-vs-revenue", getExpenseVsRevenueComparison);
router.get("/expense/pending-overdue", getPendingAndOverdueExpenses);

// Item Subscription Analytics Routes
router.get("/item/total-over-time", getTotalItemsSubscribedOverTime);
router.get("/item/top-subscribed", getTopSubscribedItems);
router.get("/item/revenue-contribution", getTopItemWiseRevenueContribution);
router.get("/item/monthly-trend", getMonthlySubscribedItemsTrend);
router.get("/item/usage-by-top-plan", getItemUsageByTopPlans);

// Invoice Analysis Routes
router.get("/invoice/status-breakdown", getInvoiceStatusBreakdown);
router.get("/invoice/total", getTotalInvoicesWithAmount);
router.get("/invoice/payment-status", getInvoicePaymentStatus);
router.get("/invoice/trends-over-time", getInvoiceTrendsOverTime);

export default router;
