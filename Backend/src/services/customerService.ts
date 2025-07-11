// src/services/customerService.ts

import {
  createCustomerModel,
  deleteCustomerByIdModel,
  getAllCustomersModel,
  getCustomerByEmailModel,
  getCustomerByIdModel,
  patchUpdateCustomerByIdModel,
  putUpdateCustomerByIdModel,
} from "../models/customerModel.js";
import { Customer } from "../types/Customer.js";

export const createCustomerService = async (customer: Customer) => {
  const newCustomer = await createCustomerModel(customer);
  return newCustomer;
};

export const getAllCustomersService = async (
  page: number,
  limit: number,
  sortBy: string,
  order: string
) => {
  const customers = await getAllCustomersModel(page, limit, sortBy, order);
  return customers;
};

export const getCustomerByEmailService = async (email: string) => {
  const customer = await getCustomerByEmailModel(email);
  return customer;
};

export const getCustomerByIdService = async (id: string) => {
  const customer = await getCustomerByIdModel(id);
  return customer;
};

export const putUpdateCustomerByIdService = async (
  id: string,
  firstname: string,
  lastname: string,
  email: string,
  phone_number: string,
  address: string
) => {
  const updatedCustomer = await putUpdateCustomerByIdModel(
    id,
    firstname,
    lastname,
    email,
    phone_number,
    address
  );
  return updatedCustomer;
};

export const patchUpdateCustomerByIdService = async (
  id: string,
  updates: Partial<Customer>
) => {
  const updatedCustomer = await patchUpdateCustomerByIdModel(id, updates);
  return updatedCustomer;
};

export const deleteCustomerByIdService = async (id: string) => {
  const deletedCustomer = await deleteCustomerByIdModel(id);
  return deletedCustomer;
};
