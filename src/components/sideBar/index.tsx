"use client"

import { useEffect } from "react"
import { Home, Film, Tv, Bookmark, Clock, Settings, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useSidebarStore } from "@/lib/stores/sidebar-store"

const navigation = [
  { name: "Home", icon: Home, current: true },
  { name: "Movies", icon: Film, current: false },
  { name: "TV Shows", icon: Tv, current: false },
  { name: "Watchlist", icon: Bookmark, current: false },
  { name: "Recently Watched", icon: Clock, current: false },
  { name: "Settings", icon: Settings, current: false },
]

export default function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, closeMobile, isMobile, setIsMobile } = useSidebarStore()

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [setIsMobile])

  // Mobile overlay
  if (isMobile) {
    return (
      <>
        {/* SVG Filter for advanced frosted glass effect */}
        <svg className="absolute w-0 h-0">
          <defs>
            <filter id="frosted" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence baseFrequency="0.02" numOctaves="4" result="noise" seed="2" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.9 0" />
            </filter>
          </defs>
        </svg>

        {/* Mobile backdrop */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden" onClick={closeMobile} />
        )}

        {/* Mobile sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-500 ease-out lg:hidden ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full liquid-glass-dark liquid-glass-accent">
            {/* Mobile header */}
            <div className="flex h-16 items-center justify-between px-4 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 shadow-lg shadow-purple-500/30 flex items-center justify-center">
                  <div className="h-5 w-5 bg-white rounded-sm opacity-90"></div>
                </div>
                <span className="text-xl font-bold text-white drop-shadow-lg tracking-tight">StreamFlix</span>
              </div>
              <button
                onClick={closeMobile}
                className="liquid-glass-item rounded-xl p-2 text-gray-300 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile navigation */}
            <nav className="flex-1 space-y-2 px-4 py-6 relative z-10">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  onClick={closeMobile}
                  className={`liquid-glass-item ${
                    item.current ? "active" : ""
                  } group flex items-center rounded-xl px-4 py-3 text-base font-medium text-white/90 hover:text-white`}
                >
                  <item.icon className="h-6 w-6 flex-shrink-0" />
                  <span className="ml-3">{item.name}</span>
                </a>
              ))}
            </nav>

            {/* Mobile user profile */}
            <div className="p-4 relative z-10">
              <div className="liquid-glass-item flex items-center space-x-3 p-4 rounded-xl">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-blue-500/30 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">JD</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-white truncate">John Doe</p>
                  <p className="text-sm text-gray-300 truncate">Premium Member</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Desktop sidebar
  return (
    <>
      {/* SVG Filter for advanced frosted glass effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="frosted" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence baseFrequency="0.02" numOctaves="4" result="noise" seed="2" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.9 0" />
          </filter>
        </defs>
      </svg>

      <div className={`${collapsed ? "w-16" : "w-64"} transition-all duration-500 ease-out hidden lg:block`}>
        <div className="fixed inset-y-0 left-0 z-50 flex flex-col">
          <div
            className={`${collapsed ? "w-16" : "w-64"} h-full liquid-glass-dark ${!collapsed ? "liquid-glass-accent" : ""} transition-all duration-500 ease-out`}
          >
            {/* Desktop header */}
            <div className="flex h-16 items-center justify-between px-4 relative z-10">
              {!collapsed && (
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 shadow-lg shadow-purple-500/30 flex items-center justify-center">
                    <div className="h-4 w-4 bg-white rounded-sm opacity-90"></div>
                  </div>
                  <span className="text-xl font-bold text-white drop-shadow-lg tracking-tight">StreamFlix</span>
                </div>
              )}
              <button
                onClick={toggleCollapsed}
                className="liquid-glass-item rounded-lg p-2 text-gray-300 hover:text-white transition-all duration-300"
              >
                {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </button>
            </div>

            {/* Desktop navigation */}
            <nav className="flex-1 space-y-2 px-3 py-4 relative z-10">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  className={`liquid-glass-item ${
                    item.current ? "active" : ""
                  } group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:text-white ${
                    collapsed ? "justify-center" : ""
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="ml-3 truncate">{item.name}</span>}
                </a>
              ))}
            </nav>

            {/* Desktop user profile */}
            {!collapsed && (
              <div className="p-3 relative z-10">
                <div className="liquid-glass-item flex items-center space-x-3 p-3 rounded-lg">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-blue-500/30 flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">JD</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">John Doe</p>
                    <p className="text-xs text-gray-300 truncate">Premium Member</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
