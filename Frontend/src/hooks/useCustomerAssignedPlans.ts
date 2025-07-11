import { useEffect, useState } from "react";
import { useGetAssignedSubscriptionsByCustomerId } from "./useAssignSubscription";
import { AssignSubscription } from "@/types/assignSubscriptionTypes";

export default function useCustomerAssignedPlans(
  customer_id: string | undefined
) {
  const [assignedPlans, setAssignedPlans] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetAssignedSubscriptionsByCustomerId(
    customer_id,
    {
      enabled: !!customer_id, 
    }
  );

  useEffect(() => {
    if (customer_id && data) {
      const planIds = data.data?.subscriptions.map(
        (subscription: AssignSubscription) => subscription.plan_id
      );
      setAssignedPlans(planIds || []);
    } else {
      setAssignedPlans([]);
    }
  }, [customer_id, data]);

  useEffect(() => {
    if (isError) {
      setError("Failed to fetch assigned plans!");
    } else {
      setError(null);
    }
  }, [isError]);

  const isPlanAlreadyAssigned = (plan_id: string) => {
    return assignedPlans.includes(plan_id);
  };

  return { assignedPlans, isPlanAlreadyAssigned, loading: isLoading, error };
}
