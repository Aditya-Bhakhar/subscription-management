import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import axios from "axios";

interface invoiceStatusTypes {
  status:
    | "pending"
    | "generated"
    | "sent"
    | "paid"
    | "overdue"
    | "canceled"
    | "failed"
    | "refunded";
}

const InvoiceFilterForm = ({
  onFilter,
}: {
  onFilter: (data: {
    status: string;
    customer_name: string;
    plan_name: string;
  }) => void;
}) => {
  const form = useForm({
    defaultValues: {
      status: "",
      customer_name: "",
      plan_name: "",
    },
  });

  const onSubmit = async (data: {
    status: string;
    customer_name: string;
    plan_name: string;
  }) => {
    const query = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
      if (value) query.append(key, value);
    });

    const res = await axios.get(`/api/invoice?${query.toString()}`);
    onFilter(res.data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid sm:grid-cols-4 gap-4 items-end"
      >
        {/* Status Filter */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* <SelectItem value="">Select</SelectItem> */}
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Customer Name Filter */}
        <FormField
          control={form.control}
          name="customer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <FormControl>
                <Input placeholder="Customer name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Plan Name Filter */}
        <FormField
          control={form.control}
          name="plan_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan</FormLabel>
              <FormControl>
                <Input placeholder="Plan name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="mt-1">
          Apply Filters
        </Button>
      </form>
    </Form>
  );
};

export default InvoiceFilterForm;
