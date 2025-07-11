import { Router } from "express";
import {
  createAssignSubscription,
  getAllAssignedSubscriptions,
  getAssignedSubscriptionById,
  getAssignedSubscriptionByCustAndPlanId,
  getAssignedSubscriptionsByCustomerId,
  getAssignedSubscriptionsByPlanId,
  putUpdateAssignedSubscriptionById,
  patchUpdateAssignedSubscriptionById,
  deleteAssignedSubscriptionById,
} from "../controllers/assignSubscriptionController.js";
// import {
//   validateCreateAssignSubscription,
//   validatePatchUpdateAssignSubscription,
//   validatePutUpdateAssignSubscription,
// } from "../middlewares/assignSubscriptionValidator.ts";

const router = Router();

router.post("/", createAssignSubscription);
router.get("/", getAllAssignedSubscriptions);
router.get("/:id", getAssignedSubscriptionById);
router.get(
  "/customer/:customer_id/subscription-plan/:plan_id",
  getAssignedSubscriptionByCustAndPlanId
);
router.get("/customer/:customer_id", getAssignedSubscriptionsByCustomerId);
router.get("/subscription-plan/:plan_id", getAssignedSubscriptionsByPlanId);
router.put("/:id", putUpdateAssignedSubscriptionById);
router.patch("/:id", patchUpdateAssignedSubscriptionById);
router.delete("/:id", deleteAssignedSubscriptionById);

export default router;
