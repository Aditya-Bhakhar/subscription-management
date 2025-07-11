import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Area,
    Legend,
  } from "recharts";
  import { useQuery } from "@tanstack/react-query";
  import { AnalysisAPI } from "@/api/analysis";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Skeleton } from "@/components/ui/skeleton";
  import { format } from "date-fns";
  
  type ExpenseVsRevenueItem = {
    month: string;
    total_expenses: number;
    total_revenue: number;
  };
  
  const fetchExpenseVsRevenue = async (): Promise<ExpenseVsRevenueItem[]> => {
    const response = await AnalysisAPI.getExpenseVsRevenueComparison();
    return response.data;
  };
  
  const ExpenseVsRevenueAreaChart = () => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["expenseVsRevenue"],
      queryFn: fetchExpenseVsRevenue,
    });
  
    if (isLoading) {
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Expense vs Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </CardContent>
        </Card>
      );
    }
  
    if (!data || error) {
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Expense vs Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Failed to load chart data.</p>
          </CardContent>
        </Card>
      );
    }
  
    const formattedData = data.map((item) => ({
      month: format(new Date(item.month), "MMM yyyy"),
      total_expenses: item.total_expenses,
      total_revenue: item.total_revenue,
    }));
  
    return (
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>Expense vs Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart
              data={formattedData}
              margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `₹${v.toLocaleString()}`} />
              <Tooltip
                formatter={(value: number) => `₹${value.toLocaleString()}`}
                labelStyle={{ fontWeight: "bold" }}
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  borderColor: "#e5e7eb",
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Area
                type="monotone"
                dataKey="total_expenses"
                name="Expenses"
                stroke="#f43f5e"
                fillOpacity={1}
                fill="url(#colorExpense)"
              />
              <Area
                type="monotone"
                dataKey="total_revenue"
                name="Revenue"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };
  
  export default ExpenseVsRevenueAreaChart;
  