import { useQuery } from "@tanstack/react-query";
import { AnalysisAPI } from "@/api/analysis";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  Legend,
} from "recharts";

// Fetch top 5 subscribed items
const fetchTopSubscribedItems = async () => {
  const response = await AnalysisAPI.getTopSubscribedItems();
  return response.data.map(
    (item: { item_name: string; total_subscriptions: string }) => ({
      item_name: item.item_name,
      total_subscriptions: Number(item.total_subscriptions),
    })
  );
};

const TopSubscribedItemsChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["topSubscribedItems"],
    queryFn: fetchTopSubscribedItems,
  });

  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Top Subscribed Items</CardTitle>
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
          Top Subscribed Items
        </CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 50, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" stroke="#9CA3AF" />
            <YAxis
              type="category"
              dataKey="item_name"
              stroke="#9CA3AF"
              tick={{ fontSize: 14 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(79, 70, 229, 0.2)" }} // Indigo-600 (hover effect)
              contentStyle={{
                backgroundColor: "#1e293b", // Darker Gray-800 for dark mode
                color: "#f8fafc", // Light text
                borderRadius: 8,
                padding: "8px",
                fontSize: "14px",
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ color: "#6b7280" }} />

            <Bar
              dataKey="total_subscriptions"
              fill="url(#barGradient)"
              barSize={30}
              radius={[0, 10, 10, 0]}
            >
              <LabelList dataKey="total_subscriptions" position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopSubscribedItemsChart;
