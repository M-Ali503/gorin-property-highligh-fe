import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3005", // Replace with your backend URL
});

export default axiosInstance;

