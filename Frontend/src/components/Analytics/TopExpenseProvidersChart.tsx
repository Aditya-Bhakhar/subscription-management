import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
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
  
  const COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];
  
  const fetchTopExpenseProviders = async (): Promise<
    {
      provider_name: string;
      expense_count: string;
      total_amount: number;
    }[]
  > => {
    const response = await AnalysisAPI.getTopExpenseProviders();
    return response.data;
  };
  
  const TopExpenseProvidersChart = () => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["topExpenseProviders"],
      queryFn: fetchTopExpenseProviders,
    });
  
    if (isLoading) {
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Top 5 Expense Providers</CardTitle>
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
            <CardTitle>Top 5 Expense Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Unable to fetch data.</p>
          </CardContent>
        </Card>
      );
    }
  
    return (
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>Top 5 Expense Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <YAxis
                dataKey="provider_name"
                type="category"
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => `₹${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  borderColor: "#e5e7eb",
                }}
              />
              <Bar dataKey="total_amount" radius={[0, 10, 10, 0]} barSize={24}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };
  
  export default TopExpenseProvidersChart;
  