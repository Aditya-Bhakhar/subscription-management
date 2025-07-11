// src/controllers/customerController.ts

import { NextFunction, Request, Response } from "express";
import {
  createCustomerService,
  deleteCustomerByIdService,
  getAllCustomersService,
  getCustomerByEmailService,
  getCustomerByIdService,
  patchUpdateCustomerByIdService,
  putUpdateCustomerByIdService,
} from "../services/customerService.js";
import { handleResponse } from "../services/responseHandler.js";

export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstname, lastname, email, phone_number, address } = req.body;
  try {
    if (!firstname || !lastname || !email || !phone_number || !address) {
      throw new Error("All fields are required");
    }
    const user = await getCustomerByEmailService(email);
    if (user) {
      handleResponse(res, 400, "Customer already exists with this email");
    }
    const createdCustomer = await createCustomerService({
      firstname,
      lastname,
      email,
      phone_number,
      address,
    });
    handleResponse(res, 201, "Customer created successfully...", {
      customer: createdCustomer,
    });
  } catch (error) {
    console.error("ERROR: Error creating customer controller: ", error);
    next(error);
  }
};

export const getAllCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const sortBy = (req.query.sortby as string) || "updated_at";
    const order = (req.query.order as string) || "desc";
    const { customers, totalCustomers } = await getAllCustomersService(
      page,
      limit,
      sortBy,
      order
    );
    const totalPages = Math.ceil(totalCustomers / limit);
    const pagination = { page, limit, totalCustomers, totalPages };
    handleResponse(res, 200, "All Customers fetched successfully...", {
      customers,
      pagination,
    });
  } catch (error) {
    console.error("ERROR: Error getting all customers controller: ", error);
    next(error);
  }
};

export const getCustomerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "Customer ID is required");
    const customer = await getCustomerByIdService(id);
    if (!customer) return handleResponse(res, 404, "Customer not found");
    handleResponse(res, 200, "Customer retrieved successfully...", {
      customer,
    });
  } catch (error) {
    console.error("ERROR: Error getting customer by id controller: ", error);
    next(error);
  }
};

export const putUpdateCustomerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const { firstname, lastname, email, phone_number, address } = req.body;
    if (!id) return handleResponse(res, 400, "Id is required");
    const customer = await getCustomerByIdService(id);
    if (!customer) return handleResponse(res, 404, "Customer not found");
    const updatedCustomer = await putUpdateCustomerByIdService(
      id,
      firstname,
      lastname,
      email,
      phone_number,
      address
    );
    handleResponse(res, 200, "Customer put updated successfully...", {
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("ERROR: Error put updatedating customer: ", error);
    next(error);
  }
};

export const patchUpdateCustomerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "Id is required!");
    const customer = await getCustomerByIdService(id);
    if (!customer) return handleResponse(res, 404, "Customer not found!");
    const updates = req.body;
    const updatedCustomer = await patchUpdateCustomerByIdService(id, updates);
    handleResponse(res, 200, "Customer patch updated successfully...", {
      customer: updatedCustomer,
    });
  } catch (error) {
    console.log("ERROR: Error patch updating customer: ", error);
    next(error);
  }
};

export const deleteCustomerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "Customer ID is required");
    const customer = await getCustomerByIdService(id);
    if (!customer) return handleResponse(res, 404, "Customer not found");
    const deletedCustomer = await deleteCustomerByIdService(id);
    console.log(deletedCustomer);
    
    handleResponse(res, 200, "Customer deleted successfully...", {
      customer: deletedCustomer,
    });
  } catch (error) {
    console.error("ERROR: Error deleting customer: ", error);
    next(error);
  }
};
