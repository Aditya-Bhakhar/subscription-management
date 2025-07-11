import { useQuery } from "@tanstack/react-query";
import { AnalysisAPI } from "../../api/analysis";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const fetchInvoicePaymentStatus = async () => {
  const data = await AnalysisAPI.getInvoicePaymentStatus();
  return data;
};

const InvoicePaymentStatus = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["invoicePaymentStatus"],
    queryFn: fetchInvoicePaymentStatus,
  });

  if (isLoading) {
    return <Skeleton className="h-56 w-full rounded-lg" />;
  }

  if (error) {
    return <p className="text-red-500 text-center">Failed to load data.</p>;
  }

  const chartData = [
    {
      label: "Paid",
      total_invoices: data?.data?.paid?.total_invoices || 0,
      total_amount: data?.data?.paid?.total_amount || 0,
    },
    {
      label: "Sent",
      total_invoices: data?.data?.sent?.total_invoices || 0,
      total_amount: data?.data?.sent?.total_amount || 0,
    },
  ];

  const maxValue = Math.max(...(chartData?.map((item) => Number(item.total_invoices)) || []));

  return (
    <Card className="shadow-xl bg-white dark:bg-gray-900 transition-all border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
          Invoice Payment Status (Paid vs Sent)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-84">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData || []}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />

            <XAxis
              dataKey="label"
              tick={{ fill: "#64748B", fontSize: 14 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748B", fontSize: 14 }}
              tickLine={false}
              domain={[0, maxValue + 1]}
            />

            <Tooltip
              cursor={{ fill: "rgba(79, 70, 229, 0.2)" }} 
              contentStyle={{
                backgroundColor: "#1e293b", // Darker Gray-800 for dark mode
                color: "#f8fafc", // Light text
                borderRadius: 8,
                padding: "8px",
                fontSize: "14px",
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ color: "#6b7280" }} />

            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
              </linearGradient>
            </defs>

            <Bar
              dataKey="total_invoices"
              fill="url(#barGradient)"
              radius={[10, 10, 0, 0]}
              animationDuration={1000}
              barSize={100} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InvoicePaymentStatus;
