import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface UIStore {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  activeModal: string | null
  toasts: Toast[]

  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  openModal: (id: string) => void
  closeModal: () => void
  addToast: (message: string, type: Toast['type']) => void
  removeToast: (id: string) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: true,
      activeModal: null,
      toasts: [],

      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'dark' ? 'light' : 'dark'
          document.documentElement.classList.toggle('dark', next === 'dark')
          return { theme: next }
        }),

      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        set({ theme })
      },

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      openModal: (id) => set({ activeModal: id }),

      closeModal: () => set({ activeModal: null }),

      addToast: (message, type) =>
        set((state) => {
          const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
          setTimeout(() => {
            useUIStore.getState().removeToast(id)
          }, 4000)
          return { toasts: [...state.toasts, { id, message, type }] }
        }),

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter(t => t.id !== id),
        })),
    }),
    {
      name: 'goal-tracker-ui',
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
)
