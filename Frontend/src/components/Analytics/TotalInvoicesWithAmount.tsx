import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { AnalysisAPI } from "@/api/analysis";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, IndianRupee } from "lucide-react";

const TotalInvoicesWithAmount = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["totalInvoicesWithAmount"],
    queryFn: AnalysisAPI.getTotalInvoicesWithAmount,
  });

  if (isLoading) {
    return (
      <Card className="shadow-lg w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Invoice Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="w-full h-20" />
            <Skeleton className="w-full h-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg w-full bg-red-50 border-red-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-red-600">Invoice Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 text-red-500">
            <p className="text-sm">Unable to fetch data. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalInvoices = data?.data?.total_invoices ?? 0;
  const totalAmount = Number(data?.data?.total_amount) || 0;

  return (
    <Card className="shadow-lg w-full bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-xl font-semibold">Invoice Overview</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Invoices Section */}
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Total Invoices</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-3xl font-bold">{totalInvoices.toLocaleString()}</h3>
              </div>
            </div>
          </div>

          {/* Total Amount Section */}
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-lg bg-green-100">
              <IndianRupee className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-3xl font-bold">₹{totalAmount.toLocaleString()}</h3>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalInvoicesWithAmount;