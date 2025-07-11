import { useQuery } from "@tanstack/react-query";
import { AnalysisAPI } from "../../api/analysis.ts";
import { MonthlyRevenueTrendsResponse } from "../../types/analysisTypes.ts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const fetchMonthlyRevenue = async (): Promise<MonthlyRevenueTrendsResponse["data"]> => {
  const response = await AnalysisAPI.getMonthlyRevenueStats();
  return response.data;
};

const MonthlyRevenue = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["monthlyRevenue"],
    queryFn: fetchMonthlyRevenue,
  });

  // Ensure numbers are properly parsed
  const chartData = data
    ? data.map((item) => ({
        month: item.month,
        total_revenue: Number(item.total_revenue), // Convert string to number
      }))
    : [];

  return (
    <Card className="shadow-xl bg-white dark:bg-gray-900 transition-all border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
          Monthly Revenue Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80 min-h-80 flex justify-center items-center">
        {isLoading ? (
          <Skeleton className="h-40 w-full rounded-md" />
        ) : error ? (
          <p className="text-red-500">Failed to load data.</p>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              {/* Background Grid */}
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />

              {/* X & Y Axis */}
              <XAxis
                dataKey="month"
                tick={{ fill: "#64748B", fontSize: 14 }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748B", fontSize: 14 }}
                tickLine={false}
              />

              {/* Tooltip & Legend */}
              <Tooltip
                cursor={{ fill: "rgba(79, 70, 229, 0.2)" }} // Hover effect (Indigo-600)
                contentStyle={{
                  backgroundColor: "#1e293b", // Darker Gray-800 for dark mode
                  color: "#f8fafc", // Light text
                  borderRadius: 8,
                  padding: "8px",
                  fontSize: "14px",
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ color: "#6b7280" }} />

              {/* Gradient Bar Colors */}
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
                </linearGradient>
              </defs>

              {/* Bar */}
              <Bar
                dataKey="total_revenue"
                fill="url(#barGradient)"
                radius={[10, 10, 0, 0]}
                animationDuration={1000}
                barSize={100} // Adjust bar thickness
              />

              {/* Line */}
              <Line
                type="monotone"
                dataKey="total_revenue"
                stroke="#FF5733" // Line color (orange)
                strokeWidth={2}
                activeDot={{ r: 8 }} // Add dots at the data points
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No data available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyRevenue;
