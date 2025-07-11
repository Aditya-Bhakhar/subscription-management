// src/services/invoiceService.ts

import pool from "../db/pool.js";
import {
  createInvoiceModel,
  deleteInvoicesByIdsModel,
  getAllInvoicesModel,
  getInvoiceByCustomerAndSubscriptionIdModel,
  getInvoiceByIdModel,
  getInvoiceByInvoiceNumberModel,
  getInvoicesByIdsModel,
  patchUpdateInvoiceByIdModel,
} from "../models/invoiceModel.js";
import { Invoice } from "../types/Invoice.js";
import { generateInvoicePDF } from "./invoicePdfService.js";

export const generateInvoiceNumber = async (): Promise<string> => {
  const { rows } = await pool.query("SELECT COUNT(*) FROM invoices");
  const count = rows[0].count || 0;
  const invoiceNumber = `INV-${new Date()
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "")}-${String(count + 1)}`;
  return invoiceNumber;
};

export const createInvoiceService = async (invoice: Invoice) => {
  try {
    const createdInvoice = await createInvoiceModel(invoice);
    const pdfUrl = await generateInvoicePDF(createdInvoice);

    const updatedInvoice = await patchUpdateInvoiceByIdModel(
      createdInvoice.id as string,
      { pdf_url: pdfUrl }
    );

    return updatedInvoice;
  } catch (error) {
    console.error("ERROR: Create Invoice Service Failed (service): ", error);
    throw error;
  }
};

export const getAllInvoicesService = async (
  page: number,
  limit: number,
  sortBy: string,
  order: string
) => {
  const invoices = await getAllInvoicesModel(page, limit, sortBy, order);
  return invoices;
};

export const getInvoiceByCustomerAndSubscriptionIdService = async (
  customer_id: string,
  subscription_id: string
) => {
  const invoice = await getInvoiceByCustomerAndSubscriptionIdModel(
    customer_id,
    subscription_id
  );
  return invoice;
};

export const getInvoiceByInvoiceNumberService = async (
  invoiceNumber: string
) => {
  const invoice = await getInvoiceByInvoiceNumberModel(invoiceNumber);
  return invoice;
};

export const getInvoiceByIdService = async (id: string) => {
  const invoice = await getInvoiceByIdModel(id);
  return invoice;
};

export const getInvoicesByIdsService = async (invoiceIds: string[]) => {
  const invoices = await getInvoicesByIdsModel(invoiceIds);
  return invoices;
};

export const patchUpdateInvoiceByIdService = async (
  id: string,
  updates: Partial<Invoice>
) => {
  const updatedInvoice = await patchUpdateInvoiceByIdModel(id, updates);
  return updatedInvoice;
};

export const deleteInvoicesByIdsService = async (invoiceIds: string[]) => {
  const deletedInvoices = await deleteInvoicesByIdsModel(invoiceIds);
  return deletedInvoices;
};
