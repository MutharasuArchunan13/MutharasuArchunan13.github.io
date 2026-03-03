import { NavLink, useParams } from 'react-router-dom'
import {
  LayoutDashboard,
  Target,
  CalendarCheck,
  Columns3,
  BarChart3,
  FolderKanban,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useUIStore } from '@/store/ui.store'
import { useProjectStore } from '@/store/project.store'
import { projectPath, checkinPath, kanbanPath, analyticsPath } from '@/config/routes'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const projects = useProjectStore((s) => s.projects)
  const { slug } = useParams<{ slug: string }>()

  const mainNav: NavItem[] = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  ]

  const projectNav: NavItem[] = slug
    ? [
        { to: projectPath(slug), label: 'Goals', icon: <Target className="h-5 w-5" /> },
        { to: checkinPath(slug), label: 'Check-in', icon: <CalendarCheck className="h-5 w-5" /> },
        { to: kanbanPath(slug), label: 'Kanban', icon: <Columns3 className="h-5 w-5" /> },
        { to: analyticsPath(slug), label: 'Analytics', icon: <BarChart3 className="h-5 w-5" /> },
      ]
    : []

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-14 z-40 flex h-[calc(100vh-3.5rem)] w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950',
          'transition-transform duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
          {mainNav.map((item) => (
            <SidebarLink key={item.to} item={item} />
          ))}

          {projects.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Projects
              </p>
              {projects.map((p) => (
                <SidebarLink
                  key={p.slug}
                  item={{
                    to: projectPath(p.slug),
                    label: p.title,
                    icon: <FolderKanban className="h-5 w-5" />,
                  }}
                />
              ))}
            </div>
          )}

          {projectNav.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Current Project
              </p>
              {projectNav.map((item) => (
                <SidebarLink key={item.to} item={item} />
              ))}
            </div>
          )}
        </nav>
      </aside>
    </>
  )
}

function SidebarLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
        )
      }
    >
      {item.icon}
      {item.label}
    </NavLink>
  )
}
