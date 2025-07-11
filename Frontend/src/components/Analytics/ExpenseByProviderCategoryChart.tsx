import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
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

// Professional gradient shades of blue-violet
const BAR_GRADIENT_ID = "barGradient";

const fetchExpenseByProvider = async (): Promise<
  {
    provider: string;
    totalamount: number;
    count: string;
  }[]
> => {
  const response = await AnalysisAPI.getExpenseByProviderCategory();
  return response.data;
};

const ExpenseByProviderCategoryChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["expenseByProvider"],
    queryFn: fetchExpenseByProvider,
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Expenses by Provider</CardTitle>
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
          <CardTitle>Expenses by Provider</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Couldn’t load chart data.
          </p>
        </CardContent>
      </Card>
    );
  }

  const sortedData = [...data].sort((a, b) => b.totalamount - a.totalamount);

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">
          Top Expense Providers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 20, right: 40, left: 10, bottom: 20 }}
          >
            {/* Gradient Definition */}
            <defs>
              <linearGradient id={BAR_GRADIENT_ID} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              type="number"
              tickFormatter={(val) => `₹${val.toLocaleString()}`}
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="provider"
              width={160}
              stroke="#9ca3af"
              tick={{ fontSize: 13, fontWeight: 500, fill: "#1f2937" }}
            />
            <Tooltip
              formatter={(value: number) => `₹${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                borderColor: "#e5e7eb",
                color: "#111827",
              }}
            />
            <Bar
              dataKey="totalamount"
              fill={`url(#${BAR_GRADIENT_ID})`}
              radius={[0, 6, 6, 0]}
              barSize={20}
            >
              <LabelList
                dataKey="totalamount"
                position="right"
                formatter={(value: number) => `₹${value.toLocaleString()}`}
                fill="#374151"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseByProviderCategoryChart;
