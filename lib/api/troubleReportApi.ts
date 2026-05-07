import axiosInstance from "../axiosInstance";

export interface TroubleReport {
  id: number;
  name: string;
  wa: string;
  email: string;
  nik: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface TroubleReportMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export const createTroubleReport = async (payload: {
  name: string;
  wa: string;
  email: string;
  nik: string;
  title: string;
  description: string;
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
