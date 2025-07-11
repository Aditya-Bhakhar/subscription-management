import { useQuery } from "@tanstack/react-query";
import { AnalysisAPI } from "@/api/analysis";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { format } from "date-fns";

// Fetch function
const fetchTotalItemsSubscribedOverTime = async () => {
  const response = await AnalysisAPI.getTotalItemsSubscribedOverTime();
  return response.data.map((item: { month: string; total_items_subscribed: string }) => ({
    month: format(new Date(item.month), "MMM yyyy"),
    total_items_subscribed: Number(item.total_items_subscribed),
  }));
};

const TotalItemsSubscribedChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["totalItemsSubscribedOverTime"],
    queryFn: fetchTotalItemsSubscribedOverTime,
  });

  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  if (error) {
    return <p className="text-center text-red-500">Failed to load data</p>;
  }

  return (
    <Card className="shadow-lg dark:bg-gray-900 transition-all">
      <CardHeader>
        <CardTitle className="text-lg font-semibold dark:text-white">
          Total Items Subscribed Over Time
        </CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
            <linearGradient id="colorItemsSubscribed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="total_items_subscribed"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorItemsSubscribed)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TotalItemsSubscribedChart;
