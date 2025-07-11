import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserAPI } from "../api/users.ts";
import {
  // User,
  CreateUserDTO,
  UpdateUserDTO,
} from "../types/userTypes.ts";

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: [
      "users",
      // { page: 1, pageSize: 10 }
    ],
    queryFn: UserAPI.getAllUsers,
  });
};

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => UserAPI.getUserById(id),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: CreateUserDTO) => UserAPI.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const usePutUpdateUser = (id: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: UpdateUserDTO }) =>
      UserAPI.putUpdateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const usePatchUpdateUser = (id: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      userData,
    }: {
      id: string;
      userData: Partial<UpdateUserDTO>;
    }) => UserAPI.patchUpdateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => UserAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
