import { apiClient } from "./apiClient.ts";
import {
  SubscriptionPlan,
  CreateSubscriptionPlanDTO,
  UpdateSubscriptionPlanDTO,
  ApiResponse,
} from "../types/subScriptionPlanTypes.ts";

const SUBSCRIPTION_PLAN_ENDPOINT = "/subscription-plan";

export const SubscriptionPlanAPI = {
  getAllSubscriptionPlans: async (): Promise<ApiResponse> => {
    const response = await apiClient.get(SUBSCRIPTION_PLAN_ENDPOINT);
    return response.data;
  },
  getSubscriptionPlanById: async (id: string): Promise<SubscriptionPlan> => {
    const response = await apiClient.get(`${SUBSCRIPTION_PLAN_ENDPOINT}/${id}`);
    return response.data;
  },
  createSubscriptionPlan: async (
    subscriptionPlanData: CreateSubscriptionPlanDTO
  ): Promise<SubscriptionPlan> => {
    const response = await apiClient.post(
      SUBSCRIPTION_PLAN_ENDPOINT,
      subscriptionPlanData
    );
    return response.data;
  },
  putUpdateSubscriptionPlan: async (
    id: string,
    subscriptionPlanData: UpdateSubscriptionPlanDTO
  ): Promise<SubscriptionPlan> => {
    const response = await apiClient.put(
      `${SUBSCRIPTION_PLAN_ENDPOINT}/${id}`,
      subscriptionPlanData
    );
    return response.data;
  },
  patchUpdateSubscriptionPlan: async (
    id: string,
    subscriptionPlanData: Partial<UpdateSubscriptionPlanDTO>
  ): Promise<SubscriptionPlan> => {
    const response = await apiClient.patch(
      `${SUBSCRIPTION_PLAN_ENDPOINT}/${id}`,
      subscriptionPlanData
    );
    return response.data;
  },
  deleteSubscriptionPlan: async (id: string): Promise<void> => {
    await apiClient.delete(`${SUBSCRIPTION_PLAN_ENDPOINT}/${id}`);
  },
};
