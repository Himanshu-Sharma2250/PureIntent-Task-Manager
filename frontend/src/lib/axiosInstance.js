import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_APP_URL}/api/v1` || "http://localhost:4000/api/v1",
    withCredentials: true
})