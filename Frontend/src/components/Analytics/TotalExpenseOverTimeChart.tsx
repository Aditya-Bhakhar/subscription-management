import { useQuery } from "@tanstack/react-query";
import { AnalysisAPI } from "@/api/analysis";
import { TotalExpenseOverTimeResponse } from "@/types/analysisTypes";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parse } from "date-fns";

const fetchTotalExpenseOverTime = async (): Promise<TotalExpenseOverTimeResponse["data"]> => {
  const response = await AnalysisAPI.getTotalExpenseOverTime();
  return response.data;
};

const COLORS = {
  active: "#3b82f6",   // Tailwind blue-500
  pending: "#facc15",  // yellow-400
  expired: "#ef4444",  // red-500
  canceled: "#6b7280", // gray-500
};

const formatMonth = (monthStr: string) => {
  try {
    const parsedDate = parse(monthStr, "yyyy-MM", new Date());
    return format(parsedDate, "MMM ''yy");
  } catch {
    return monthStr;
  }
};

const TotalExpenseOverTimeChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["totalExpenseOverTime"],
    queryFn: fetchTotalExpenseOverTime,
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Total Expenses Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (!data || error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Total Expenses Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Unable to fetch data.</p>
        </CardContent>
      </Card>
    );
  }

  // Transform data for chart
  const chartData = data.map((entry) => ({
    month: formatMonth(entry.month),
    totalExpenses: entry.totalExpenses,
    ...entry.breakdown,
  }));

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>Total Expenses Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              {Object.keys(COLORS).map((key) => (
                <linearGradient
                  id={`color-${key}`}
                  key={key}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={COLORS[key as keyof typeof COLORS]}
                    stopOpacity={0.6}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLORS[key as keyof typeof COLORS]}
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /> {/* light gray */}
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              stroke="#6b7280"
              tickFormatter={(value) => `₹${value.toFixed(0)}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [`₹${value}`, name]}
              labelStyle={{ color: "#374151", fontWeight: 500 }}
              contentStyle={{ backgroundColor: "#f9fafb", borderRadius: 8, borderColor: "#e5e7eb" }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />

            {Object.keys(COLORS).map((status) => (
              <Area
                key={status}
                type="monotone"
                dataKey={status}
                stroke={COLORS[status as keyof typeof COLORS]}
                fill={`url(#color-${status})`}
                name={status.charAt(0).toUpperCase() + status.slice(1)}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TotalExpenseOverTimeChart;
