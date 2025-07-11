import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomerAPI } from "../api/customers.ts";
import {
  // Customer,
  CreateCustomerDTO,
  UpdateCustomerDTO,
} from "../types/customerTypes.ts";

export const useGetAllCustomers = () => {
  return useQuery({
    queryKey: [
      "customers",
      // { page: 1, pageSize: 10 }
    ],
    queryFn: CustomerAPI.getAllCustomers,
  });
};

export const useGetCustomerById = (id: string) => {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: () => CustomerAPI.getCustomerById(id),
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customerData: CreateCustomerDTO) =>
      CustomerAPI.createCustomer(customerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const usePutUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      customerData,
    }: {
      id: string;
      customerData: UpdateCustomerDTO;
    }) => CustomerAPI.putUpdateCustomer(id, customerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const usePatchUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      customerData,
    }: {
      id: string;
      customerData: Partial<UpdateCustomerDTO>;
    }) => CustomerAPI.patchUpdateCustomer(id, customerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CustomerAPI.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};
