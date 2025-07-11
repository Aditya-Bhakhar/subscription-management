// src/controllers/invoiceController.ts

import { NextFunction, Request, Response } from "express";
import { handleResponse } from "../services/responseHandler.js";
import { getInvoiceByCustomerAndSubscriptionIdModel } from "../models/invoiceModel.js";
import {
  createInvoiceService,
  deleteInvoicesByIdsService,
  getAllInvoicesService,
  getInvoiceByCustomerAndSubscriptionIdService,
  getInvoiceByIdService,
  getInvoiceByInvoiceNumberService,
  getInvoicesByIdsService,
  patchUpdateInvoiceByIdService,
} from "../services/invoiceService.js";

export const createInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      customer_id,
      customer_name,
      customer_email,
      subscription_id,
      plan_name,
      plan_price,
      total_amount,
      items,
      notes,
    } = req.body;
    if (
      !customer_id ||
      !customer_name ||
      !customer_email ||
      !subscription_id ||
      !plan_name ||
      plan_price === undefined ||
      total_amount === undefined ||
      !items
    ) {
      throw new Error("All fields are required");
    }
    const existingInvoice = await getInvoiceByCustomerAndSubscriptionIdService(
      customer_id,
      subscription_id
    );
    if (existingInvoice) {
      return handleResponse(
        res,
        400,
        "Invoice already exist to this customer with this subscription!"
      );
    }
    const createdInvoice = await createInvoiceService({
      customer_id,
      customer_name,
      customer_email,
      subscription_id,
      plan_name,
      plan_price,
      total_amount,
      items,
      notes,
    });
    handleResponse(res, 201, "Invoice created successfully...", {
      invoice: createdInvoice,
    });
  } catch (error) {
    console.error("ERROR: Failed to create invoice (controller): ", error);
    next(error);
  }
};

export const getAllInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const sortBy = (req.query.sortby as string) || "updated_at";
    const order = (req.query.order as string) || "desc";
    const { invoices, totalInvoices } = await getAllInvoicesService(
      page,
      limit,
      sortBy,
      order
    );
    const totalPages = Math.ceil(totalInvoices / limit);
    const pagination = { page, limit, totalInvoices, totalPages };
    handleResponse(res, 200, "All invoices fetched successfully...", {
      invoices,
      pagination,
    });
  } catch (error) {
    console.error("ERROR: Failed to fetch all invoices (controller): ", error);
    next(error);
  }
};

export const getInvoiceByCustomerAndSubscriptionId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer_id = req.params.customerId;
    const subscription_id = req.params.subscriptionId;
    if (!customer_id || !subscription_id) {
      return handleResponse(
        res,
        400,
        "Customer ID and Subscription ID are required"
      );
    }
    const invoice = await getInvoiceByCustomerAndSubscriptionIdService(
      customer_id,
      subscription_id
    );
    if (!invoice) {
      return handleResponse(
        res,
        404,
        "Invoice not found for this customer or subscription"
      );
    }
    handleResponse(res, 200, "Invoice fetched successfully...", { invoice });
  } catch (error) {
    console.error(
      "ERROR: Failed to fetch invoice by customer and subscription ID (controller): ",
      error
    );
    next(error);
  }
};

export const getInvoiceByInvoiceNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const invoice_number = req.params.invoiceNumber;
    if (!invoice_number) {
      return handleResponse(res, 400, "Invoice Number is required");
    }
    const invoice = await getInvoiceByInvoiceNumberService(invoice_number);
    if (!invoice) {
      return handleResponse(
        res,
        404,
        "Invoice not found for this invoice number"
      );
    }
    handleResponse(res, 200, "Invoice fetched successfully...", { invoice });
  } catch (error) {
    console.error(
      "ERROR: Failed to fetch invoice by invoice number (controller): ",
      error
    );
    next(error);
  }
};

export const getInvoiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) {
      return handleResponse(res, 400, "Invoice ID is required");
    }
    const invoice = await getInvoiceByIdService(id);
    if (!invoice) {
      return handleResponse(res, 404, "Invoice not found for this ID");
    }
    handleResponse(res, 200, "Invoice fetched successfully...", { invoice });
  } catch (error) {
    console.error("ERROR: Failed to fetch invoice by ID (controller): ", error);
    next(error);
  }
};

export const patchUpdateInvoiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    if (!id) {
      return handleResponse(res, 400, "Invoice ID is required");
    }
    const invoice = await getInvoiceByIdService(id);
    if (!invoice) {
      return handleResponse(res, 404, "Invoice not found for this ID");
    }
    const updatedInvoice = await patchUpdateInvoiceByIdService(id, req.body);
    handleResponse(res, 200, "Invoice partially updated successfully...", {
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error(
      "ERROR: Failed to partially update invoice by ID (PATCH) (controller): ",
      error
    );
    next(error);
  }
};

export const deleteInvoicesByIds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { invoiceIds } = req.body;
    if (!invoiceIds || !Array.isArray(invoiceIds) || invoiceIds.length === 0) {
      return handleResponse(
        res,
        400,
        "Invoice IDs are required and must be a non-empty array"
      );
    }
    const invoices = await getInvoicesByIdsService(invoiceIds);
    if (!invoices || invoices.length === 0) {
      return handleResponse(res, 404, "No invoices found for the provided IDs");
    }
    const deletedInvoices = await deleteInvoicesByIdsService(invoiceIds);
    if (deletedInvoices && deletedInvoices.length > 0) {
      handleResponse(res, 200, "Invoices deleted successfully", {
        invoices: deletedInvoices,
      });
    } else {
      handleResponse(res, 404, "No invoices were deleted");
    }
  } catch (error) {
    console.error(
      "ERROR: Failed to delete invoices by IDs (controller): ",
      error
    );
    next(error);
  }
};
