
import { CategoryResponse } from "@/types/response/categoryResponse";
import axiosInstance from "../axiosInstance";

export const getCategory = async (token: string): Promise<CategoryResponse[]> => {
    const response = await axiosInstance.get<CategoryResponse[]>("/category", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    return response.data;
};

export const createCategory = async (data: FormData, token: string) => {
    const response = await axiosInstance.post("/category", data, {
      headers: {
        "Authorization": `bearer ${token}`,
      },
    });
    return response.data;
};

export const updateCategory = async (id: number, data: FormData, token: string) => {
    const response = await axiosInstance.patch(`/category/${id}`, data, {
      headers: {
        "Authorization": `bearer ${token}`,
      },
    });
    return response.data;
};

export const deleteCategory = async (id: number, token: string) => {
    const response = await axiosInstance.delete(`/category/${id}`, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    return response.data;
};