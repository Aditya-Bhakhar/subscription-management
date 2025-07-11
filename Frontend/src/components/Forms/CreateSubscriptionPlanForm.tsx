"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import {
  SubscriptionPlan,
  CreateSubscriptionPlanDTO,
  SubscriptionPlanStatus,
} from "@/types/subScriptionPlanTypes";
import { useMemo } from "react";

const subscription_planSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Subscription plan name must be between 2 and 50 characters")
    .max(50, "Subscription plan name must be between 2 and 50 characters"),
  description: z
    .string()
    .trim()
    .max(100, "Description must be maximum of 100 characters")
    .optional(),
  status: z.enum(["active", "inactive"], {
    message: "Status must be 'active' or 'inactive'",
  }),
  price: z.coerce
    .number()
    .min(0, "Price must be at least 0")
    .max(
      999999.99,
      "Price must be a valid decimal number with up to 2 decimal places"
    ),
  duration_days: z.coerce
    .number()
    .int("Duration must be a valid integer")
    .min(1, "Duration must be at least 1 day")
    .max(999999, "Duration must be a valid integer up to 999999 days"),
  features: z
    .array(z.object({ text: z.string().min(1, "Feature cannot be empty") }))
    .nonempty("At least one feature is required"),
});

type SubscriptionPlanFormValues = z.infer<typeof subscription_planSchema>;

type CreateSubscriptionPlanFormProps = {
  subscriptionPlanData: SubscriptionPlan | null;
  onSubmit: (data: SubscriptionPlanFormValues) => void;
  isLoading?: boolean;
};

export default function CreateSubscriptionPlanForm({
  subscriptionPlanData,
  onSubmit,
  isLoading,
}: CreateSubscriptionPlanFormProps) {
  const form = useForm<SubscriptionPlanFormValues>({
    resolver: zodResolver(subscription_planSchema),
    defaultValues: useMemo(
      () => ({
        name: subscriptionPlanData?.name || "",
        description: subscriptionPlanData?.description || "",
        status: subscriptionPlanData?.status || SubscriptionPlanStatus.ACTIVE,
        price: subscriptionPlanData?.price || 0,
        duration_days: subscriptionPlanData?.duration_days || 0,
        features: subscriptionPlanData?.features
          ? subscriptionPlanData.features.map((feature) => ({ text: feature }))
          : [{ text: "" }],
      }),
      [subscriptionPlanData]
    ),
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  async function handleFormSubmit(data: SubscriptionPlanFormValues) {
    console.log("Form Data:", data);
    const formattedFeatures = data.features
      .map((f) => f.text.trim())
      .filter((feature) => feature.length > 0);

    const formData: CreateSubscriptionPlanDTO = {
      name: data.name,
      description: data.description?.trim() || null,
      status: data.status as SubscriptionPlanStatus,
      price: data.price,
      duration_days: data.duration_days,
      features: formattedFeatures,
    };
    console.log("Formatted Form Data:", formData);
    try {
      await onSubmit(formData);
      form.reset();
    } catch (error) {
      console.error("Submission failed:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6 max-w-lg"
      >
        {/* Subscription Plan Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription Plan Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter subscription plan name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter description" {...field} />
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
                    <Badge className="bg-green-200 text-green-800 px-1.5 py-0 rounded-sm text-[13px] font-medium">active</Badge>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <Badge className="bg-gray-200 text-gray-800 px-1.5 py-0 rounded-sm text-[13px] font-medium">
                      inactive
                    </Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Duration */}
          <FormField
            control={form.control}
            name="duration_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter duration in days"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Features */}
        <div>
          <FormLabel className="mb-2">Features</FormLabel>
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`features.${index}.text`}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl className="my-1">
                    <Input placeholder="Enter feature" {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </FormItem>
              )}
            />
          ))}
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => append({ text: "" })}
            className="mt-3"
          >
            + Add Feature
          </Button>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex subscription_plans-center justify-center">
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
              {subscriptionPlanData
                ? "Updating Subscription Plan..."
                : "Creating Subscription Plan..."}
            </span>
          ) : subscriptionPlanData ? (
            "Update Subscription Plan"
          ) : (
            "Create Subscription Plan"
          )}
        </Button>
      </form>
    </Form>
  );
}
