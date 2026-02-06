import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SidebarState {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  toggleCollapsed: () => void

  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  toggleMobileOpen: () => void
  closeMobile: () => void

  isMobile: boolean
  setIsMobile: (isMobile: boolean) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      collapsed: false,
      setCollapsed: (collapsed) => set({ collapsed }),
      toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),

      mobileOpen: false,
      setMobileOpen: (mobileOpen) => set({ mobileOpen }),
      toggleMobileOpen: () => set((state) => ({ mobileOpen: !state.mobileOpen })),
      closeMobile: () => set({ mobileOpen: false }),
      isMobile: false,
      setIsMobile: (isMobile) => {
        set({ isMobile })
        if (!isMobile && get().mobileOpen) {
          set({ mobileOpen: false })
        }
      },
    }),
    {
      name: "sidebar-storage",
      // Only persist desktop collapsed state, not mobile state
      partialize: (state) => ({ collapsed: state.collapsed }),
    },
  ),
)
