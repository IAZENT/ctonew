'use client'

import { X } from 'lucide-react'

interface BulkActionsBarProps {
  count: number
  onAction: (action: string) => void
  onClear: () => void
}

export function BulkActionsBar({ count, onAction, onClear }: BulkActionsBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-sm font-medium text-foreground">
              {count} items selected
            </span>
            <button
              type="button"
              onClick={onClear}
              className="ml-3 text-sm text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 inline" /> Clear
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onAction('publish')}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Publish
            </button>
            <button
              type="button"
              onClick={() => onAction('draft')}
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
            >
              Draft
            </button>
            <button
              type="button"
              onClick={() => onAction('archive')}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
            >
              Archive
            </button>
            <button
              type="button"
              onClick={() => onAction('delete')}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}