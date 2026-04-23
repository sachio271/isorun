import axiosInstance from "../axiosInstance";

export const createTransaction = async (data: FormData, token: string) => {
  const response = await axiosInstance.post("/transaction", data, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return response.data;
};

export const createParticipant = async (
  data: FormData,
  token: string,
  id: string,
) => {
  const response = await axiosInstance.post(
    `/transaction/participant/${id}`,
    data,
    {
      headers: {
        Authorization: `bearer ${token}`,
      },
    },
  );
  console.log("response =>" + response.data);
  return response.data;
};

export const updateRegistrationSettings = async (
  token: string,
  open: boolean,
) => {
  const response = await axiosInstance.patch(
    "/transaction/registration",
    { status: open ? "1" : "0" },
    {
      headers: { Authorization: `bearer ${token}` },
    },
  );
  return response.data;
};

export const getRegistrationSettings = async (token: string) => {
  const response = await axiosInstance.get("/transaction/settings", {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return response.data as { id: number; OPEN_REGISTRATION: number };
};

export const getTransaction = async (token: string) => {
  const response = await axiosInstance.get("/transaction", {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return response.data;
};

export const getTransactionByUser = async (token: string) => {
  const response = await axiosInstance.get(`/transaction/user`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return response.data;
};

export const getTransactionById = async (token: string, id: string) => {
  const response = await axiosInstance.get(`/transaction/${id}`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return response.data;
};

export const updateTransactionStatus = async (
  token: string,
  id: string,
  status: string,
) => {
  const response = await axiosInstance.patch(
    `/transaction/status/${id}`,
    { status },
    {
      headers: {
        Authorization: `bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const uploadTransactionImage = async (
  data: FormData,
  token: string,
  id: string,
) => {
  const response = await axiosInstance.post(`/transaction/${id}`, data, {
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteTransaction = async (token: string, id: string) => {
  const response = await axiosInstance.delete(`/transaction/${id}`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return response.data;
};

export const getParticipantByCategory = async (token: string, id: string) => {
  const response = await axiosInstance.get(`/transaction/participant/${id}`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteParticipant = async (token: string, id: string) => {
  const response = await axiosInstance.delete(
    `/transaction/participant/user/${id}`,
    {
      headers: {
        Authorization: `bearer ${token}`,
      },
    },
  );
  return response.data;
};
