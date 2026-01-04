interface Activity {
  id: string
  action: string
  contentType: string
  itemName: string
  userName: string
  timestamp: string
  details?: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

function getActivityIcon(action: string) {
  const icons = {
    create: '📝',
    update: '✏️',
    delete: '🗑️',
    publish: '📤',
    archive: '📦',
  }
  return icons[action as keyof typeof icons] || '⚡'
}

function getActivityColor(action: string) {
  const colors = {
    create: 'text-blue-600 bg-blue-50',
    update: 'text-yellow-600 bg-yellow-50',
    delete: 'text-red-600 bg-red-50',
    publish: 'text-green-600 bg-green-50',
    archive: 'text-gray-600 bg-gray-50',
  }
  return colors[action as keyof typeof colors] || 'text-gray-600 bg-gray-50'
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No recent activity to display
      </div>
    )
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, index) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {index !== activities.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <div
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-background ${getActivityColor(
                      activity.action
                    )}`}
                  >
                    <span className="text-sm">{getActivityIcon(activity.action)}</span>
                  </div>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{activity.userName}</span>{' '}
                      <span className="capitalize">{activity.action}d</span>{' '}
                      <span className="font-medium text-gray-900">{activity.itemName}</span>{' '}
                      <span className="lowercase">{activity.contentType}</span>
                    </p>
                    {activity.details && (
                      <p className="mt-1 text-sm text-gray-500">{activity.details}</p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime={activity.timestamp}>
                      {new Date(activity.timestamp).toLocaleString()}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}