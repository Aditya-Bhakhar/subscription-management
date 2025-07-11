// src/routes/index.ts

import { Router, Request, Response } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import customerRoutes from "./customer.routes.js";
import itemRoutes from "./item.routes.js";
import expenseRoutes from "./expense.routes.js";
import subscriptionPlanRoutes from "./subscriptionPlan.routes.js";
import assignSubscriptionRoutes from "./assignSubscription.routes.js";
import invoiceRoutes from "./invoice.routes.js";
import analysisRoutes from "./analysis.routes.js";
import { authenticateUser, checkRoles } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the subscription management API!!!",
  });
});

router.use("/auth", authRoutes);
router.use("/user", authenticateUser, checkRoles(["admin"]), userRoutes);
router.use("/customer", authenticateUser, customerRoutes);
router.use("/item", authenticateUser, itemRoutes);
router.use("/expense", authenticateUser, expenseRoutes);
router.use("/subscription-plan", authenticateUser, subscriptionPlanRoutes);
router.use("/subscription", authenticateUser, assignSubscriptionRoutes);
router.use("/invoice", authenticateUser, invoiceRoutes);
router.use("/analysis", authenticateUser, analysisRoutes);

export default router;
