import { apiClient } from "./apiClient.ts";
import {
  AssignSubscription,
  CreateAssignSubscriptionDTO,
  UpdateAssignSubscriptionDTO,
  ApiResponse,
} from "../types/assignSubscriptionTypes.ts";

const SUBSCRIPTIONS_ENDPOINT = "/subscription";

export const SubscriptionAPI = {
  getAllAssignSubscriptions: async (): Promise<ApiResponse> => {
    const response = await apiClient.get(SUBSCRIPTIONS_ENDPOINT);
    return response.data;
  },
  getAssignSubscriptionById: async (
    id: string
  ): Promise<AssignSubscription> => {
    const response = await apiClient.get(`${SUBSCRIPTIONS_ENDPOINT}/${id}`);
    return response.data;
  },
  getGetAssignedSubscriptionsByCustomerId: async (
    customer_id: string
  ): Promise<ApiResponse> => {
    const response = await apiClient.get(
      `${SUBSCRIPTIONS_ENDPOINT}/${customer_id}`
    );
    return response.data;
  },
  createAssignSubscription: async (
    subscriptionData: CreateAssignSubscriptionDTO
  ): Promise<AssignSubscription> => {
    const response = await apiClient.post(
      SUBSCRIPTIONS_ENDPOINT,
      subscriptionData
    );
    return response.data;
  },
  putUpdateAssignSubscription: async (
    id: string,
    subscriptionData: UpdateAssignSubscriptionDTO
  ): Promise<AssignSubscription> => {
    const response = await apiClient.put(
      `${SUBSCRIPTIONS_ENDPOINT}/${id}`,
      subscriptionData
    );
    return response.data;
  },
  patchUpdateAssignSubscription: async (
    id: string,
    subscriptionData: Partial<UpdateAssignSubscriptionDTO>
  ): Promise<AssignSubscription> => {
    const response = await apiClient.patch(
      `${SUBSCRIPTIONS_ENDPOINT}/${id}`,
      subscriptionData
    );
    return response.data;
  },
  deleteAssignSubscription: async (id: string): Promise<void> => {
    await apiClient.delete(`${SUBSCRIPTIONS_ENDPOINT}/${id}`);
  },
};
