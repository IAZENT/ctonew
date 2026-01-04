'use client'

import { useState } from 'react'
import { 
  ChevronDown, ChevronUp, ChevronUpDown, 
  CheckCircle, Circle
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SortColumn {
  column: string
  direction: 'asc' | 'desc'
}

interface TableHeaderProps {
  columns: Array<{
    key: string
    label: string
    sortable?: boolean
    width?: string
  }>
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  currentSort?: SortColumn
  showCheckbox?: boolean
  allSelected?: boolean
  onSelectAll?: (checked: boolean) => void
}

export function TableHeader({
  columns,
  onSort,
  currentSort,
  showCheckbox = false,
  allSelected = false,
  onSelectAll,
}: TableHeaderProps) {
  const handleSort = (column: string, sortable?: boolean) => {
    if (!sortable || !onSort) return

    let direction: 'asc' | 'desc' = 'asc'
    if (currentSort?.column === column) {
      direction = currentSort.direction === 'asc' ? 'desc' : 'asc'
    }

    onSort(column, direction)
  }

  const SortIcon = ({ column, sortable }: { column: string; sortable?: boolean }) => {
    if (!sortable) return null
    if (!currentSort || currentSort.column !== column) {
      return <ChevronUpDown className="h-4 w-4" />
    }
    return currentSort.direction === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    )
  }

  return (
    <thead className="bg-gray-50">
      <tr>
        {showCheckbox && onSelectAll && (
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
            <button
              onClick={() => onSelectAll(!allSelected)}
              className="flex items-center justify-center"
            >
              {allSelected ? (
                <CheckCircle className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </th>
        )}
        {columns.map((column) => (
          <th
            key={column.key}
            className={cn(
              'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
              column.sortable && 'cursor-pointer select-none',
              column.width
            )}
            onClick={() => handleSort(column.key, column.sortable)}
            style={{ width: column.width }}
          >
            <div className="flex items-center space-x-1">
              <span>{column.label}</span>
              <SortIcon column={column.key} sortable={column.sortable} />
            </div>
          </th>
        ))}
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  )
}