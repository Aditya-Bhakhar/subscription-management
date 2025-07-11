// src/services/itemService.ts

import {
  createItemModel,
  deleteItemByIdModel,
  getAllItemsModel,
  getItemByIdModel,
  getItemByNameModel,
  patchUpdateItemByIdModel,
  putUpdateItemByIdModel,
} from "../models/itemModel.js";
import { Item } from "../types/Item.js";

export const createItemService = async (item: Item) => {
  const newItem = await createItemModel(item);
  return newItem;
};

export const getAllItemsService = async (
  page: number,
  limit: number,
  sortBy: string,
  order: string
) => {
  const items = await getAllItemsModel(page, limit, sortBy, order);
  return items;
};

export const getItemByIdService = async (id: string) => {
  const item = await getItemByIdModel(id);
  return item;
};

export const getItemByNameService = async (name: string) => {
  const item = await getItemByNameModel(name);
  return item;
};

export const putUpdateItemByIdService = async (
  id: string,
  name: string,
  description: string,
  category: string,
  price: number,
  quantity: null | number
) => {
  const updatedItem = await putUpdateItemByIdModel(
    id,
    name,
    description,
    category,
    price,
    quantity
  );
  return updatedItem;
};

export const patchUpdateItemByIdService = async (
  id: string,
  updates: Partial<Item>
) => {
  const updatedItem = await patchUpdateItemByIdModel(id, updates);
  return updatedItem;
};

export const deleteItemByIdService = async (id: string) => {
  const deletedItem = await deleteItemByIdModel(id);
  return deletedItem;
};
