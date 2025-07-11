// src/controllers/assignSubscriptionController.ts

import { NextFunction, Request, Response } from "express";
import {
  createAssignSubscriptionService,
  getAllAssignedSubscriptionsService,
  getAssignedSubscriptionByIdService,
  getAssignedSubscriptionByCustAndPlanIdService,
  getAssignedSubscriptionsByCustomerIdService,
  getAssignedSubscriptionsByPlanIdService,
  putUpdateAssignedSubscriptionByIdService,
  patchUpdateAssignedSubscriptionByIdService,
  deleteAssignedSubscriptionByIdService,
} from "../services/assignSubscriptionService.js";
import { handleResponse } from "../services/responseHandler.js";

export const createAssignSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    customer_id,
    items,
    plan_id,
    status,
    start_date,
    end_date,
    auto_renew,
  } = req.body;

  try {
    if (
      !customer_id ||
      !items ||
      !plan_id ||
      !status ||
      !start_date ||
      !end_date
    ) {
      throw new Error("All fields are required");
    }
    const existingSubscription =
      await getAssignedSubscriptionByCustAndPlanIdService(customer_id, plan_id);
    if (existingSubscription) {
      return handleResponse(
        res,
        400,
        "Subscription already assigned to this customer with the selected plan!"
      );
    }
    const { success, subscription, invoice } =
      await createAssignSubscriptionService({
        customer_id,
        items,
        plan_id,
        status,
        start_date,
        end_date,
        auto_renew,
      });

    if (!success) {
      return handleResponse(res, 500, "Failed to assign subscription.");
    }

    handleResponse(res, 201, "Assigned subscription created successfully.", {
      subscription,
      invoice,
    });
  } catch (error) {
    console.error(
      "ERROR: Failed to create assigned subscription (controller): ",
      error
    );
    next(error);
  }
};

export const getAllAssignedSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const sortBy = (req.query.sortby as string) || "updated_at";
    const order = (req.query.order as string) || "desc";
    const { subscriptions, totalSubscriptions } =
      await getAllAssignedSubscriptionsService(page, limit, sortBy, order);
    const totalPages = Math.ceil(totalSubscriptions / limit);
    const pagination = { page, limit, totalSubscriptions, totalPages };
    handleResponse(
      res,
      200,
      "All Assigned Subscriptions fetched successfully...",
      {
        subscriptions,
        pagination,
      }
    );
  } catch (error) {
    console.error(
      "ERROR: Failed to get all assigned subscriptions (controller): ",
      error
    );
    next(error);
  }
};

export const getAssignedSubscriptionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "Subscription ID is required");
    const subscription = await getAssignedSubscriptionByIdService(id);
    if (!subscription)
      return handleResponse(res, 404, "Subscription not found");
    handleResponse(
      res,
      200,
      "Assigned Subscription retrieved by id successfully...",
      {
        subscription,
      }
    );
  } catch (error) {
    console.error(
      "ERROR: Failed to get assigned subscription by id controller: ",
      error
    );
    next(error);
  }
};

export const getAssignedSubscriptionByCustAndPlanId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id, plan_id } = req.params;
    if (!customer_id || !plan_id) {
      return handleResponse(res, 400, "Customer ID and Plan ID is required");
    }
    const subscription = await getAssignedSubscriptionByCustAndPlanIdService(
      customer_id,
      plan_id
    );
    if (!subscription) {
      return handleResponse(
        res,
        404,
        "No assigned subscription found for this customer and plan"
      );
    }
    handleResponse(
      res,
      200,
      "Assigned Subscriptions retrieved by Customer and Plan ID successfully",
      {
        subscription,
      }
    );
  } catch (error) {
    console.error(
      "ERROR: Failed to get assigned subscription by Customer and Plan ID controller: ",
      error
    );
    next(error);
  }
};

export const getAssignedSubscriptionsByCustomerId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer_id = req.params.customer_id;
    if (!customer_id)
      return handleResponse(res, 400, "Customer ID is required");

    const subscriptions = await getAssignedSubscriptionsByCustomerIdService(
      customer_id
    );
    handleResponse(
      res,
      200,
      "Assigned Subscriptions retrieved by Customer ID successfully",
      {
        subscriptions,
      }
    );
  } catch (error) {
    console.error(
      "ERROR: Failed to get assigned subscriptions by Customer ID controller: ",
      error
    );
    next(error);
  }
};

export const getAssignedSubscriptionsByPlanId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const plan_id = req.params.plan_id;
    if (!plan_id) return handleResponse(res, 400, "Plan ID is required");

    const subscriptions = await getAssignedSubscriptionsByPlanIdService(
      plan_id
    );
    handleResponse(
      res,
      200,
      "Assigned Subscriptions retrieved by Plan ID successfully",
      {
        subscriptions,
      }
    );
  } catch (error) {
    console.error(
      "ERROR: Failed to get assigned subscriptions by Plan ID: ",
      error
    );
    next(error);
  }
};

export const putUpdateAssignedSubscriptionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    if (!id) return handleResponse(res, 400, "Subscription ID is required");
    const subscription = await getAssignedSubscriptionByIdService(id);
    if (!subscription)
      return handleResponse(res, 404, "Subscription not found");
    const updatedSubscription = await putUpdateAssignedSubscriptionByIdService(
      id,
      updates
    );
    handleResponse(
      res,
      200,
      "Assigned Subscription put updated successfully...",
      {
        subscription: updatedSubscription,
      }
    );
  } catch (error) {
    console.error(
      "ERROR: Failed to update assigned subscription (PUT) controller: ",
      error
    );
    next(error);
  }
};

export const patchUpdateAssignedSubscriptionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    if (!id) return handleResponse(res, 400, "Subscription ID is required");
    const existingSubscription = await getAssignedSubscriptionByIdService(id);
    if (!existingSubscription)
      return handleResponse(res, 404, "Subscription not found");
    const { success, subscription, invoice } =
      await patchUpdateAssignedSubscriptionByIdService(id, updates);

    if (!success) {
      return handleResponse(res, 500, "Failed to patch update subscription.");
    }
    handleResponse(
      res,
      200,
      "Assigned Subscription partially updated successfully...",
      {
        subscription,
        invoice,
      }
    );
  } catch (error) {
    console.log(
      "ERROR: Failed to partially update assigned subscription (PATCH) (controller): ",
      error
    );
    next(error);
  }
};

export const deleteAssignedSubscriptionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "Subscription ID is required");
    const subscription = await getAssignedSubscriptionByIdService(id);
    if (!subscription)
      return handleResponse(res, 404, "Subscription not found");
    const deletedAssignedSubscription =
      await deleteAssignedSubscriptionByIdService(id);
    handleResponse(res, 200, "Assigned Subscription deleted successfully...", {
      subscription: deletedAssignedSubscription,
    });
  } catch (error) {
    console.error(
      "ERROR: Failed to delete assigned subscription (controller): ",
      error
    );
    next(error);
  }
};
