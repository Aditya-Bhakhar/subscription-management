import { useQuery } from "@tanstack/react-query";
import { AnalysisAPI } from "@/api/analysis";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

// Bar colors
const COLORS = [
  "#6366F1", // Indigo
  "#3B82F6", // Blue
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
];

type ItemUsage = {
  plan_name: string;
  item_name: string;
  total_quantity: string;
};

// Fetch usage data for top 5 plans
const fetchItemUsageByTopPlans = async () => {
  const response = await AnalysisAPI.getItemUsageByPlan(); // Adjust as per your actual method
  const allData: ItemUsage[] = response.data;

  // Get top 5 plans by total quantity
  const totalByPlan: Record<string, number> = {};
  for (const entry of allData) {
    totalByPlan[entry.plan_name] =
      (totalByPlan[entry.plan_name] || 0) + Number(entry.total_quantity);
  }

  const topPlans = Object.entries(totalByPlan)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([plan]) => plan);

  const filteredData = allData.filter((entry) =>
    topPlans.includes(entry.plan_name)
  );

  // Transform data to group by plan_name with item quantities

  type GroupedData = {
    plan_name: string;
    [itemName: string]: string | number;
  };

  const grouped: Record<string, GroupedData> = {};
  const itemSet = new Set<string>();

  for (const { plan_name, item_name, total_quantity } of filteredData) {
    if (!grouped[plan_name]) {
      grouped[plan_name] = { plan_name };
    }
    grouped[plan_name][item_name] = Number(total_quantity);
    itemSet.add(item_name);
  }

  return {
    chartData: Object.values(grouped),
    itemKeys: Array.from(itemSet),
  };
};

const ItemUsageByTopPlanChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["itemUsageByTopPlans"],
    queryFn: fetchItemUsageByTopPlans,
  });

  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  if (error || !data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Item Usage by Subscription Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Unable to fetch item usage data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg dark:bg-gray-900 transition-all">
      <CardHeader>
        <CardTitle className="text-lg font-semibold dark:text-white">
          Item Usage by Top 5 Plans
        </CardTitle>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.chartData}
            margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="plan_name"
              angle={-20}
              textAnchor="end"
              interval={0}
              height={60}
              className="text-sm"
            />
            <YAxis />
            <Tooltip />
            <Legend
              verticalAlign="top"
              wrapperStyle={{
                paddingBottom: 20, 
              }}
            />
            {data.itemKeys.map((item: string, index: number) => (
              <Bar
                key={item}
                dataKey={item}
                name={item}
                stackId="a"
                fill={COLORS[index % COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ItemUsageByTopPlanChart;
