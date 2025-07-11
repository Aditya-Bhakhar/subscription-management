import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SubscriptionAPI } from "../api/assignSubscriptions.ts";
import {
  // Subscription,
  CreateAssignSubscriptionDTO,
  UpdateAssignSubscriptionDTO,
} from "../types/assignSubscriptionTypes.ts";

export const useGetAllAssignSubscriptions = () => {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: SubscriptionAPI.getAllAssignSubscriptions,
  });
};

export const useGetAssignSubscriptionById = (id: string) => {
  return useQuery({
    queryKey: ["subscriptions", id],
    queryFn: () => SubscriptionAPI.getAssignSubscriptionById(id),
  });
};

export const useGetAssignedSubscriptionsByCustomerId = (
  customer_id: string | undefined,
  options = {}
) => {
  return useQuery({
    queryKey: ["subscriptions", customer_id],
    queryFn: () =>
      SubscriptionAPI.getGetAssignedSubscriptionsByCustomerId(customer_id!),
    enabled: !!customer_id,
    ...options,
  });
};

export const useCreateAssignSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (subscriptionData: CreateAssignSubscriptionDTO) =>
      SubscriptionAPI.createAssignSubscription(subscriptionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
};

export const usePutUpdateAssignSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      subscriptionData,
    }: {
      id: string;
      subscriptionData: UpdateAssignSubscriptionDTO;
    }) => SubscriptionAPI.putUpdateAssignSubscription(id, subscriptionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
};

export const usePatchUpdateAssignSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      subscriptionData,
    }: {
      id: string;
      subscriptionData: Partial<UpdateAssignSubscriptionDTO>;
    }) => SubscriptionAPI.patchUpdateAssignSubscription(id, subscriptionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
};

export const useDeleteAssignSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => SubscriptionAPI.deleteAssignSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
};
