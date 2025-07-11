import MonthlyRevenue from "@/components/Analytics/MonthlyRevenue";
import NewSubscriptions from "@/components/Analytics/NewSubscriptions";
import PlanPopularity from "@/components/Analytics/PlanPopularity";
import RenewalsVsCancellations from "@/components/Analytics/RenewalsVsCancellations";
import SubscriptionGrowthTrends from "@/components/Analytics/SubscriptionGrowthTrends";
import TotalSubscriptions from "@/components/Analytics/TotalSubscriptions";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CustomerRetentionRate from "@/components/Analytics/CustomerRetentionRate";
import NewCustomerOverTime from "@/components/Analytics/NewCustomerOverTime";
import CustomerLifetimeValue from "@/components/Analytics/CustomerLifetimeValue";
import CustomerSubscriptionFrequency from "@/components/Analytics/CustomerSubscriptionFrequency ";
import TotalExpenseOverTimeChart from "@/components/Analytics/TotalExpenseOverTimeChart";
import ExpenseByProviderCategoryChart from "@/components/Analytics/ExpenseByProviderCategoryChart";
import RecurringVsOneTimeChart from "@/components/Analytics/RecurringVsOneTimeChart";
import TopExpenseProvidersChart from "@/components/Analytics/TopExpenseProvidersChart";
import ExpenseVsRevenueAreaChart from "@/components/Analytics/ExpenseVsRevenueChart";
import PendingOverdueDonutChart from "@/components/Analytics/PendingOverdueDonutChart";
import TotalItemsSubscribedChart from "@/components/Analytics/TotalItemsSubscribedChart ";
import TopSubscribedItemsChart from "@/components/Analytics/TopSubscribedItemsChart";
import TopItemRevenueChart from "@/components/Analytics/TopItemRevenueChart";
import MonthlySubscribedItemsTrendChart from "@/components/Analytics/MonthlySubscribedItemsTrendChart";
import ItemUsageByTopPlanChart from "@/components/Analytics/ItemUsageByTopPlanChart";
import InvoiceStatusBreakdownChart from "@/components/Analytics/InvoiceStatusBreakdownChart";
import TotalInvoicesWithAmount from "@/components/Analytics/TotalInvoicesWithAmount";
import InvoicePaymentStatus from "@/components/Analytics/InvoicePaymentStatus";
import InvoiceTrendsOverTime from "@/components/Analytics/InvoiceTrendsOverTime ";

const Dashboard: React.FC = () => {
  return (
    <div className="p-5">

      <Tabs defaultValue="subscription">
        <TabsList className="mb-4">
          <TabsTrigger value="subscription">Subscription Analysis</TabsTrigger>
          <TabsTrigger value="customer">Customer Analysis</TabsTrigger>
          <TabsTrigger value="expense">Expense Analysis</TabsTrigger>
          <TabsTrigger value="itemUsage">
            Items &amp; Subscription Usage
          </TabsTrigger>
          <TabsTrigger value="invoice">Invoice Analysis</TabsTrigger>
        </TabsList>

        {/* Subscription Analysis Tab */}
        <TabsContent value="subscription" className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TotalSubscriptions />
            <MonthlyRevenue />
            <RenewalsVsCancellations />
            <PlanPopularity />
            <SubscriptionGrowthTrends />
          </div>
          <div>
            <NewSubscriptions />
          </div>
        </TabsContent>

        {/* Placeholder for Customer Analysis */}
        <TabsContent value="customer">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomerRetentionRate />
            <NewCustomerOverTime />
            <CustomerLifetimeValue />
            <CustomerSubscriptionFrequency />
          </div>
        </TabsContent>

        {/* Placeholder for Expense Analysis */}
        <TabsContent value="expense">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <TotalExpenseOverTimeChart />
           <ExpenseByProviderCategoryChart />
          <RecurringVsOneTimeChart />
          <TopExpenseProvidersChart />
          <ExpenseVsRevenueAreaChart />
          <PendingOverdueDonutChart />
          </div>
        </TabsContent>

        {/* Placeholder for Items & Subscription Usage Analysis */}
        <TabsContent value="itemUsage">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TotalItemsSubscribedChart />
          <TopSubscribedItemsChart />
          <TopItemRevenueChart />
          <MonthlySubscribedItemsTrendChart />
          <ItemUsageByTopPlanChart />
          </div>
        </TabsContent>

        {/* Placeholder for Invoice Analysis */}
        <TabsContent value="invoice">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InvoiceStatusBreakdownChart />
            <TotalInvoicesWithAmount />
            <InvoicePaymentStatus />
            <InvoiceTrendsOverTime />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
