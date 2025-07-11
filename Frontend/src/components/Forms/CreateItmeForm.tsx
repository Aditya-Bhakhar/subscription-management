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
import { Item } from "@/types/itemTypes";
import { useMemo } from "react";

const itemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Item name must be at least 2 characters")
    .max(25, "Item name must be at most 25 characters"),
  description: z
    .string()
    .trim()
    .max(100, "Description must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  category: z.enum(["Product", "Service"]).default("Product"),
  price: z.coerce
    .number()
    .min(0, "Price must be a positive number")
    .max(
      999999.99,
      "Price must be a valid decimal number with up to 2 decimal places"
    )
    .default(0),
  quantity: z.coerce
    .number()
    .int()
    .min(0, "Quantity must be a positive integer")
    .max(999999, "Quantity must be a positive integer")
    .default(0),
});

type ItemFormValues = z.infer<typeof itemSchema>;

type CreateItemFormProps = {
  itemData: Item | null;
  onSubmit: (data: ItemFormValues) => void;
  isLoading?: boolean;
};

export default function CreateItemForm({
  itemData,
  onSubmit,
  isLoading,
}: CreateItemFormProps) {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: useMemo(
      () => ({
        name: itemData?.name || "",
        description: itemData?.description ?? "",
        category: itemData?.category ?? "Product",
        price: itemData?.price ?? 0,
        quantity: itemData?.quantity ?? 0,
      }),
      [itemData]
    ),
  });

  function handleFormSubmit(data: ItemFormValues) {
    onSubmit(data);
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6 max-w-lg"
      >
        {/* Item Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter item name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
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
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Product">
                    <Badge className="bg-gray-200 text-gray-800 px-1.5 py-0 rounded-sm text-[13px] font-medium">Product</Badge>
                  </SelectItem>
                  <SelectItem value="Service">
                    <Badge className="bg-yellow-200 text-yellow-800 px-1.5 py-0 rounded-sm text-[13px] font-medium">
                      Service
                    </Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
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
                    {...field}
                    onChange={(e) => field.onChange(e.target.value || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quantity */}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.watch("category") === "Service"}
                    type="number"
                    placeholder="Enter quantity"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
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
              {itemData ? "Updating Item..." : "Creating Item..."}
            </span>
          ) : itemData ? (
            "Update Item"
          ) : (
            "Create Item"
          )}
        </Button>
      </form>
    </Form>
  );
}
