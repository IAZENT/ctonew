'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { CommandPalette } from './CommandPalette'
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const [showCommand, setShowCommand] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const breadcrumbs = [
    { name: 'Admin', href: '/admin' },
    ...pathname
      .split('/')
      .filter(Boolean)
      .slice(1)
      .map((segment) => ({
        name: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: pathname,
      })),
  ]

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('darkMode', JSON.stringify(!isDarkMode))
  }

  return (
    <header className="sticky top-0 z-30 bg-background border-b">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.name}>
                  <div className="flex items-center">
                    {index > 0 && (
                      <svg
                        className="h-5 w-5 text-gray-400 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <a
                      href={crumb.href}
                      className={cn(
                        'text-sm font-medium',
                        index === breadcrumbs.length - 1
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {crumb.name}
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setShowCommand(true)}
            className="flex items-center space-x-2 px-3 py-2 text-sm rounded-lg border hover:bg-muted"
          >
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <span className="hidden sm:inline-flex items-center justify-center rounded border px-1.5 py-0.5 text-xs font-medium">
              ⌘K
            </span>
          </button>

          <button
            type="button"
            className="relative p-2 text-gray-400 hover:text-gray-500"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-2 text-gray-400 hover:text-gray-500"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">John Doe</div>
                    <div className="text-gray-500">Admin</div>
                  </div>
                  <a
                    href="/admin/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="inline h-4 w-4 mr-2" />
                    View Profile
                  </a>
                  <a
                    href="/admin/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="inline h-4 w-4 mr-2" />
                    Settings
                  </a>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="inline h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CommandPalette 
        isOpen={showCommand} 
        onClose={() => setShowCommand(false)} 
      />
    </header>
  )
}