import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SubscriptionPlanAPI } from "../api/subscriptionPlans.ts";
import {
  // SubscriptionPlan,
  CreateSubscriptionPlanDTO,
  UpdateSubscriptionPlanDTO,
} from "../types/subScriptionPlanTypes.ts";

export const useGetAllSubscriptionPlans = () => {
  return useQuery({
    queryKey: ["subscription_plans"],
    queryFn: SubscriptionPlanAPI.getAllSubscriptionPlans,
  });
};

export const useGetSubscriptionPlanById = (id: string) => {
  return useQuery({
    queryKey: ["subscription_plans", id],
    queryFn: () => SubscriptionPlanAPI.getSubscriptionPlanById(id),
  });
};

export const useCreateSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (subscriptionPlanData: CreateSubscriptionPlanDTO) =>
      SubscriptionPlanAPI.createSubscriptionPlan(subscriptionPlanData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription_plans"] });
    },
  });
};

export const usePutUpdateSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      subscriptionPlanData,
    }: {
      id: string;
      subscriptionPlanData: UpdateSubscriptionPlanDTO;
    }) =>
      SubscriptionPlanAPI.putUpdateSubscriptionPlan(id, subscriptionPlanData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription_plans"] });
    },
  });
};

export const usePatchUpdateSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      subscriptionPlanData,
    }: {
      id: string;
      subscriptionPlanData: Partial<UpdateSubscriptionPlanDTO>;
    }) =>
      SubscriptionPlanAPI.patchUpdateSubscriptionPlan(id, subscriptionPlanData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription_plans"] });
    },
  });
};

export const useDeleteSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => SubscriptionPlanAPI.deleteSubscriptionPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription_plans"] });
    },
  });
};
