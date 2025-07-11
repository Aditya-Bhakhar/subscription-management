import { useQuery } from "@tanstack/react-query";
import { AnalysisAPI } from "../../api/analysis";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// Define colors for the chart
const COLORS = ["#3B82F6", "#E5E7EB"]; // Blue for retention, Gray for remaining

// Fetch function for retention rate
const fetchCustomerRetentionRate = async () => {
  const response = await AnalysisAPI.getCustomerRetentionRate();
  return response.data;
};

const CustomerRetentionRate = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["customerRetentionRate"],
    queryFn: fetchCustomerRetentionRate,
  });

  // Handle loading state
  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  // Handle error state
  if (error) {
    return <p className="text-center text-red-500">Failed to load data</p>;
  }

  // Ensure valid retention rate data
  const retentionRate = Number(data?.retention_rate) || 0;

  // Chart data
  const chartData = [
    { name: "Retention", value: retentionRate },
    { name: "Remaining", value: 100 - retentionRate },
  ];

  return (
    <Card className="shadow-lg dark:bg-gray-900 transition-all">
      <CardHeader>
        <CardTitle className="text-lg font-semibold dark:text-white">
          Customer Retention Rate
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 flex justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CustomerRetentionRate;
