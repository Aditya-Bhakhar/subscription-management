import { useQuery } from "@tanstack/react-query";
import { AnalysisAPI } from "@/api/analysis"; // Adjusted path to match the provided example
import { PlanPopularityResponse } from "../../types/analysisTypes";
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

// Colors for the Pie slices
const COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#6366F1", // Indigo
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#A855F7", // Purple
];

// Fetch Plan Popularity Data
const fetchPlanPopularity = async (): Promise<PlanPopularityResponse["data"]> => {
  const response = await AnalysisAPI.getPlanPopularity();
  return response.data;
};

const PlanPopularity = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["planPopularity"],
    queryFn: fetchPlanPopularity,
  });

  // Ensure data is formatted properly
  const chartData = data
    ? Object.entries(data).map(([plan, count]) => ({
        plan,
        totalSubscriptions: Number(count), // Ensure numeric values
      }))
    : [];

  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Plan Popularity</CardTitle>
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
          Plan Popularity
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80 min-h-80 flex justify-center items-center">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="totalSubscriptions"
                nameKey="plan"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={80}
                paddingAngle={3}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}`, `Plan: ${name}`]} />
              <Legend verticalAlign="bottom" height={0} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No data available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanPopularity;
