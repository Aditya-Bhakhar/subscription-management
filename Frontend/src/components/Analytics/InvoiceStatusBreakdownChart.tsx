import { useQuery } from "@tanstack/react-query";
import { AnalysisAPI } from "@/api/analysis";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { InvoiceStatusBreakdownResponse } from "@/types/analysisTypes";

// Colors for the Pie slices
const COLORS = [
  "#6366F1", // Indigo - Sent
  "#3B82F6", // Blue - Paid
  "#10B981", // Green - Overdue
  "#F59E0B", // Amber - Pending
  "#F43F5E", // Red - Failed
  "#9CA3AF", // Gray - Canceled
  "#06B6D4", // Cyan - Refunded
  "#D1D5DB", // Light Gray - Generated
];

const fetchInvoiceStatusBreakdown = async (): Promise<InvoiceStatusBreakdownResponse> => {
  const data = await AnalysisAPI.getInvoiceStatusBreakdown();
  return data;
};

const InvoiceStatusBreakdownChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["invoiceStatusBreakdown"],
    queryFn: fetchInvoiceStatusBreakdown,
  });

  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Invoice Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Unable to fetch data.</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data?.data.status_breakdown.map((item) => ({
    status: item.status,
    total_invoices: item.total_invoices,
    total_amount: item.total_amount,
  }));

  return (
    <Card className="shadow-lg dark:bg-gray-900 transition-all">
      <CardHeader>
        <CardTitle className="text-lg font-semibold dark:text-white">
          Invoice Status Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="total_invoices"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              paddingAngle={2}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {chartData?.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()}`}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InvoiceStatusBreakdownChart;
