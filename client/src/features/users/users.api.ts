import { api } from "../../lib/axios";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse<T> = {
  data: T;
};

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get<ApiResponse<UserProfile>>("/users/profile");
  return response.data.data;
};

export const updateProfile = async (
  profile: Pick<UserProfile, "name" | "email">,
): Promise<UserProfile> => {
  const response = await api.patch<ApiResponse<UserProfile>>("/users/profile", profile);
  return response.data.data;
};
