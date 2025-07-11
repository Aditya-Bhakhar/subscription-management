import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  import { useQuery } from "@tanstack/react-query";
  import { AnalysisAPI } from "@/api/analysis";
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from "@/components/ui/card";
  import { Skeleton } from "@/components/ui/skeleton";
  
  const COLORS = ["#facc15", "#ef4444"]; // yellow-400 (pending), red-500 (overdue)
  
  const fetchPendingOverdue = async () => {
    const response = await AnalysisAPI.getPendingOverdueExpenses();
    return response.data;
  };
  
  const PendingOverdueDonutChart = () => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["pendingOverdue"],
      queryFn: fetchPendingOverdue,
    });
  
    if (isLoading) {
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Pending vs Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full rounded-xl" />
          </CardContent>
        </Card>
      );
    }
  
    if (!data || error) {
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Pending vs Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Failed to load chart data.</p>
          </CardContent>
        </Card>
      );
    }
  
    const chartData = [
      { name: "Pending", value: data.pending },
      { name: "Overdue", value: data.overdue },
    ];
  
    return (
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>Pending vs Overdue Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(1)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value} expenses`}
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  borderColor: "#e5e7eb",
                }}
              />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };
  
  export default PendingOverdueDonutChart;
  