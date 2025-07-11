import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvoiceAPI } from "../api/invoices.ts";
import {
  // Invoice,
  CreateInvoiceDTO,
  UpdateInvoiceDTO,
} from "../types/invoiceTypes.ts";

export const useGetAllInvoices = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: InvoiceAPI.getAllInvoices,
  });
};
// export const useGetAllInvoices = () => {
//   return useQuery({
//     queryKey: ["invoices", filters],
//     queryFn: InvoiceAPI.getAllInvoices,
//   });
// };

export const useGetInvoiceById = (id: string) => {
  return useQuery({
    queryKey: ["invoices", id],
    queryFn: () => InvoiceAPI.getInvoiceById(id),
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invoiceData: CreateInvoiceDTO) =>
      InvoiceAPI.createInvoice(invoiceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

export const usePatchUpdateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      invoiceData,
    }: {
      id: string;
      invoiceData: Partial<UpdateInvoiceDTO>;
    }) => InvoiceAPI.patchUpdateInvoice(id, invoiceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

export const useDeleteInvoices = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invoiceIds: string[]) => InvoiceAPI.deleteInvoices(invoiceIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};
