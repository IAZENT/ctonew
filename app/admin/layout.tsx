import type { Metadata } from 'next'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your Aircon Showcase content',
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  const allowedRoles = ['super-admin', 'admin', 'editor', 'contributor']
  if (!session.user.role || !allowedRoles.includes(session.user.role)) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="container mx-auto px-4 py-8 lg:px-8">{children}</main>
      </div>
      <Toaster position="top-right" expand={true} richColors={true} />
    </div>
  )
}