import { useQuery } from "@tanstack/react-query";
import { AnalysisAPI } from "@/api/analysis";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Colors for the Pie slices
const COLORS = [
  "#6366F1", // Indigo
  "#3B82F6", // Blue
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
];

// Fetch top 5 items by revenue contribution
const fetchTopItemRevenueContribution = async () => {
  const response = await AnalysisAPI.getTopItemRevenueContribution();
  return response.data.map(
    (item: { item_name: string; total_revenue: number }) => ({
      item_name: item.item_name,
      total_revenue: item.total_revenue,
    })
  );
};

const TopItemRevenueChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["topItemRevenueContribution"],
    queryFn: fetchTopItemRevenueContribution,
  });

  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Item Revenue Contribution</CardTitle>
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
          Item Revenue Contribution
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total_revenue"
              nameKey="item_name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              paddingAngle={3}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {data?.map(
                (
                  _: { item_name: string; total_revenue: number },
                  index: number
                ) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                )
              )}
            </Pie>
            <Tooltip
              formatter={(value: number) => `₹${value.toLocaleString()}`}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopItemRevenueChart;
