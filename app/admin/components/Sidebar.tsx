'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Box, 
  Folder, 
  FileText, 
  Images, 
  Users, 
  ClipboardList, 
  Settings, 
  History, 
  Shield,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  {
    name: 'Content Management',
    icon: Box,
    children: [
      { name: 'Products', href: '/admin/products', icon: Box },
      { name: 'Categories', href: '/admin/categories', icon: Folder },
      { name: 'Pages', href: '/admin/pages', icon: FileText },
      { name: 'Media', href: '/admin/media', icon: Images },
    ],
  },
  {
    name: 'Users & Submissions',
    icon: Users,
    children: [
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Form Submissions', href: '/admin/submissions', icon: ClipboardList },
    ],
  },
  {
    name: 'Settings & Audit',
    icon: Settings,
    children: [
      { name: 'Settings', href: '/admin/settings', icon: Settings },
      { name: 'Audit Logs', href: '/admin/audit', icon: History },
      { name: 'Roles & Permissions', href: '/admin/roles', icon: Shield },
    ],
  },
]

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<number[]>([1, 2, 3])
  const pathname = usePathname()

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    )
  }

  const isActive = (href: string) => pathname === href

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-700 bg-white shadow-lg"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-background shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                AC
              </div>
              <span className="ml-2 font-semibold text-lg">Admin</span>
            </div>
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item, index) => {
              if ('children' in item) {
                const isExpanded = expandedSections.includes(index)
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => toggleSection(index)}
                      className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="flex-1">{item.name}</span>
                      <svg
                        className={cn(
                          'ml-3 h-3 w-3 transition-transform',
                          isExpanded && 'rotate-90'
                        )}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {isExpanded && (
                      <div className="pl-8 space-y-1">
                        {item.children?.map((child) => {
                          const Icon = child.icon
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                                isActive(child.href)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                              )}
                              onClick={() => setSidebarOpen(false)}
                            >
                              <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                              {child.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              } else {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                )
              }
            })}
          </nav>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}