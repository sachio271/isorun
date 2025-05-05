import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8000/api",
  
  baseURL: "http://isoplusrun.wingssurya.com/apis",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
