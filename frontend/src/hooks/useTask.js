import { axiosInstance } from "@/lib/axiosInstance"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const createTask = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data) => await axiosInstance.post(`/task/create`, data),
        onSuccess: (response) => {
            toast.success("Task Created")
            queryClient.invalidateQueries({ queryKey: ['tasks'] }) 
        },
        onError: () => {
            toast.error("Failed to create task")
        }
    })
}

export const editTask = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({data, taskId}) => await axiosInstance.put(`/task/edit/${taskId}`, data),
        onSuccess: (response) => {
            toast.success("Task Edited")
            queryClient.invalidateQueries({ queryKey: ['tasks'] }) 
            queryClient.setQueryData(['task', response.data.task.id], response.data.task) 
        },
        onError: () => {
            toast.error("Failed to edit task")
        }
    })
}

export const fetchTask = (taskId) => {
    return useQuery({
        queryKey: ['task', taskId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/task/${taskId}`)
            return res.data.task
        },
        enabled: !!taskId
    })
}

export const fetchAllTasks = ({ page = 1, limit = 10, search = "" } = {}) => {
    return useQuery({
        queryKey: ['tasks', { page, limit, search }],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/task`, {
                params: { page, limit, search }
            })
            return data
        }
    })
}

export const deleteTask = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (taskId) => await axiosInstance.delete(`/task/delete/${taskId}`),
        onSuccess: (_, taskId) => { 
            toast.success("Task deleted")
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
            queryClient.removeQueries({ queryKey: ['task', taskId] })
        },
        onError: () => {
            toast.error("Failed to delete task")
        }
    })
}