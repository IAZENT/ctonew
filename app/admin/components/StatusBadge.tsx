import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

const statusStyles = {
  draft: 'bg-amber-100 text-amber-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-red-100 text-red-800',
  inactive: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  read: 'bg-gray-100 text-gray-800',
  unread: 'bg-blue-100 text-blue-800',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusKey = status.toLowerCase()
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
        statusStyles[statusKey as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800',
        className
      )}
    >
      {status}
    </span>
  )
}