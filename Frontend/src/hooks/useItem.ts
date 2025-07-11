import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ItemAPI } from "../api/items.ts";
import {
  // Item,
  CreateItemDTO,
  UpdateItemDTO,
} from "../types/itemTypes.ts";

export const useGetAllItems = () => {
  return useQuery({
    queryKey: [
      "items",
      // { page: 1, pageSize: 10 }
    ],
    queryFn: ItemAPI.getAllItems,
  });
};

export const useGetItemById = (id: string) => {
  return useQuery({
    queryKey: ["items", id],
    queryFn: () => ItemAPI.getItemById(id),
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: (itemData: CreateItemDTO) => ItemAPI.createItem(itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

export const usePutUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, itemData }: { id: string; itemData: UpdateItemDTO }) =>
      ItemAPI.putUpdateItem(id, itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

export const usePatchUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      itemData,
    }: {
      id: string;
      itemData: Partial<UpdateItemDTO>;
    }) => ItemAPI.patchUpdateItem(id, itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ItemAPI.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};
