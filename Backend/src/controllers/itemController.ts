// src/controllers/itemController.ts

import { NextFunction, Request, Response } from "express";
import {
  createItemService,
  deleteItemByIdService,
  getAllItemsService,
  getItemByIdService,
  getItemByNameService,
  patchUpdateItemByIdService,
  putUpdateItemByIdService,
} from "../services/itemsService.js";
import { handleResponse } from "../services/responseHandler.js";

export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, category, price, quantity } = req.body;
    if (!name || !category || price === undefined) {
      throw new Error("All fields are required");
    }
    const item = await getItemByNameService(name);
    if (item)
      return handleResponse(res, 400, "Iten already exists with this name!!!");
    const createdItem = await createItemService({
      name,
      description,
      category,
      price,
      quantity: quantity !== undefined ? quantity : null,
    });
    handleResponse(res, 201, "Item created successfully...", {
      item: createdItem,
    });
  } catch (error) {
    console.error("ERROR: Error creating item controller: ", error);
    next(error);
  }
};

export const getAllItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const sortBy = (req.query.sortBy as string) || "updated_at";
    const order = (req.query.order as string) || "desc";
    const { items, totalItems } = await getAllItemsService(
      page,
      limit,
      sortBy,
      order
    );
    const totalPages = Math.ceil(totalItems / limit);
    const pagination = {
      page,
      limit,
      sortBy,
      order,
    };
    handleResponse(res, 200, "All items fetched successfully...", {
      items,
      pagination,
    });
  } catch (error) {
    console.error("ERROR: Error fetching all items controller: ", error);
    next(error);
  }
};

export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "Item ID is required");
    const item = await getItemByIdService(id);
    if (!item) return handleResponse(res, 404, "Item not found");
    handleResponse(res, 200, "Item fetched successfully...", {
      item,
    });
  } catch (error) {
    console.error("ERROR: Error fetching item by id controller: ", error);
    next(error);
  }
};

export const putUpdateItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const { name, description, category, price, quantity } = req.body;
    if (!id) return handleResponse(res, 400, "Item ID is required");
    const item = await getItemByIdService(id);
    if (!item) return handleResponse(res, 404, "Item not found");
    const updatedItem = await putUpdateItemByIdService(
      id,
      name,
      description,
      category,
      price,
      quantity
    );
    handleResponse(res, 200, "Item put updated successfully...", {
      item: updatedItem,
    });
  } catch (error) {
    console.error("ERROR: Error put updating item by id: ", error);
    next(error);
  }
};

export const patchUpdateItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    if (!id) return handleResponse(res, 400, "Item ID is required");
    const item = await getItemByIdService(id);
    if (!item) return handleResponse(res, 404, "Item not found");
    const updatedItem = await patchUpdateItemByIdService(id, updates);
    handleResponse(res, 200, "Item patch updated successfully...", {
      item: updatedItem,
    });
  } catch (error) {
    console.error("ERROR: Error patch updating item by id: ", error);
    next(error);
  }
};

export const deleteItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "Item ID is required");
    const item = await getItemByIdService(id);
    if (!item) return handleResponse(res, 404, "Item not found");
    const deletedItem = await deleteItemByIdService(id);
    handleResponse(res, 200, "Item deleted successfully...", {
      item: deletedItem,
    });
  } catch (error) {
    console.error("ERROR: Error deleting item by id: ", error);
    next(error);
  }
};
