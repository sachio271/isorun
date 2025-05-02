import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8000/api",
  
  baseURL: "http://172.24.21.45:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
