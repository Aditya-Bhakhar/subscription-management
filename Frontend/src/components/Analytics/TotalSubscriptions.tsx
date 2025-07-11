import { useQuery } from "@tanstack/react-query";
import { AnalysisAPI } from "../../api/analysis.ts";
import { TotalSubscriptionsResponse } from "../../types/analysisTypes.ts";
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
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fetchTotalSubscriptions = async (): Promise<TotalSubscriptionsResponse["data"]> => {
  const response = await AnalysisAPI.getTotalSubscriptions();
  return response.data;
};

const TotalSubscriptions = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["totalSubscriptions"],
    queryFn: fetchTotalSubscriptions,
  });

  // Convert breakdown data for Recharts
  const chartData = data
    ? Object.entries(data.breakdown).map(([status, count]) => ({
        status,
        count: Number(count),
      }))
    : [];

  return (
    <Card className="shadow-lg dark:bg-gray-900 transition-all">
      <CardHeader>
        <CardTitle className="text-lg font-semibold dark:text-white">
          Total Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80 min-h-80 flex justify-center items-center">
        {isLoading ? (
          <Skeleton className="h-32 w-full rounded-md" />
        ) : error ? (
          <p className="text-red-500">Failed to load data.</p>
        ) : data ? (
          <div>
            <p className="text-xl font-bold dark:text-white">
              Total: {data.totalSubscriptions}
            </p>
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="status" stroke="#ccc" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No data available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TotalSubscriptions;
