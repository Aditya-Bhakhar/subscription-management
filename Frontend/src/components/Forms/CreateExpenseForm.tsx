"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Date_picker from "../Date_picker_comp-511.tsx";
import { useEffect, useMemo, useState } from "react";
import { Expense } from "@/types/expenseTypes.ts";
import { toast } from "sonner";

const expenseSchema = z.object({
  expense_name: z
    .string()
    .trim()
    .min(2, "Expense name must be between 2 and 50 characters")
    .max(50, "Expense name must be between 2 and 50 characters"),
  provider_name: z
    .string()
    .trim()
    .min(2, "Expense name must be between 2 and 50 characters")
    .max(50, "Expense name must be between 2 and 50 characters"),
  amount: z.coerce
    .number()
    .min(0, "Amount must be at least 0")
    .max(
      999999.99,
      "Amount must be a valid decimal number with up to 2 decimal places"
    ),
  status: z.enum(["active", "pending", "expired", "canceled"], {
    message: "Status must be 'active', 'expired', or 'canceled'",
  }),
  purchased_date: z.coerce.date(),
  renewal_date: z
    .union([z.coerce.date(), z.literal(null)])
    .optional()
    .transform((val) => (val === undefined ? null : val)),
  notes: z
    .string()
    .max(500, "Notes must be a string with a maximum of 500 characters")
    .optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

type CreateExpenseFormProps = {
  expenseData: Expense | null;
  onSubmit: (data: ExpenseFormValues) => Promise<void>;
  isLoading?: boolean;
};

export default function CreateExpenseForm({
  expenseData,
  onSubmit,
  isLoading,
}: CreateExpenseFormProps) {
  const [resetKey, setResetKey] = useState(0);
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: useMemo(
      () => ({
        expense_name: expenseData?.expense_name || "",
        provider_name: expenseData?.provider_name || "",
        amount: expenseData?.amount || 0,
        status: expenseData?.status || "active",
        purchased_date: expenseData?.purchased_date
          ? new Date(expenseData.purchased_date) // Convert string to Date
          : new Date(), // Default to today
        renewal_date:
          expenseData?.renewal_date &&
          !isNaN(new Date(expenseData.renewal_date).getTime())
            ? new Date(expenseData.renewal_date)
            : null,
        notes: expenseData?.notes || "",
      }),
      [expenseData]
    ),
  });
  useEffect(() => {
    const date = form.getValues("renewal_date");
    console.log("renewal_date raw value:", date);
  }, [form.watch("renewal_date")]);

  function handleFormSubmit(data: ExpenseFormValues) {
    const cleanedData = {
      ...data,
      renewal_date:
        typeof data.renewal_date === "object" &&
        data.renewal_date instanceof Date &&
        !isNaN(data.renewal_date.getTime())
          ? data.renewal_date
          : null,
      purchased_date:
        data.purchased_date instanceof Date &&
        !isNaN(data.purchased_date.getTime())
          ? data.purchased_date
          : new Date(),
    };
    console.log("Form submitted with data:", cleanedData);
    const expensePromise = new Promise<ExpenseFormValues>((resolve, reject) => {
      setTimeout(() => {
        onSubmit(cleanedData)
          .then(() => resolve(cleanedData))
          .catch(reject);
      }, 1000);
    });

    toast.promise(expensePromise, {
      loading: "Submitting expense...",
      success: (submittedData: ExpenseFormValues) =>
        `Expense ${submittedData.expense_name} successfully submitted! 🎉`,
      error: "Failed to submit expense. Please try again.",
    });

    form.reset();
    setResetKey((prevKey) => prevKey + 1);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6 max-w-lg"
      >
        {/* Expense Name */}
        <FormField
          control={form.control}
          name="expense_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expense Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter expense name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Provider Name */}
        <FormField
          control={form.control}
          name="provider_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter provider name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) {
                      field.onChange(value);
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">
                      <Badge className="bg-green-200 text-green-800 px-1.5 py-0 rounded-sm text-[13px] font-medium">
                        active
                      </Badge>
                    </SelectItem>
                    <SelectItem value="pending">
                      <Badge className="bg-yellow-200 text-yellow-800 px-1.5 py-0 rounded-sm text-[13px] font-medium">
                        Pending
                      </Badge>
                    </SelectItem>
                    <SelectItem value="expired">
                      <Badge className="bg-red-200 text-red-800 px-1.5 py-0 rounded-sm text-[13px] font-medium">
                        expired
                      </Badge>
                    </SelectItem>
                    <SelectItem value="canceled">
                      <Badge className="bg-gray-200 text-gray-800 px-1.5 py-0 rounded-sm text-[13px] font-medium">
                        canceled
                      </Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Purchased date */}
          <FormField
            control={form.control}
            name="purchased_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchased at</FormLabel>
                <FormControl>
                  <Date_picker
                    resetKey={resetKey}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Renewal date */}
          <FormField
            control={form.control}
            name="renewal_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Renewal at</FormLabel>
                <FormControl>
                  <Date_picker
                    resetKey={resetKey}
                    value={
                      field.value instanceof Date &&
                      !isNaN(field.value.getTime())
                        ? field.value
                        : null
                    }
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex expenses-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {expenseData ? "Updating Expense..." : "Creating Expense..."}
            </span>
          ) : expenseData ? (
            "Update Expense"
          ) : (
            "Create Expense"
          )}
        </Button>
      </form>
    </Form>
  );
}
