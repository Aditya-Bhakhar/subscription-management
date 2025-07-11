// src/controllers/subscriptionPlanController.ts

import { NextFunction, Request, Response } from "express";
import {
  createSubscriptionPlanService,
  deleteSubscriptionPlanByIdService,
  getAllSubscriptionPlansService,
  getSubscriptionPlanByPlanNameService,
  getSubscriptionPlanByIdService,
  patchUpdateSubscriptionPlanByIdService,
  putUpdateSubscriptionPlanByIdService,
} from "../services/subscriptionPlanService.js";
import { handleResponse } from "../services/responseHandler.js";

export const createSubscriptionPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description, status, price, duration_days, features } =
    req.body;
  try {
    if (
      !name ||
      !status ||
      price === undefined ||
      price === null ||
      !duration_days ||
      !Array.isArray(features) ||
      features.length === 0 ||
      features.some((tag) => !tag.trim())
    ) {
      throw new Error(
        "All fields are required, and features must have at least one valid tag."
      );
    }
    const featuresArray = features.map(f => f.text);
    const user = await getSubscriptionPlanByPlanNameService(name);
    if (user) {
      handleResponse(
        res,
        400,
        "SubscriptionPlan already exists with this subscription_plan name!!!"
      );
    }
    const createdSubscriptionPlan = await createSubscriptionPlanService({
      name,
      description,
      status,
      price,
      duration_days,
      features,
    });
    handleResponse(res, 201, "SubscriptionPlan created successfully...", {
      subscription_plan: createdSubscriptionPlan,
    });
  } catch (error) {
    console.error(
      "ERROR: Error creating subscription_plan controller: ",
      error
    );
    next(error);
  }
};

export const getAllSubscriptionPlans = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const sortBy = (req.query.sortby as string) || "updated_at";
    const order = (req.query.order as string) || "desc";
    const { subscription_plans, totalSubscriptionPlans } =
      await getAllSubscriptionPlansService(page, limit, sortBy, order);
    const totalPages = Math.ceil(totalSubscriptionPlans / limit);
    const pagination = { page, limit, totalSubscriptionPlans, totalPages };
    handleResponse(res, 200, "All SubscriptionPlans fetched successfully...", {
      subscription_plans,
      pagination,
    });
  } catch (error) {
    console.error(
      "ERROR: Error getting all subscription_plans controller: ",
      error
    );
    next(error);
  }
};

export const getSubscriptionPlanById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "SubscriptionPlan ID is required");
    const subscription_plan = await getSubscriptionPlanByIdService(id);
    if (!subscription_plan)
      return handleResponse(res, 404, "SubscriptionPlan not found");
    handleResponse(res, 200, "SubscriptionPlan retrieved successfully...", {
      subscription_plan,
    });
  } catch (error) {
    console.error(
      "ERROR: Error getting subscription_plan by id controller: ",
      error
    );
    next(error);
  }
};

export const putUpdateSubscriptionPlanById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const { name, description, status, price, duration_days, features } =
      req.body;
    if (!id) return handleResponse(res, 400, "Id is required");
    const subscription_plan = await getSubscriptionPlanByIdService(id);
    if (!subscription_plan)
      return handleResponse(res, 404, "SubscriptionPlan not found");
    const updatedSubscriptionPlan = await putUpdateSubscriptionPlanByIdService(
      id,
      name,
      description,
      status,
      price,
      duration_days,
      features
    );
    handleResponse(res, 200, "SubscriptionPlan put updated successfully...", {
      subscription_plan: updatedSubscriptionPlan,
    });
  } catch (error) {
    console.error("ERROR: Error put updatedating subscription_plan: ", error);
    next(error);
  }
};

export const patchUpdateSubscriptionPlanById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "Id is required!");
    const subscription_plan = await getSubscriptionPlanByIdService(id);
    if (!subscription_plan)
      return handleResponse(res, 404, "SubscriptionPlan not found!");
    const updates = req.body;
    const updatedSubscriptionPlan =
      await patchUpdateSubscriptionPlanByIdService(id, updates);
    handleResponse(res, 200, "SubscriptionPlan patch updated successfully...", {
      subscription_plan: updatedSubscriptionPlan,
    });
  } catch (error) {
    console.log("ERROR: Error patch updating subscription_plan: ", error);
    next(error);
  }
};

export const deleteSubscriptionPlanById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "SubscriptionPlan ID is required");
    const subscription_plan = await getSubscriptionPlanByIdService(id);
    if (!subscription_plan)
      return handleResponse(res, 404, "SubscriptionPlan not found");
    const deletedSubscriptionPlan = await deleteSubscriptionPlanByIdService(id);
    console.log(deletedSubscriptionPlan);
    handleResponse(res, 200, "SubscriptionPlan deleted successfully...", {
      subscription_plan: deletedSubscriptionPlan,
    });
  } catch (error) {
    console.error("ERROR: Error deleting subscription_plan: ", error);
    next(error);
  }
};
