import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, Controller, FormProvider } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Date_picker from "../Date_picker_comp-511.tsx";
// Define Invoice Types
type InvoiceStatus =
  | "pending"
  | "generated"
  | "sent"
  | "paid"
  | "overdue"
  | "canceled"
  | "failed"
  | "refunded";

interface Invoice {
  id: string;
  total_amount: number;
  status: InvoiceStatus;
  due_date?: Date;
  notes?: string;
}

// Invoice Status Options
const invoiceStatuses: InvoiceStatus[] = [
  "pending",
  "generated",
  "sent",
  "paid",
  "overdue",
  "canceled",
  "failed",
  "refunded",
];

const invoiceSchema = z.object({
  total_amount: z.coerce
    .number()
    .min(0, "Total amount must be at least 0")
    .max(
      999999.99,
      "Total amount must be a valid decimal number with up to 2 decimal places"
    )
    .refine((value) => /^\d+(\.\d{1,2})?$/.test(value.toString()), {
      message:
        "Total amount must be a valid decimal number with up to 2 decimal places",
    }),
  status: z.enum([
    "pending",
    "generated",
    "sent",
    "paid",
    "overdue",
    "canceled",
    "failed",
    "refunded",
  ]),
  due_date: z.preprocess((value) => {
    if (typeof value === "string" || value instanceof Date) {
      return new Date(value);
    }
    return value;
  }, z.date({ required_error: "Due date is required" })),
  notes: z.string().max(500, "Notes must be under 500 characters").optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export default function EditInvoiceDialogForm({
  isEditModalOpen,
  setIsEditModalOpen,
  selectedInvoice,
  handleSaveInvoice,
  updateInvoiceMutation,
}: {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  selectedInvoice: Invoice | null;
  handleSaveInvoice: (invoice: Invoice) => void;
  updateInvoiceMutation: { isPending: boolean };
}) {
  // Initialize form
  const formMethods = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: selectedInvoice || {
      total_amount: 0,
      status: "pending",
      due_date: undefined,
      notes: "",
    },
  });
  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors },
  } = formMethods;
  // console.log("Type of due_date:", typeof selectedInvoice?.due_date);
  // console.log("Value of due_date:", selectedInvoice?.due_date);
  // Update form values when selectedInvoice changes
  useEffect(() => {
    if (selectedInvoice) {
      setValue("total_amount", selectedInvoice.total_amount);
      setValue("status", selectedInvoice.status);

      // Convert due_date to a Date object before setting it
      setValue(
        "due_date",
        selectedInvoice.due_date
          ? new Date(selectedInvoice.due_date)
          : new Date()
      );

      setValue("notes", selectedInvoice.notes ?? "");
    }
  }, [selectedInvoice, setValue]);

  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="w-[350px]">
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
          <DialogDescription>
            Modify the details of the invoice.
          </DialogDescription>
        </DialogHeader>

        {/* Use react-hook-form */}
        <FormProvider {...formMethods}>
          <form
            onSubmit={handleSubmit((data) => {
              handleSaveInvoice({
                ...selectedInvoice!,
                ...data,
                due_date: data.due_date ?? undefined, // Ensure correct type
                notes: data.notes ?? undefined, // Ensure null handling
              });
            })}
          >
            <div className="mb-4">
              {/* Total Amount */}
              <label
                htmlFor="total_amount"
                className="block text-sm font-medium"
              >
                Total Amount
              </label>
              <input
                type="number"
                id="total_amount"
                step="any"
                {...register("total_amount", {
                  required: true,
                })}
                className="w-full p-2 mt-1 border rounded-md"
              />
              {errors.total_amount && (
                <p className="text-red-500 text-sm">
                  {errors.total_amount.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              {/* Status - Controlled Component */}
              <label htmlFor="status" className="block text-sm font-medium">
                Status
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {invoiceStatuses.map((status) => (
                        <SelectItem value={status} key={status}>
                          <Badge
                            className={cn(
                              "px-2 py-0.5 rounded-md text-[13px] font-semibold capitalize",
                              status === "pending" &&
                                "bg-yellow-100 text-yellow-700",
                              status === "generated" &&
                                "bg-blue-100 text-blue-700",
                              status === "sent" &&
                                "bg-indigo-100 text-indigo-700",
                              status === "paid" &&
                                "bg-green-100 text-green-700",
                              status === "overdue" && "bg-red-100 text-red-700",
                              status === "canceled" &&
                                "bg-gray-200 text-gray-700",
                              status === "failed" && "bg-red-200 text-red-800",
                              status === "refunded" &&
                                "bg-purple-100 text-purple-700"
                            )}
                          >
                            {status}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="mb-4">
              {/* Due Date - Controlled Component */}
              <label htmlFor="due_date" className="block text-sm font-medium">
                Due Date
              </label>
              <Controller
                name="due_date"
                control={control}
                rules={{ required: "Due date is required" }}
                render={({ field, fieldState }) => (
                  <div>
                    <Date_picker
                      value={field.value ? new Date(field.value) : null} // Ensure valid Date
                      onChange={(date) => field.onChange(date)} // Prevents passing `undefined`
                      resetKey={
                        selectedInvoice?.id ? Number(selectedInvoice.id) : 0
                      }
                    />
                    {fieldState.error && ( // Show error if due_date is missing
                      <p className="text-red-500 text-sm">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
              {errors.due_date && (
                <p className="text-red-500 text-sm">
                  {errors.due_date.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              {/* Notes */}
              <label htmlFor="notes" className="block text-sm font-medium">
                Notes
              </label>
              <textarea
                id="notes"
                {...register("notes")}
                className="w-full p-2 mt-1 border rounded-md"
              />
              {errors.notes && (
                <p className="text-red-500 text-sm">{errors.notes.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={updateInvoiceMutation.isPending}
              className="w-full"
            >
              Save Invoice
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
