import { DashboardCard } from './components/DashboardCard'
import { ActivityFeed } from './components/ActivityFeed'
import { Activity, Box, Folder, FileText, Users, ClipboardList, Database } from 'lucide-react'

async function getDashboardStats() {
  const response = await fetch('http://localhost:3000/api/admin/stats', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats')
  }
  
  return response.json()
}

async function getRecentActivity() {
  const response = await fetch('http://localhost:3000/api/admin/activity?limit=15', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch recent activity')
  }
  
  return response.json()
}

export default async function AdminDashboard() {
  const [stats, activity] = await Promise.all([
    getDashboardStats(),
    getRecentActivity()
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Box}
          trend={{ value: 12, direction: 'up' }}
          href="/admin/products"
        />
        <DashboardCard
          title="Total Categories"
          value={stats.totalCategories}
          icon={Folder}
          trend={{ value: 3, direction: 'up' }}
          href="/admin/categories"
        />
        <DashboardCard
          title="Total Pages"
          value={stats.totalPages}
          icon={FileText}
          href="/admin/pages"
        />
        <DashboardCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          href="/admin/users"
        />
        <DashboardCard
          title="Form Submissions"
          value={stats.totalSubmissions}
          icon={ClipboardList}
          badge={stats.unreadSubmissions}
          href="/admin/submissions"
        />
        <DashboardCard
          title="Storage Used"
          value={`${stats.storageUsed} MB`}
          icon={Database}
          href="/admin/media"
        />
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-card-foreground">Recent Activity</h2>
          <button className="text-sm text-primary hover:underline">View All</button>
        </div>
        <ActivityFeed activities={activity} />
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <a
            href="/admin/products/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
          >
            Create New Product
          </a>
          <a
            href="/admin/categories/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Create New Category
          </a>
          <a
            href="/admin/pages/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Create New Page
          </a>
          <a
            href="/admin/submissions"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            View All Submissions
          </a>
          <a
            href="/admin/users"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Manage Users
          </a>
        </div>
      </div>
    </div>
  )
}