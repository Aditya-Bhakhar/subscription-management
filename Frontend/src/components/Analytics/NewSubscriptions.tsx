import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnalysisAPI } from "@/api/analysis";
import { format, isAfter } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const fetchNewSubscriptions = async (
  startDate: string,
  endDate: string
): Promise<{ new_subscriptions: number }> => {
  const response = await AnalysisAPI.getNewSubscriptions(startDate, endDate);
  return response.data;
};

const NewSubscriptions = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["newSubscriptions", startDate, endDate],
    queryFn: () =>
      fetchNewSubscriptions(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      ),
    enabled: !isAfter(startDate, endDate),
    // You can also use onError for additional error handling if desired.
  });

  return (
    <Card className="shadow-lg dark:bg-gray-900 transition-all">
      <CardHeader className="pb-2 border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-lg font-semibold dark:text-white">
          New Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Date Pickers & Fetch Button */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Start Date */}
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Start Date
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full mt-1">
                  {format(startDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              End Date
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full mt-1">
                  {format(endDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setEndDate(date)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Fetch Button */}
          <div className="flex items-end">
            <Button
              onClick={() => refetch()}
              disabled={isAfter(startDate, endDate)}
              className="w-full"
              variant={isAfter(startDate, endDate) ? "destructive" : "default"}
            >
              Fetch Data
            </Button>
          </div>
        </div>

        {/* Validation Message */}
        {isAfter(startDate, endDate) && (
          <p className="text-center text-red-500">
            Start date cannot be after end date.
          </p>
        )}

        {/* Data Display */}
        <div className="mt-4 text-center">
          {isLoading ? (
            <Skeleton className="h-8 w-32 mx-auto" />
          ) : error ? (
            <p className="text-red-500">
              Failed to load data. {error?.message || "Please try again."}
            </p>
          ) : data ? (
            <p className="text-2xl font-semibold dark:text-white">
              New Subscriptions: {data.new_subscriptions}
            </p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No data available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewSubscriptions;
