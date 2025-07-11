// src/routes/subsciption_plan.routes.ts

import { Router } from "express";
import {
  createSubscriptionPlan,
  getAllSubscriptionPlans,
  getSubscriptionPlanById,
  putUpdateSubscriptionPlanById,
  patchUpdateSubscriptionPlanById,
  deleteSubscriptionPlanById,
} from "../controllers/subscriptionPlanController.js";
import {
  validateCreateSubscriptionPlan,
  validatePatchUpdateSubscriptionPlan,
  validatePutUpdateSubscriptionPlan,
} from "../middlewares/subscriptionPlanInputValidator.js";

const router = Router();

router.post("/", validateCreateSubscriptionPlan, createSubscriptionPlan);
router.get("/", getAllSubscriptionPlans);
router.get("/:id", getSubscriptionPlanById);
router.put("/:id", validatePutUpdateSubscriptionPlan, putUpdateSubscriptionPlanById);
router.patch("/:id", validatePatchUpdateSubscriptionPlan, patchUpdateSubscriptionPlanById);
router.delete("/:id", deleteSubscriptionPlanById);

export default router;
