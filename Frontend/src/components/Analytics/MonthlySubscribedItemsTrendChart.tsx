import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
  } from "recharts";
  import { useQuery } from "@tanstack/react-query";
  import { format } from "date-fns";
  import { AnalysisAPI } from "@/api/analysis";
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from "@/components/ui/card";
  import { Skeleton } from "@/components/ui/skeleton";
  
  // Fetch monthly trends
  const fetchMonthlySubscribedItemsTrend = async () => {
    const response = await AnalysisAPI.getMonthlySubscribedItemsTrends();
    return response.data.map(
      (item: { month: string; total_items_subscribed: string }) => ({
        month: format(new Date(item.month + "-01"), "MMM yyyy"),
        total: Number(item.total_items_subscribed),
      })
    );
  };
  
  const MonthlySubscribedItemsTrendChart = () => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["monthlySubscribedItemsTrend"],
      queryFn: fetchMonthlySubscribedItemsTrend,
    });
  
    if (isLoading) {
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Monthly Subscribed Items Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full rounded-xl" />
          </CardContent>
        </Card>
      );
    }
  
    if (error || !data) {
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Monthly Subscribed Items Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Unable to fetch data.</p>
          </CardContent>
        </Card>
      );
    }
  
    return (
      <Card className="w-full shadow-md dark:bg-gray-900 transition-all">
        <CardHeader>
          <CardTitle className="text-lg font-semibold dark:text-white">
            Monthly Subscribed Items Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorItems" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="total"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorItems)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };
  
  export default MonthlySubscribedItemsTrendChart;
  