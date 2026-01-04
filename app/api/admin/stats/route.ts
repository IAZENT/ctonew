import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    
    // Get counts for each collection
    const [totalProducts, totalCategories, totalPages, totalUsers, totalSubmissions, mediaStats] = await Promise.all([
      payload.count({ collection: 'products' }),
      payload.count({ collection: 'categories' }),
      payload.count({ collection: 'pages' }),
      payload.count({ collection: 'users' }),
      payload.count({ collection: 'form-submissions' }),
      // Media size calculation would require additional logic based on your storage
      Promise.resolve({ totalSize: 0 })
    ])

    // Get unread submissions count
    const unreadSubmissions = await payload.count({ 
      collection: 'form-submissions',
      where: { status: { equals: 'unread' } }
    })

    // Calculate storage used (simplified - would need proper file size calculation)
    const storageUsed = Math.round(mediaStats.totalSize / (1024 * 1024)) || 0

    const stats = {
      totalProducts,
      totalCategories,
      totalPages,
      totalUsers,
      totalSubmissions,
      unreadSubmissions,
      storageUsed,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}