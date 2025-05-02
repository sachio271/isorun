import { UserData } from "@/types/response/userResponse";
import axiosInstance from "../axiosInstance";

export const getUserRef = async (token: string, id: string): Promise<UserData[]> => {
    const response = await axiosInstance.get<UserData[]>(`/auth/${id}`, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    return response.data;
};
