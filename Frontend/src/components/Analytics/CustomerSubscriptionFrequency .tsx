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

// Fetch function using API call
const fetchSubscriptionFrequency = async () => {
  const response = await AnalysisAPI.getCustomerSubscriptionFrequency();
  return response.data;
};

const CustomerSubscriptionFrequency = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["customerSubscriptionFrequency"],
    queryFn: fetchSubscriptionFrequency,
  });

  // Show loader when fetching data
  if (isLoading) {
    return <Skeleton className="h-56 w-full rounded-lg" />;
  }

  // Show error message if API fails
  if (error) {
    return <p className="text-red-500 text-center">Failed to load data.</p>;
  }

  // Sort and get top 5 customers
  const topCustomers = data
    ?.sort(
      (a, b) => Number(b.subscription_count) - Number(a.subscription_count)
    )
    .slice(0, 5);

  return (
    <Card className="shadow-xl bg-white dark:bg-gray-900 transition-all border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
          Top 5 Customers by Subscription Frequency
        </CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topCustomers}>
            {/* Background Grid */}
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />

            {/* X & Y Axis */}
            <XAxis
              dataKey="firstname"
              tick={{ fill: "#64748B", fontSize: 14 }}
              tickLine={false}
            />
            <YAxis tick={{ fill: "#64748B", fontSize: 14 }} tickLine={false} />

            {/* Tooltip & Legend */}
            <Tooltip
              cursor={{ fill: "rgba(79, 70, 229, 0.2)" }} // Indigo-600 (hover effect)
              contentStyle={{
                backgroundColor: "#1e293b", // Darker Gray-800 for dark mode
                color: "#f8fafc", // Light text
                borderRadius: 8,
                padding: "8px",
                fontSize: "14px",
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ color: "#6b7280" }} />

            {/* Gradient Bar Colors */}
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
              </linearGradient>
            </defs>

            <Bar
              dataKey="subscription_count"
              fill="url(#barGradient)"
              radius={[10, 10, 0, 0]}
              animationDuration={1000}
              barSize={50} // Adjust bar thickness
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CustomerSubscriptionFrequency;
