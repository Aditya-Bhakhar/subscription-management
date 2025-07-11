// src/services/userService.ts

import bcrypt from "bcrypt";
import {
  createUserModel,
  getAllUsersModel,
  getUserByIdModel,
  getUserByEmailModel,
  deleteUserByIdModel,
  putUpdateUserByIdModel,
  patchUpdateUserByIdModel,
} from "../models/userModel.js";
import { User } from "../types/User.js";

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const createUserService = async (user: User) => {
  const newUser = {
    ...user,
    password: await hashPassword(user.password),
  };
  return await createUserModel(newUser);
};

export const getAllUsersService = async (
  page: number,
  limit: number,
  sortBy: string,
  order: string
) => {
  return await getAllUsersModel(page, limit, sortBy, order);
};

export const getUserByIdService = async (id: string) => {
  return await getUserByIdModel(id);
};

export const getUserByEmailService = async (email: string) => {
  return await getUserByEmailModel(email);
};

export const putUpdateUserByIdService = async (
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: string,
  profilePicture: string
) => {
  const hashedPassword = await hashPassword(password);
  return await putUpdateUserByIdModel(
    id,
    firstName,
    lastName,
    email,
    hashedPassword,
    role,
    profilePicture
  );
};

export const patchUpdateUserByIdService = async (
  id: string,
  updates: Partial<User>
) => {
  const patchedUpdates = {
    ...updates,
    password: updates.password
      ? await hashPassword(updates.password)
      : undefined,
  };
  return await patchUpdateUserByIdModel(id, patchedUpdates);
};

export const deleteUserByIdService = async (id: string) => {
  return await deleteUserByIdModel(id);
};
