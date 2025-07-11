import { apiClient } from "./apiClient.ts";
import { Item, CreateItemDTO, UpdateItemDTO, ApiResponse } from "../types/itemTypes.ts";

const ITEM_ENDPOINT = "/item";

export const ItemAPI = {
  getAllItems: async (): Promise<ApiResponse> => {
    const response = await apiClient.get(ITEM_ENDPOINT);
    return response.data;
  },
  getItemById: async (id: string): Promise<Item> => {
    const response = await apiClient.get(`${ITEM_ENDPOINT}/${id}`);
    return response.data;
  },
  createItem: async (itemData: CreateItemDTO): Promise<Item> => {
    const response = await apiClient.post(ITEM_ENDPOINT, itemData);
    return response.data;
  },
  putUpdateItem: async (id: string, itemData: UpdateItemDTO): Promise<Item> => {
    const response = await apiClient.put(`${ITEM_ENDPOINT}/${id}`, itemData);
    return response.data;
  },
  patchUpdateItem: async (
    id: string,
    itemData: Partial<UpdateItemDTO>
  ): Promise<Item> => {
    const response = await apiClient.patch(`${ITEM_ENDPOINT}/${id}`, itemData);
    return response.data;
  },
  deleteItem: async (id: string): Promise<void> => {
    await apiClient.delete(`${ITEM_ENDPOINT}/${id}`);
  },
};
