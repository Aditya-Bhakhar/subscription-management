import { useQuery } from "@tanstack/react-query";
import { AnalysisAPI } from "../../api/analysis";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Brush,
} from "recharts";
import { format } from "date-fns";

// Fetch function for Invoice Trends Over Time
const fetchInvoiceTrendsOverTime = async () => {
  const response = await AnalysisAPI.getInvoiceTrendsOverTime();
  return response.data;
};

const InvoiceTrendsOverTime = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["invoiceTrendsOverTime"],
    queryFn: fetchInvoiceTrendsOverTime,
  });

  // Show loader when fetching data
  if (isLoading) {
    return <Skeleton className="h-56 w-full rounded-lg" />;
  }

  // Show error message if API fails
  if (error) {
    return <p className="text-red-500 text-center">Failed to load data.</p>;
  }

  // Safely format the data for the chart, providing a fallback if data is undefined
  const chartData = data?.map((item: {
    month: string;
    total_invoices: string;
    total_amount: string;
  }) => ({
    month: format(new Date(item.month), "MMM yyyy"), // Format the month for better readability
    total_invoices: parseInt(item.total_invoices),
    total_amount: parseFloat(item.total_amount),
  })) ?? []; // Use an empty array as a fallback if data is undefined

  return (
    <Card className="shadow-xl bg-white dark:bg-gray-900 transition-all border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
          Invoice Trends Over Time
        </CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            {/* Background Grid */}
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />

            {/* X & Y Axis */}
            <XAxis
              dataKey="month"
              tick={{ fill: "#64748B", fontSize: 14 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748B", fontSize: 14 }}
              tickLine={false}
              domain={['dataMin', 'dataMax']} // Dynamically adjust Y axis range
            />

            {/* Tooltip & Legend */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b", // Darker background for better contrast
                color: "#f8fafc", // Light text for readability
                borderRadius: 8,
                padding: "8px",
                fontSize: "14px",
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ color: "#6b7280" }} />

            {/* Area representing total invoices */}
            <Area
              type="monotone"
              dataKey="total_invoices"
              fill="#6366f1" // Indigo-600 color
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={0.3} // Light opacity for the area
              activeDot={{ r: 8 }}
            />

            {/* Area representing total amount */}
            <Area
              type="monotone"
              dataKey="total_amount"
              fill="#8b5cf6" // Purple-600 color
              stroke="#8b5cf6"
              strokeWidth={2}
              fillOpacity={0.3} // Light opacity for the area
              activeDot={{ r: 8 }}
            />

            {/* Brush to select a portion of the data */}
            <Brush
              dataKey="month"
              height={30}
              stroke="#6366f1"
              startIndex={chartData.length - 10} // Default to show the last 10 months
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InvoiceTrendsOverTime;
