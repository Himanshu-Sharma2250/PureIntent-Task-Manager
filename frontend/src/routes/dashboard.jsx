import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { fetchAllTasks, deleteTask, fetchTask } from '@/hooks/useTask'
import { logoutUser } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import CreateTaskButton from '@/components/createTaskForm'
import EditTaskModal from '@/components/editTaskModal'
import { Trash2, Edit3, Clock, CheckCircle2, AlertCircle, LogOut, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { axiosInstance } from '@/lib/axiosInstance'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context
    try {
      const user = await queryClient.fetchQuery({
        queryKey: ['user'],
        queryFn: async () => {
          const { data } = await axiosInstance.get('/auth/me')
          return data.user
        },
        staleTime: 5 * 60 * 1000,
      })
      if (!user) {
        throw redirect({ to: '/login' })
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('redirect')) throw error
      throw redirect({ to: '/login' })
    }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  
  const { data, isLoading, isError } = fetchAllTasks({ page, search: debouncedSearch })
  const deleteMutation = deleteTask()
  const logoutMutation = logoutUser()
  const navigate = useNavigate()
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const tasks = data?.tasks || []
  const pagination = data?.pagination || { totalPages: 1, currentPage: 1 }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to first page on search
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const openModal = (taskId) => {
    setSelectedTaskId(taskId)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTaskId(null)
  }

  const openEditModal = (taskId) => {
    setSelectedTaskId(taskId)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedTaskId(null)
  }

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteMutation.mutateAsync(taskId)
      } catch (e) {
        // error toast handled in hook
      }
    }
  }

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      navigate({ to: '/login' })
    } catch (e) {
      // error toast handled in hook
    }
  }

  if (isLoading && !debouncedSearch && page === 1) return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
      <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      <span className="font-serif text-lg italic animate-pulse duration-1000">Gathering your thoughts...</span>
    </div>
  )
  if (isError) return <div className="flex justify-center items-center min-h-screen text-destructive font-serif">A momentary lapse in the system.</div>

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out-expo">
          <div className="space-y-4 w-full max-w-2xl">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-heading tracking-tight text-foreground">
                Dashboard
              </h1>
              <p className="text-muted-foreground font-serif text-lg italic">
                A space for your most intentional work.
              </p>
            </div>
            
            <div className="relative group max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search your intents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-b border-border pl-12 py-3 text-lg focus:outline-none focus:border-primary transition-colors font-serif placeholder:text-muted-foreground/30"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <CreateTaskButton />
            <button 
              onClick={handleLogout}
              className="p-3 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {tasks.length ? (
          <div className="space-y-16">
            <div className="grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task, i) => (
                <Card 
                  key={task.id} 
                  className="group cursor-pointer hover:ring-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border-none shadow-none ring-1 ring-border animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                  style={{ '--i': i, animationDelay: `${i * 75}ms` }}
                  onClick={() => openModal(task.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-medium">
                        <StatusIcon status={task.status} />
                        <span className={cn(
                          task.status === 'COMPLETE' && "text-green-600",
                          task.status === 'IN_PROGRESS' && "text-primary",
                          task.status === 'PENDING' && "text-muted-foreground"
                        )}>
                          {task.status?.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-sans font-medium">
                        {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">
                      {task.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                      {task.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-border/50 justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button 
                      className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground active:scale-90"
                      onClick={e => { e.stopPropagation(); openEditModal(task.id) }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      className="p-2 hover:bg-destructive/10 rounded-full transition-colors text-muted-foreground hover:text-destructive active:scale-90"
                      onClick={e => { e.stopPropagation(); handleDelete(task.id) }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-8 pt-8 border-t border-border/30 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-20 transition-all"
                >
                  <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  <span>Earlier Thoughts</span>
                </button>
                
                <span className="font-serif italic text-muted-foreground">
                  {page} <span className="mx-1">of</span> {pagination.totalPages}
                </span>

                <button 
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-20 transition-all"
                >
                  <span>Further Exploration</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-24 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-700">
            <p className="font-serif text-xl italic text-muted-foreground">
              {debouncedSearch ? "No intents match your exploration." : "The slate is clean."}
            </p>
            {debouncedSearch ? (
              <button 
                onClick={() => {setSearch(""); setDebouncedSearch("")}}
                className="text-primary hover:underline font-serif italic"
              >
                Clear your search
              </button>
            ) : (
              <CreateTaskButton />
            )}
          </div>
        )}
      </div>

      {isModalOpen && selectedTaskId && (
        <TaskDetailModal taskId={selectedTaskId} onClose={closeModal} />
      )}

      {isEditModalOpen && selectedTaskId && (
        <EditTaskModal taskId={selectedTaskId} onClose={closeEditModal} />
      )}
    </div>
  )
}

function StatusIcon({ status }) {
  switch (status) {
    case 'COMPLETE':
      return <CheckCircle2 size={14} className="text-green-600" />
    case 'IN_PROGRESS':
      return <Clock size={14} className="text-primary" />
    case 'PENDING':
      return <AlertCircle size={14} className="text-muted-foreground" />
    default:
      return <AlertCircle size={14} className="text-muted-foreground" />
  }
}

function TaskDetailModal({ taskId, onClose }) {
  const { data: task, isLoading } = fetchTask(taskId)

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 p-6 animate-in fade-in duration-300" 
      onClick={onClose}
    >
      <div 
        className="bg-card ring-1 ring-border shadow-2xl w-full max-w-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-out-expo" 
        onClick={e => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="p-24 text-center">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary animate-spin mx-auto mb-4 rounded-full" />
            <p className="font-serif italic text-lg animate-pulse">Focusing...</p>
          </div>
        ) : (
          <div className="p-8 md:p-12 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground animate-in fade-in slide-in-from-left-4 duration-500 delay-150 fill-mode-both">
                <StatusIcon status={task?.status} />
                <span className={cn(
                  "font-medium",
                  task?.status === 'COMPLETE' && "text-green-600",
                  task?.status === 'IN_PROGRESS' && "text-primary",
                  task?.status === 'PENDING' && "text-muted-foreground"
                )}>
                  {task?.status?.replace('_', ' ')}
                </span>
                <span className="mx-2">·</span>
                <span>Created {new Date(task?.createdAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-heading text-foreground animate-in fade-in slide-in-from-left-4 duration-500 delay-200 fill-mode-both">{task?.title}</h2>
            </div>
            
            <div className="prose prose-neutral max-w-none animate-in fade-in slide-in-from-left-4 duration-500 delay-300 fill-mode-both">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {task?.description}
              </p>
            </div>

            <div className="flex justify-end pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400 fill-mode-both">
              <button 
                className="px-8 py-3 bg-foreground text-background font-medium hover:bg-foreground/90 transition-all rounded-full active:scale-95" 
                onClick={onClose}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
