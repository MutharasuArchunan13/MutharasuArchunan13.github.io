import { Moon, Sun, LogOut, Menu } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/ui'

export function Header() {
  const { theme, toggleTheme, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          Goal Tracker
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {user && (
          <div className="flex items-center gap-2">
            <img
              src={user.avatarUrl}
              alt={user.login}
              className="h-7 w-7 rounded-full"
            />
            <span className="hidden text-sm text-gray-600 dark:text-gray-400 sm:inline">
              {user.login}
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
