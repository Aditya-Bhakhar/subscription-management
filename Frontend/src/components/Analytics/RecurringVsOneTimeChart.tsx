import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
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
  
  const COLORS = ["#3b82f6", "#10b981"]; // blue & green tones
  
  const fetchRecurringVsOneTime = async (): Promise<{
    recurring: { count: number; totalAmount: number };
    oneTime: { count: number; totalAmount: number };
  }> => {
    const response = await AnalysisAPI.getRecurringVsOneTimeExpenses();
    return response.data;
  };
  
  const RecurringVsOneTimeChart = () => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["recurringVsOneTimeExpenses"],
      queryFn: fetchRecurringVsOneTime,
    });
  
    if (isLoading) {
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Recurring vs One-Time Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full rounded-xl" />
          </CardContent>
        </Card>
      );
    }
  
    if (!data || error) {
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Recurring vs One-Time Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Unable to fetch data.</p>
          </CardContent>
        </Card>
      );
    }
  
    const chartData = [
      {
        name: "Recurring",
        value: data.recurring.totalAmount,
      },
      {
        name: "One-Time",
        value: data.oneTime.totalAmount,
      },
    ];
  
    return (
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>Recurring vs One-Time Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(1)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `₹${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  borderColor: "#e5e7eb",
                }}
              />
              <Legend verticalAlign="bottom" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };
  
  export default RecurringVsOneTimeChart;
  