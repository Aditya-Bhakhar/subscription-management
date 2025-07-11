import { useQuery } from "@tanstack/react-query";
import { AnalysisAPI } from "@/api/analysis"; // Adjusted path to match your project structure
import { RenewalsVsCancellationsResponse } from "../../types/analysisTypes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Chart Colors
const COLORS = ["#10B981", "#EF4444"]; // Green for Renewals, Red for Cancellations

// Fetch Renewal vs Cancellation Data
const fetchRenewalsVsCancellations = async (): Promise<
  RenewalsVsCancellationsResponse["data"]
> => {
  const response = await AnalysisAPI.getRenewalVsCancellation();
  return response.data;
};

const RenewalsVsCancellations = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["renewalsVsCancellations"],
    queryFn: fetchRenewalsVsCancellations,
  });

  // Transform data for the PieChart
  const chartData = data
    ? [
      { name: "Renewals", count: Number(data?.renewals) },
      { name: "Cancellations", count: Number(data?.cancellations) },
    ]
    : [{ name: "No Data", count: 1 }];

  console.log("chartData", chartData);
  const isAllZero = chartData.every(item => item.count === 0);

  // Loading state
  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Renewals vs Cancellations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Unable to fetch data.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg dark:bg-gray-900 transition-all">
      <CardHeader>
        <CardTitle className="text-lg font-semibold dark:text-white">
          Renewals vs Cancellations
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80 min-h-80 flex justify-center items-center">
        {data && !isAllZero ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={65}
                paddingAngle={3}
                dataKey="count"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value.toLocaleString()}`}
              />
              <Legend verticalAlign="bottom" height={24} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No data available.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RenewalsVsCancellations;
