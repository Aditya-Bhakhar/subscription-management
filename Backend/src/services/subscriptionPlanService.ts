// src/services/subscriptionPlanService.ts

import {
  createSubscriptionPlanModel,
  deleteSubscriptionPlanByIdModel,
  getAllSubscriptionPlansModel,
  getSubscriptionPlanByPlanNameModel,
  getSubscriptionPlanByIdModel,
  patchUpdateSubscriptionPlanByIdModel,
  putUpdateSubscriptionPlanByIdModel,
} from "../models/subscriptionPlanModel.js";
import { SubscriptionPlan } from "../types/SubscriptionPlan.js";

export const createSubscriptionPlanService = async (
  subscription_plan: SubscriptionPlan
) => {
  const newSubscriptionPlan = await createSubscriptionPlanModel(
    subscription_plan
  );
  return newSubscriptionPlan;
};

export const getAllSubscriptionPlansService = async (
  page: number,
  limit: number,
  sortBy: string,
  order: string
) => {
  const subscription_plans = await getAllSubscriptionPlansModel(
    page,
    limit,
    sortBy,
    order
  );
  return subscription_plans;
};

export const getSubscriptionPlanByPlanNameService =
  async (name: string) => {
    const subscription_plan = await getSubscriptionPlanByPlanNameModel(name);
    return subscription_plan;
  };

export const getSubscriptionPlanByIdService = async (id: string) => {
  const subscription_plan = await getSubscriptionPlanByIdModel(id);
  return subscription_plan;
};

export const putUpdateSubscriptionPlanByIdService = async (
  id: string,
  name: string,
  description: string,
  status: "active" | "inactive",
  price: number,
  duration_days: number,
  features: string[]
) => {
  const updatedSubscriptionPlan = await putUpdateSubscriptionPlanByIdModel(
    id,
    name,
    description,
    status,
    price,
    duration_days,
    features
  );
  return updatedSubscriptionPlan;
};

export const patchUpdateSubscriptionPlanByIdService = async (
  id: string,
  updates: Partial<SubscriptionPlan>
) => {
  const updatedSubscriptionPlan = await patchUpdateSubscriptionPlanByIdModel(
    id,
    updates
  );
  return updatedSubscriptionPlan;
};

export const deleteSubscriptionPlanByIdService = async (id: string) => {
  const deletedSubscriptionPlan = await deleteSubscriptionPlanByIdModel(id);
  return deletedSubscriptionPlan;
};
