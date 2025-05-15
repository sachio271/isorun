import { FamilyRef, UserData, UserResponse, UsersRef } from "@/types/response/userResponse";
import axiosInstance from "../axiosInstance";

export const getUserRef = async (token: string, id: string): Promise<UserData[]> => {
    const response = await axiosInstance.get<UserData[]>(`/auth/${id}`, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    return response.data;
};

export const getAllUser = async (token: string): Promise<UserResponse[]> => {
    const response = await axiosInstance.get<UserResponse[]>(`/user`, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    return response.data;
}

export const getUserById = async (token: string, id: string): Promise<UserResponse[]> => {
  const response = await axiosInstance.get<UserResponse[]>(`/user/${id}`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return response.data;
}

export const getAllUserRef = async (token: string): Promise<UsersRef[]> => {
  const response = await axiosInstance.get<UsersRef[]>(`/user/userRef`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return response.data;
}

export const addUser = async (token: string, formData: FormData): Promise<UsersRef> => {
  const response = await axiosInstance.post<UsersRef>(`/user`, formData, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return response.data;
}

export const getUserRefById = async (token: string, id: string): Promise<UsersRef> => {
  const response = await axiosInstance.get<UsersRef>(`/user/userRef/${id}`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return response.data;
}

export const createFamilyRef = async (token: string, formData: FormData): Promise<FamilyRef> => {
  const response = await axiosInstance.post<FamilyRef>(`/user/familyRef`, formData, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return response.data;
}

export const changePassword = async (token: string, formData: FormData): Promise<string> => {
  const response = await axiosInstance.put<string>(`/auth/change-password`, formData, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return response.data;
}

export const resetPassword = async (token: string, id: string): Promise<string> => {
  const response = await axiosInstance.patch<string>(`/auth/reset-password/${id}`, {}, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return response.data;
}