import { apiClient } from "./apiClient.ts";
import { Customer, CreateCustomerDTO, UpdateCustomerDTO, ApiResponse } from "../types/customerTypes.ts";

const CUSTOMER_ENDPOINT = "/customer";

export const CustomerAPI = {
  getAllCustomers: async (): Promise<ApiResponse> => {
    const response = await apiClient.get(CUSTOMER_ENDPOINT);
    return response.data;
  },
  getCustomerById: async (id: string): Promise<Customer> => {
    const response = await apiClient.get(`${CUSTOMER_ENDPOINT}/${id}`);
    return response.data;
  },
  createCustomer: async (customerData: CreateCustomerDTO): Promise<Customer> => {
    const response = await apiClient.post(CUSTOMER_ENDPOINT, customerData);
    return response.data;
  },
  putUpdateCustomer: async (id: string, customerData: UpdateCustomerDTO): Promise<Customer> => {
    const response = await apiClient.put(`${CUSTOMER_ENDPOINT}/${id}`, customerData);
    return response.data;
  },
  patchUpdateCustomer: async (
    id: string,
    customerData: Partial<UpdateCustomerDTO>
  ): Promise<Customer> => {
    const response = await apiClient.patch(`${CUSTOMER_ENDPOINT}/${id}`, customerData);
    return response.data;
  },
  deleteCustomer: async (id: string): Promise<void> => {
    await apiClient.delete(`${CUSTOMER_ENDPOINT}/${id}`);
  },
};
