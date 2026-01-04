'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface FilterPanelProps {
  isOpen: boolean
  filters: any
  onFilterChange: (key: string, value: any) => void
  collection: string
}

export function FilterPanel({ isOpen, filters, onFilterChange, collection }: FilterPanelProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [statusOptions, setStatusOptions] = useState<string[]>([])

  useEffect(() => {
    if (!isOpen) return

    // Fetch filter options based on collection
    const fetchOptions = async () => {
      try {
        const response = await fetch(`/api/admin/filters?collection=${collection}`)
        if (!response.ok) throw new Error('Failed to fetch filter options')
        
        const data = await response.json()
        setCategories(data.categories || [])
        setUsers(data.users || [])
        setStatusOptions(data.statusOptions || [])
      } catch (error) {
        console.error('Error fetching filter options:', error)
      }
    }

    fetchOptions()
  }, [isOpen, collection])

  if (!isOpen) return null

  const renderFilterField = () => {
    switch (collection) {
      case 'products':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground">Status</label>
              <select
                multiple
                value={filters.status}
                onChange={(e) => onFilterChange('status', Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground">Category</label>
              <select
                multiple
                value={filters.category}
                onChange={(e) => onFilterChange('category', Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground">Featured</label>
              <select
                value={filters.featured === null ? '' : filters.featured.toString()}
                onChange={(e) => onFilterChange('featured', e.target.value ? e.target.value === 'true' : null)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All</option>
                <option value="true">Featured</option>
                <option value="false">Not Featured</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Price From</label>
                <input
                  type="number"
                  value={filters.priceFrom}
                  onChange={(e) => onFilterChange('priceFrom', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Price To</label>
                <input
                  type="number"
                  value={filters.priceTo}
                  onChange={(e) => onFilterChange('priceTo', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="∞"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Date From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => onFilterChange('dateFrom', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Date To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => onFilterChange('dateTo', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </>
        )
      
      case 'users':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground">Role</label>
              <select
                multiple
                value={filters.role || []}
                onChange={(e) => onFilterChange('role', Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="super-admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="contributor">Contributor</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => onFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="bg-card rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-card-foreground">Filters</h3>
        <button
          type="button"
          onClick={() => onFilterChange('clearAll', true)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 inline mr-1" />
          Clear All
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {renderFilterField()}
      </div>
    </div>
  )
}