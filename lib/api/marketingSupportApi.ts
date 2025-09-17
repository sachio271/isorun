import { PaginationQuery } from "@/types/helper/paginationQuery";
import axiosInstance from "../axiosInstance";

export const updateParticipantStatus = async (id: number, token: string) => {
  const response = await axiosInstance.put(`/participant/race-pack/${id}`, {}, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return response.data;
};

export const getRacePackParticipant = async (token: string, filter?: PaginationQuery) => {
  const params = {
    page: filter?.page || 1,
    limit: filter?.limit || 5,
    search: filter?.search || "",
  };
  const response = await axiosInstance.get("/participant/race-pack", {
    headers: {
      "Authorization": `bearer ${token}`,
    },
    params,
  });
  return response.data;
};

export const updateRegistrationStatus = async (id: number, token: string) => {
  const response = await axiosInstance.put(`/participant/registration/${id}`, {}, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return response.data;
};


export const getRegistrationParticipant = async (token: string, filter?: PaginationQuery) => {
  const params = {
    page: filter?.page || 1,
    limit: filter?.limit || 5,
    search: filter?.search || "",
  };
  const response = await axiosInstance.get("/participant/registration", {
    headers: {
      "Authorization": `bearer ${token}`,
    },
    params,
  });
  return response.data;
};