import axiosInstance from "../axiosInstance";

export interface TroubleReport {
  id: number;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    username: string;
  };
}

export interface TroubleReportMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export const createTroubleReport = async (payload: {
  title: string;
  description: string;
  participantId: string;
}) => {
  const response = await axiosInstance.post("/trouble-report", payload);
  return response.data;
};

export const getAllTroubleReports = async (
  token: string,
  params: { page: number; limit: number; search?: string },
) => {
  const response = await axiosInstance.get("/trouble-report", {
    headers: { Authorization: `bearer ${token}` },
    params,
  });
  return response.data as { data: TroubleReport[]; meta: TroubleReportMeta };
};
