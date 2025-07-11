import { useQuery } from "@tanstack/react-query";
import { AnalysisAPI } from "../../api/analysis";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

// Define the type based on the API response
interface CustomerLifetimeValue {
  id: string;
  firstname: string;
  lastname: string;
  lifetime_value: string;
}

// Fetch data from API
const fetchCustomerLifetimeValue = async (): Promise<CustomerLifetimeValue[]> => {
  const response = await AnalysisAPI.getCustomerLifetimeValue();
  return response.data; // Ensure API response matches the expected structure
};

const CustomerLifetimeValue = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["customerLifetimeValue"],
    queryFn: fetchCustomerLifetimeValue,
  });

  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  if (error) {
    return <p className="text-center text-red-500">Failed to load data</p>;
  }

  // Sum all lifetime values
  const totalLifetimeValue = data?.reduce(
    (sum, customer) => sum + Number(customer.lifetime_value),
    0
  );

  return (
    <Card className="shadow-lg dark:bg-gray-900 transition-all">
      <CardHeader>
        <CardTitle className="text-lg font-semibold dark:text-white">
          Customer Lifetime Value
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-center dark:text-white mb-4">
          Total: Rs. {totalLifetimeValue?.toFixed(2)}
        </p>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Customer</TableHead>
                <TableHead className="text-right">Lifetime Value (Rs.)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="text-left">
                    {customer.firstname} {customer.lastname}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    Rs. {Number(customer.lifetime_value).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerLifetimeValue;
