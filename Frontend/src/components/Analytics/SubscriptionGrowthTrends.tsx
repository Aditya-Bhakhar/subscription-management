import { useQuery } from "@tanstack/react-query";
import { AnalysisAPI } from "../../api/analysis.ts";
import { SubscriptionGrowthTrendsResponse } from "../../types/analysisTypes.ts";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetchSubscriptionGrowthTrends = async (): Promise<SubscriptionGrowthTrendsResponse["data"]> => {
  const response = await AnalysisAPI.getSubscriptionGrowthTrends();
  return response.data;
};

const SubscriptionGrowthTrends = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["subscriptionGrowthTrends"],
    queryFn: fetchSubscriptionGrowthTrends,
  });
  

  // Log error for debugging if it exists
  if (error) console.error("Error fetching subscription growth trends:", error);

  // Convert the returned data so that total_subscriptions are numbers
  const chartData = data
    ? data.map((item) => ({
        month: item.month,
        total_subscriptions: Number(item.total_subscriptions),
      }))
    : [];
  return (
    <Card className="shadow-lg bg-white dark:bg-gray-800 transition-all">
      <CardHeader>
        <CardTitle className="text-lg font-semibold dark:text-white">
          Subscription Growth Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80 min-h-80 flex justify-center items-center">
        {isLoading ? (
          <Skeleton className="h-40 w-full rounded-md" />
        ) : error ? (
          <p className="text-red-500">
            Failed to load data. {error instanceof Error && error.message}
          </p>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: "#8884d8" }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="total_subscriptions"
                stroke="#3B82F6"
                fill="#93C5FD"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No data available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionGrowthTrends;
