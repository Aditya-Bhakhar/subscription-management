// src/controllers/userController.ts

import { NextFunction, Request, Response } from "express";
import { handleResponse } from "../services/responseHandler.js";
import {
  getUserByEmailService,
  createUserService,
  getAllUsersService,
  getUserByIdService,
  deleteUserByIdService,
  putUpdateUserByIdService,
  patchUpdateUserByIdService,
} from "../services/userServices.js";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstname, lastname, email, password, role } = req.body;
  try {
    if (!firstname || !lastname || !email || !password || !role) {
      throw new Error("All fields are required");
    }
    const user = await getUserByEmailService(email);
    if (user) {
      return handleResponse(res, 400, "User already exists with this email");
    }
    let profilePicture;
    if (req.file) {
      profilePicture = `/uploads/profile_pictures/${req.file.filename}`;
    }
    const createdUser = await createUserService({
      firstname,
      lastname,
      email,
      password,
      role,
      profilePicture,
    });
    handleResponse(res, 201, "User created successfully...", {
      user: createdUser,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const sortBy = (req.query.sortby as string) || "id";
    const order = (req.query.order as string) || "asc";
    const { users, totalUsers } = await getAllUsersService(
      page,
      limit,
      sortBy,
      order
    );
    const totalPages = Math.ceil(totalUsers / limit);
    const pagination = { page, limit, totalUsers, totalPages };
    handleResponse(res, 200, "Users fetched successfully...", {
      users,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "User ID is required");
    const user = await getUserByIdService(id);
    if (!user) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User fetched successfully...", {
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const putUpdateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "User ID is required");
    const user = await getUserByIdService(id);
    if (!user) return handleResponse(res, 404, "User not found");
    const { firstname, lastname, email, password, role } = req.body;
    if (!firstname || !lastname || !email || !role) {
      return handleResponse(res, 400, "Missing required fields");
    }
    let profilePicture: string | null = user.profilePicture ?? "";
    if (req.file) {
      profilePicture = `/uploads/profile_pictures/${req.file.filename}`;
    }
    const updatedUser = await putUpdateUserByIdService(
      id,
      firstname,
      lastname,
      email,
      password,
      role,
      profilePicture
    );
    handleResponse(res, 200, "User put updated successfully...", {
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const patchUpdateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "User ID is required");
    const user = await getUserByIdService(id);
    if (!user) return handleResponse(res, 404, "User not found");
    const updates = req.body;

    if (req.file) {
      updates.profilePicture = `/uploads/profile_pictures/${req.file.filename}`;
    }
    if (Object.keys(updates).length === 0) {
      return handleResponse(res, 400, "No fields provided for update");
    }
    const updatedUser = await patchUpdateUserByIdService(id, updates);
    console.log(updates);

    handleResponse(res, 200, "User patch updated successfully...", {
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "User ID is required");
    const user = await getUserByIdService(id);
    if (!user) return handleResponse(res, 404, "User not found");
    const deletedUser = await deleteUserByIdService(id);
    handleResponse(res, 200, "User deleted successfully...", {
      user: deletedUser,
    });
  } catch (error) {
    next(error);
  }
};
