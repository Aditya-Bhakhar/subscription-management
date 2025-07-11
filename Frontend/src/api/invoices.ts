import { apiClient } from "./apiClient.ts";
import {
  Invoice,
  CreateInvoiceDTO,
  UpdateInvoiceDTO,
  ApiResponse,
} from "../types/invoiceTypes.ts";

const INVOICE_ENDPOINT = "/invoice";

export const InvoiceAPI = {
  getAllInvoices: async (): Promise<ApiResponse> => {
    const response = await apiClient.get(INVOICE_ENDPOINT);
    return response.data;
  },
  // getAllInvoices: async (
  //   filters?: Record<string, any>
  // ): Promise<ApiResponse> => {
  //   const query = filters ? `?${new URLSearchParams(filters).toString()}` : "";
  //   const response = await apiClient.get(`${INVOICE_ENDPOINT}${query}`);
  //   return response.data;
  // },
  getInvoiceById: async (id: string): Promise<Invoice> => {
    const response = await apiClient.get(`${INVOICE_ENDPOINT}/${id}`);
    return response.data;
  },
  createInvoice: async (invoiceData: CreateInvoiceDTO): Promise<Invoice> => {
    const response = await apiClient.post(INVOICE_ENDPOINT, invoiceData);
    return response.data;
  },
  patchUpdateInvoice: async (
    id: string,
    invoiceData: Partial<UpdateInvoiceDTO>
  ): Promise<Invoice> => {
    const response = await apiClient.patch(
      `${INVOICE_ENDPOINT}/${id}`,
      invoiceData
    );
    return response.data;
  },
  deleteInvoices: async (invoiceIds: string[]): Promise<void> => {
    await apiClient.delete(`${INVOICE_ENDPOINT}/batch-delete`, {
      data: { invoiceIds },
    });
  },
};
