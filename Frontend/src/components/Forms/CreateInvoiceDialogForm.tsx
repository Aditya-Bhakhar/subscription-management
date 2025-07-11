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
import { useMemo, useState } from "react";
import { Invoice } from "@/types/invoiceTypes.ts";

const isValidISODate = (date: string) => !isNaN(Date.parse(date));

const invoiceSchema = z.object({
  invoice_name: z
    .string()
    .trim()
    .min(2, "Invoice name must be between 2 and 50 characters")
    .max(50, "Invoice name must be between 2 and 50 characters"),
  provider_name: z
    .string()
    .trim()
    .min(2, "Invoice name must be between 2 and 50 characters")
    .max(50, "Invoice name must be between 2 and 50 characters"),
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
  purchased_date: z
    .string()
    .refine(
      isValidISODate,
      "Purchased date must be a valid ISO 8601 timestamp"
    ),
  renewal_date: z
    .string()
    .optional()
    .refine(
      (date) => !date || isValidISODate(date),
      "Renewal date must be a valid ISO 8601 timestamp"
    ),
  notes: z
    .string()
    .max(500, "Notes must be a string with a maximum of 500 characters")
    .optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

type CreateInvoiceFormProps = {
  invoiceData: Invoice | null;
  onSubmit: (data: InvoiceFormValues) => void;
  isLoading?: boolean;
};

export default function CreateInvoiceDialogForm({
  invoiceData,
  onSubmit,
  isLoading,
}: CreateInvoiceFormProps) {
  const [resetKey, setResetKey] = useState(0);
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: useMemo(
      () => ({
        invoice_name: invoiceData?.invoice_name || "",
        provider_name: invoiceData?.provider_name || "",
        amount: invoiceData?.amount || 0,
        status: invoiceData?.status || "active",
        purchased_date: invoiceData?.purchased_date || new Date().toISOString(),
        renewal_date: invoiceData?.renewal_date || undefined,
        notes: invoiceData?.notes || "",
      }),
      [invoiceData]
    ),
  });

  function handleFormSubmit(data: InvoiceFormValues) {
    onSubmit(data);
    form.reset();
    setResetKey((prevKey) => prevKey + 1);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6 max-w-lg"
      >
        {/* Invoice Name */}
        <FormField
          control={form.control}
          name="invoice_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter invoice name" {...field} />
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
                    value={field.value}
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
            <span className="flex invoices-center justify-center">
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
              {invoiceData ? "Updating Invoice..." : "Creating Invoice..."}
            </span>
          ) : invoiceData ? (
            "Update Invoice"
          ) : (
            "Create Invoice"
          )}
        </Button>
      </form>
    </Form>
  );
}
