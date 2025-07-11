"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import SelectWithSearchAndBtn from "../SelectWithSearchAndBtn_comp-230.tsx";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import SwitchComponent from "../SwitchComponent_comp-186.tsx";
import {
  AssignSubscription,
  AssignSubscriptionData,
  CreateAssignSubscriptionDTO,
} from "@/types/assignSubscriptionTypes.ts";
import { Skeleton } from "../ui/skeleton.tsx";

// // Validation schema
// const isValidISODate = (date: string) => !isNaN(Date.parse(date));

const subscriptionSchema = z.object({
  customer: z.object({
    value: z.string().min(1, "Customer is required"),
    label: z.string(),
  }),
  plan: z.object({
    value: z.string().min(1, "Subscription Plan is required"),
    label: z.string(),
  }),
  status: z
    .enum([
      "pending",
      "active",
      "expired",
      "canceled",
      "suspended",
      "renewed",
      "failed",
    ])
    .default("active"),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  auto_renew: z.boolean().default(false),
  items: z
    .array(
      z.object({
        item_id: z.object({
          value: z.string().min(1, "Item is required"),
          label: z.string(),
        }),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one item is required"),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

type CreateSubscriptionFormProps = {
  assignSubscriptionData: AssignSubscriptionData | null;
  onSubmit: (data: CreateAssignSubscriptionDTO) => void;
  isLoading?: boolean;
  assignSubscriptions: AssignSubscription[];
  subscriptionsLoading: boolean;
  subscriptionsError: unknown;
  customers: { value: string; label: string }[] | undefined;
  customersLoading: boolean;
  customersError: unknown;
  subscriptionPlans: { value: string; label: string }[] | undefined;
  subscriptionPlansLoading: boolean;
  subscriptionPlansError: unknown;
  items: { value: string; label: string }[] | undefined;
  itemsLoading: boolean;
  itemsError: unknown;
};

export default function CreateSubscriptionForm({
  assignSubscriptionData,
  onSubmit,
  isLoading,
  assignSubscriptions,
  subscriptionsLoading,
  subscriptionsError,
  customers,
  customersLoading,
  customersError,
  subscriptionPlans,
  subscriptionPlansLoading,
  subscriptionPlansError,
  items,
  itemsLoading,
  itemsError,
}: CreateSubscriptionFormProps) {
  const [resetKey, setResetKey] = useState(0);
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: useMemo(
      () => ({
        customer: {
          value: assignSubscriptionData?.customer?.customer_id || "",
          label: assignSubscriptionData?.customer?.customer_name || "",
        },
        plan: {
          value: assignSubscriptionData?.plan?.plan_id || "",
          label: assignSubscriptionData?.plan?.plan_name || "",
        },
        status: assignSubscriptionData?.status || "active",
        start_date: assignSubscriptionData?.start_date
          ? new Date(assignSubscriptionData.start_date) // Convert to Date object
          : new Date(), // Default to current date
        end_date: assignSubscriptionData?.end_date
          ? new Date(assignSubscriptionData.end_date) // Convert to Date object
          : new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Default to next year
        auto_renew: assignSubscriptionData?.auto_renew || false,
        items: assignSubscriptionData?.items
          ? assignSubscriptionData?.items.map((item) => ({
              item_id: {
                value: item.item_id || "",
                label: item.item_name || "",
              },
              quantity: item.quantity || 1,
            }))
          : [
              {
                item_id: {
                  value: "",
                  label: "",
                },
                quantity: 1,
              },
            ],
      }),
      [assignSubscriptionData]
    ),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  function mapFormToDTO(
    data: SubscriptionFormValues
  ): CreateAssignSubscriptionDTO {
    return {
      customer_id: data.customer?.value || "",
      plan_id: data.plan?.value || "",
      status: data.status,
      start_date: data.start_date ? data.start_date.toISOString() : "", // Convert to ISO string
      end_date: data.end_date ? data.end_date.toISOString() : "", // Convert to ISO string
      auto_renew: data.auto_renew,
      items: data.items.map((item) => ({
        item_id: item.item_id?.value || "",
        quantity: item.quantity,
      })),
    };
  }

  function handleFormSubmit(data: SubscriptionFormValues) {
    const payload = mapFormToDTO(data);
    console.log("Form Data:", data);
    console.log("Mapped Payload:", payload);
    onSubmit(payload);
    form.reset();
    setResetKey((prevKey) => prevKey + 1);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6 max-w-lg"
      >
        {/* Customer */}
        <FormField
          control={form.control}
          name="customer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <FormControl>
                {customers ? (
                  <SelectWithSearchAndBtn
                    value={field.value}
                    onChange={(selected) => {
                      console.log("Selected Customer:", selected);
                      field.onChange(selected);
                    }}
                    options={customers}
                    placeholder="Select Customer"
                    navigateTo="customer"
                    createBtnName="Create Customer"
                  />
                ) : (
                  <Skeleton />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Plan */}
        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription Plan</FormLabel>
              <FormControl>
                {subscriptionPlans ? (
                  <SelectWithSearchAndBtn
                    value={field.value}
                    onChange={(selected) => {
                      console.log("Selected Plan:", selected);
                      field.onChange(selected);
                    }}
                    options={subscriptionPlans}
                    placeholder="Select Subscription Plan"
                    navigateTo="subscription-plan"
                    createBtnName="Create Subscription Plan"
                  />
                ) : (
                  <Skeleton />
                )}
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
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">
                    <Badge className="px-1.5 py-0 rounded-sm text-[13px] font-medium bg-yellow-200 text-yellow-800">
                      Pending
                    </Badge>
                  </SelectItem>
                  <SelectItem value="active">
                    <Badge className="px-1.5 py-0 rounded-sm text-[13px] font-medium bg-green-200 text-green-800">
                      Active
                    </Badge>
                  </SelectItem>
                  <SelectItem value="suspended">
                    <Badge className="px-1.5 py-0 rounded-sm text-[13px] font-medium bg-orange-200 text-orange-800">
                      Suspended
                    </Badge>
                  </SelectItem>
                  <SelectItem value="expired">
                    <Badge className="px-1.5 py-0 rounded-sm text-[13px] font-medium bg-red-200 text-red-800">
                      Expired
                    </Badge>
                  </SelectItem>
                  <SelectItem value="canceled">
                    <Badge className="px-1.5 py-0 rounded-sm text-[13px] font-medium bg-gray-200 text-gray-800">
                      Canceled
                    </Badge>
                  </SelectItem>
                  <SelectItem value="renewed">
                    <Badge className="px-1.5 py-0 rounded-sm text-[13px] font-medium bg-blue-200 text-blue-800">
                      Renewed
                    </Badge>
                  </SelectItem>
                  <SelectItem value="failed">
                    <Badge className="px-1.5 py-0 rounded-sm text-[13px] font-medium bg-purple-200 text-purple-800">
                      Failed
                    </Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start and End Dates */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Date_picker
                    resetKey={resetKey}
                    value={field.value} // ✅ Format Date -> String
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
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

        {/* Auto Renew */}
        <FormField
          control={form.control}
          name="auto_renew"
          render={({ field }) => (
            <FormItem>
              <SwitchComponent
                checked={field.value}
                onCheckedChange={field.onChange}
                label="Auto Renew"
                subLabel="Optional"
                description="Enable to auto renew the subscription."
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Items List */}
        <div>
          <FormLabel className="">Items</FormLabel>
          <div className="flex flex-col gap-3 mt-1">
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_100px_40px] gap-3 items-center"
              >
                {/* Item Select */}
                <FormField
                  control={form.control}
                  name={`items.${index}.item_id`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {items ? (
                          <SelectWithSearchAndBtn
                            value={field.value}
                            onChange={(selected) => {
                              console.log("Selected Item:", selected);
                              field.onChange(selected);
                            }}
                            options={items}
                            placeholder="Select Item"
                            navigateTo="item"
                            createBtnName="Create Item"
                          />
                        ) : (
                          <Skeleton />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Quantity Input */}
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Qty"
                          min={1}
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remove Button */}
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {/* Add Button */}
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-fit"
              onClick={() =>
                append({ item_id: { value: "", label: "" }, quantity: 1 })
              }
            >
              + Add Item
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex subscriptions-center justify-center">
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
              {assignSubscriptionData
                ? "Updating Assigned Subscription..."
                : "Assigning Subscription..."}
            </span>
          ) : assignSubscriptionData ? (
            "Update Assigned Subscription"
          ) : (
            "Assign Subscription"
          )}
        </Button>
      </form>
    </Form>
  );
}
