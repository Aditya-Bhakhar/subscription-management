"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Customer } from "@/types/customerTypes";
import { useMemo } from "react";

const customerSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(10, "Max 10 characters"),
  lastname: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(10, "Max 10 characters"),
  email: z.string().trim().email("Invalid email format"),
  phone_number: z
    .string()
    .trim()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d{10}$/, "Phone number must contain only digits"),
  address: z.string().optional().default(""),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

type CreateCustomerFormProps = {
  customerData: Customer | null;
  onSubmit: (data: z.infer<typeof customerSchema>) => void;
  isLoading?: boolean;
};

export default function CreateCustomerForm({
  customerData,
  onSubmit,
  isLoading,
}: CreateCustomerFormProps) {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: useMemo(
      () => ({
        firstname: customerData?.firstname || "",
        lastname: customerData?.lastname || "",
        email: customerData?.email || "",
        phone_number: customerData?.phone_number || "",
        address: customerData?.address || "",
      }),
      [customerData]
    ),
  });

  function handleFormSubmit(data: z.infer<typeof customerSchema>) {
    onSubmit(data);
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          {/* First Name */}
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input placeholder="Phone number" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Phone number must be exactly 10 digits and don't add prefix.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center">
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
                {customerData ? "Updating Customer..." : "Creating Customer..."}
              </span>
            ) : customerData ? (
              "Update Customer"
            ) : (
              "Create Customer"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
