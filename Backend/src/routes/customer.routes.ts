// src/routes/customer.routes.ts

import { Router } from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  putUpdateCustomerById,
  patchUpdateCustomerById,
  deleteCustomerById,
} from "../controllers/customerController.js";
import {
  validateCreateCustomer,
  validatePatchUpdateCustomer,
  validatePutUpdateCustomer,
} from "../middlewares/customerInputValidator.js";

const router = Router();

router.post("/", validateCreateCustomer, createCustomer);
router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.put("/:id", validatePutUpdateCustomer, putUpdateCustomerById);
router.patch("/:id", validatePatchUpdateCustomer, patchUpdateCustomerById);
router.delete("/:id", deleteCustomerById);

export default router;
