import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.response.use(
    res => res,
    async err => {
      const originalRequest = err.config;
  
      if (err.response?.status === 401 && 
          !originalRequest._retry  &&
          !originalRequest.url.includes("/users/refresh-token") ) {

        originalRequest._retry = true;
        try {
          await axiosInstance.post("/users/refresh-token");
          return axiosInstance(originalRequest);
        } catch (refreshErr) { 
          return Promise.reject(refreshErr);
        }
      } 
  
      return Promise.reject(err);
    }
  );
  
export default axiosInstance;
