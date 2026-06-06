import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-accent active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      aria-label="Toggle theme"
    >
      <div className="relative h-5 w-5 overflow-hidden">
        <Sun className="h-full w-full transition-all duration-500 ease-in-out group-hover:rotate-12 dark:-translate-y-10 dark:opacity-0" />
        <Moon className="absolute inset-0 h-full w-full translate-y-10 opacity-0 transition-all duration-500 ease-in-out dark:translate-y-0 dark:opacity-100" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

