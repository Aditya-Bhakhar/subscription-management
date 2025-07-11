// src/routes/invoice.routes.js

import { Router } from "express";
import {
  createInvoice,
  getAllInvoices,
  getInvoiceByCustomerAndSubscriptionId,
  getInvoiceById,
  getInvoiceByInvoiceNumber,
  patchUpdateInvoiceById,
  deleteInvoicesByIds,
} from "../controllers/invoiceController.js";
import { getFilteredInvoices } from "../controllers/filteredInvoiceController.js";

const router = Router();

router.post("/", createInvoice);
router.get("/", getAllInvoices);
// router.get("/", getFilteredInvoices);
router.get("/:id", getInvoiceById);
router.get("/invoice-number/:invoiceNumber", getInvoiceByInvoiceNumber);
router.get(
  "/customer/:customerId/subscription/:subscriptionId",
  getInvoiceByCustomerAndSubscriptionId
);
router.patch("/:id", patchUpdateInvoiceById);
router.delete("/batch-delete", deleteInvoicesByIds);

export default router;
