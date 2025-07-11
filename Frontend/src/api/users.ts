import { apiClient } from "./apiClient.ts";
import { User, CreateUserDTO, UpdateUserDTO, ApiResponse } from "../types/userTypes.ts";

const USER_ENDPOINT = "/user";

export const UserAPI = {
  getAllUsers: async (): Promise<ApiResponse> => {
    const response = await apiClient.get(USER_ENDPOINT);
    return response.data;
  },
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`${USER_ENDPOINT}/${id}`);
    return response.data;
  },
  createUser: async (userData: CreateUserDTO): Promise<User> => {
    const response = await apiClient.post(USER_ENDPOINT, userData);
    return response.data;
  },
  putUpdateUser: async (id: string, userData: UpdateUserDTO): Promise<User> => {
    const response = await apiClient.put(`${USER_ENDPOINT}/${id}`, userData);
    return response.data;
  },
  patchUpdateUser: async (
    id: string,
    userData: Partial<UpdateUserDTO>
  ): Promise<User> => {
    const response = await apiClient.patch(`${USER_ENDPOINT}/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`${USER_ENDPOINT}/${id}`);
  },
};
