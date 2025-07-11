// src/services/assignSubscriptionService.ts

import pool from "../db/pool.js";
import {
  createAssignSubscriptionModel,
  deleteAssignedSubscriptionByIdModel,
  getAllAssignedSubscriptionsModel,
  getAssignedSubscriptionByCustAndPlanIdModel,
  getAssignedSubscriptionByIdModel,
  getAssignedSubscriptionsByCustomerIdModel,
  getAssignedSubscriptionsByPlanIdModel,
  patchUpdateAssignedSubscriptionByIdModel,
  putUpdateAssignedSubscriptionByIdModel,
} from "../models/assignSubscriptionModel.js";
import { patchUpdateInvoiceByIdModel } from "../models/invoiceModel.js";
import { AssignSubscription } from "../types/AssignSubscription.js";
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

export const createAssignSubscriptionService = async (
  assign_subscription: AssignSubscription
) => {
  try {
    const { success, subscription, invoice } =
      await createAssignSubscriptionModel(assign_subscription);

    if (!success) {
      throw new Error("Failed to assign subscription.");
    }

    if (success && invoice && invoice.id) {
      const pdf_url = await generateInvoicePDF(invoice);

      const updatedInvoice = await patchUpdateInvoiceByIdModel(invoice.id, {
        pdf_url,
      });
      return {
        success: true,
        subscription,
        invoice: updatedInvoice || { ...invoice, pdf_url },
      };
    }
    return { success: true, subscription, invoice: null };
  } catch (error) {
    console.error(
      "ERROR: Assign Subscription Service Failed (service): ",
      error
    );
    throw error;
  }
};

export const getAllAssignedSubscriptionsService = async (
  page: number,
  limit: number,
  sortBy: string,
  order: string
) => {
  const assignedSubscriptions = await getAllAssignedSubscriptionsModel(
    page,
    limit,
    sortBy,
    order
  );
  return assignedSubscriptions;
};

export const getAssignedSubscriptionByIdService = async (id: string) => {
  const subscription = await getAssignedSubscriptionByIdModel(id);
  return subscription;
};

export const getAssignedSubscriptionByCustAndPlanIdService = async (
  customer_id: string,
  plan_id: string
) => {
  const subscription = await getAssignedSubscriptionByCustAndPlanIdModel(
    customer_id,
    plan_id
  );
  return subscription;
};

export const getAssignedSubscriptionsByCustomerIdService = async (
  customer_id: string
) => {
  const subscriptions = await getAssignedSubscriptionsByCustomerIdModel(
    customer_id
  );
  return subscriptions;
};

export const getAssignedSubscriptionsByPlanIdService = async (
  plan_id: string
) => {
  const subscriptions = await getAssignedSubscriptionsByPlanIdModel(plan_id);
  return subscriptions;
};

export const putUpdateAssignedSubscriptionByIdService = async (
  id: string,
  updates: AssignSubscription
) => {
  const updatedSubscription = await putUpdateAssignedSubscriptionByIdModel(
    id,
    updates
  );
  return updatedSubscription;
};

export const patchUpdateAssignedSubscriptionByIdService = async (
  id: string,
  updates: Partial<AssignSubscription>
) => {
  try {
    const { success, subscription, invoice } =
      await patchUpdateAssignedSubscriptionByIdModel(id, updates);

    if (!success) {
      throw new Error("Failed to patch update assigned subscription.");
    }

    if (success && invoice && invoice.id) {
      const pdf_url = await generateInvoicePDF(invoice);

      const updatedInvoice = await patchUpdateInvoiceByIdModel(invoice.id, {
        pdf_url,
      });
      return {
        success: true,
        subscription,
        invoice: updatedInvoice || { ...invoice, pdf_url },
      };
    }
    return { success: true, subscription, invoice: null };
  } catch (error) {
    console.error(
      "ERROR: Update Assigned Subscription Service Failed (Patch) (service): ",
      error
    );
    throw error;
  }
};

export const deleteAssignedSubscriptionByIdService = async (id: string) => {
  const deletedSubscription = await deleteAssignedSubscriptionByIdModel(id);
  return deletedSubscription;
};
