import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <main className="max-w-4xl space-y-12">
        <header className="space-y-6">
          <h1 className="text-7xl md:text-9xl font-heading tracking-tighter text-foreground leading-[0.85] animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out-expo">
            Focus <br /> 
            <span className="italic inline-block animate-in fade-in slide-in-from-left-8 duration-1000 delay-300 fill-mode-both">is the</span> <br />
            <span className="inline-block animate-in fade-in slide-in-from-right-8 duration-1000 delay-500 fill-mode-both">New Luxury.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-serif italic max-w-lg mx-auto leading-relaxed animate-in fade-in duration-1000 delay-700 fill-mode-both">
            A refined space for your most intentional work. Organize your thoughts without the noise.
          </p>
        </header>

        <nav className="flex flex-col md:flex-row items-center justify-center gap-8 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000 fill-mode-both">
          <Link 
            to="/dashboard" 
            className="group flex items-center gap-3 px-10 py-5 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 transition-all active:scale-95 shadow-2xl shadow-foreground/10 hover:shadow-foreground/20"
          >
            <span>Enter Workspace</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300 ease-out-expo" />
          </Link>
          <Link 
            to="/login" 
            className="text-lg font-serif italic text-muted-foreground hover:text-foreground transition-all decoration-primary/30 hover:decoration-primary underline underline-offset-8 decoration-0 hover:decoration-1"
          >
            Sign in to your archive
          </Link>
        </nav>
      </main>

      <footer className="fixed bottom-8 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 animate-in fade-in duration-1000 delay-[1200ms] fill-mode-both">
        Intentionality · 2026
      </footer>
    </div>
  )
}