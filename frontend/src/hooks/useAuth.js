import { axiosInstance } from "@/lib/axiosInstance"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const registerUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data) => await axiosInstance.post(`/auth/register`, data),
        onSuccess: (response) => {
            toast.success("User registered")
            queryClient.setQueryData(['user'], response.data.user)
        },
        onError: () => {
            toast.error("Failed to register user")
        }
    })
}

export const loginUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data) => await axiosInstance.post(`/auth/login`, data),
        onSuccess: (response) => {
            toast.success("User logged In successfully")
            queryClient.setQueryData(['user'], response.data.user)
        },
        onError: () => {
            toast.error("Failed to login user")
        }
    })
}

export const logoutUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => await axiosInstance.post(`/auth/logout`),
        onSuccess: () => {
            toast.success("User logged Out successfully")
            queryClient.removeQueries({ queryKey: ['user'] })
            queryClient.removeQueries({ queryKey: ['tasks'] })
        },
        onError: () => {
            toast.error("Failed to log out user")
        }
    })
}

export const profile = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const { data } = await axiosInstance.get('/auth/me');
                return data.user;
            } catch (error) {
                if (error.response?.status === 401) return null;
                throw error;
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000
    })
}