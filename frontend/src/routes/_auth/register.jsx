import { createFileRoute, Link, useNavigate, redirect } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { registerUser } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import { axiosInstance } from '@/lib/axiosInstance'

export const Route = createFileRoute('/_auth/register')({
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
      if (user) {
        throw redirect({ to: '/dashboard' })
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('redirect')) throw error
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const { mutateAsync, isPending } = registerUser()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      await mutateAsync(data)
      toast.success('Your workspace is ready')
      navigate({ to: '/dashboard' })
      reset()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <div className="w-full max-w-md space-y-12">
        <header className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out-expo">
          <h1 className="text-5xl font-heading text-foreground">Join</h1>
          <p className="text-muted-foreground font-serif italic text-lg">Begin your journey into focus.</p>
        </header>

        <div className="bg-card ring-1 ring-border shadow-2xl rounded-3xl p-8 md:p-12 animate-in fade-in zoom-in-95 duration-700 delay-200 fill-mode-both ease-out-expo">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-500 fill-mode-both">
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Julian Barnes"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full bg-transparent border-b border-border py-2 text-lg focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30 font-serif"
                />
                {errors.name && <p className="text-destructive text-sm italic">{errors.name.message}</p>}
              </div>

              <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-700 fill-mode-both">
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full bg-transparent border-b border-border py-2 text-lg focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30 font-serif"
                />
                {errors.email && <p className="text-destructive text-sm italic">{errors.email.message}</p>}
              </div>

              <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-1000 fill-mode-both">
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium" htmlFor="password">
                  Secret Key
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full bg-transparent border-b border-border py-2 text-lg focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30 font-serif"
                />
                {errors.password && <p className="text-destructive text-sm italic">{errors.password.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-foreground text-background font-medium py-4 px-6 rounded-full hover:bg-foreground/90 transition-all active:scale-[0.98] disabled:opacity-50 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[1200ms] fill-mode-both"
            >
              {isPending ? 'Preparing…' : 'Initialize Workspace'}
            </button>
          </form>

          <footer className="mt-8 text-center animate-in fade-in duration-700 delay-[1400ms] fill-mode-both">
            <p className="text-muted-foreground font-serif italic">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-foreground hover:underline decoration-primary underline-offset-4 transition-all"
              >
                Sign in
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}

