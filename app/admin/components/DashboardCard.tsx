import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'

interface DashboardCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  badge?: number
  href?: string
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  trend,
  badge,
  href,
}: DashboardCardProps) {
  const Card = href ? (
    <Link
      href={href}
      className="bg-card rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <CardContent
        title={title}
        value={value}
        icon={Icon}
        trend={trend}
        badge={badge}
      />
    </Link>
  ) : (
    <div className="bg-card rounded-lg shadow p-6">
      <CardContent
        title={title}
        value={value}
        icon={Icon}
        trend={trend}
        badge={badge}
      />
    </div>
  )

  return Card
}

function CardContent({
  title,
  value,
  icon: Icon,
  trend,
  badge,
}: {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  badge?: number
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline mt-2">
            <p className="text-2xl font-semibold text-card-foreground">{value}</p>
            {trend && (
              <div className="ml-2 flex items-center text-sm">
                {trend.direction === 'up' ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="ml-1 text-green-500">{trend.value}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="ml-1 text-red-500">{trend.value}%</span>
                  </>
                )}
              </div>
            )}
            {badge && badge > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {badge} new
              </span>
            )}
          </div>
        </div>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
    </>
  )
}