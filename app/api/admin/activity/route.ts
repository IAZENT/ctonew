import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '15')
    
    // Get audit logs
    const audits = await payload.find({
      collection: 'audit-logs',
      sort: '-createdAt',
      limit,
    })

    const activity = audits.docs.map((audit: any) => ({
      id: audit.id,
      action: audit.action,
      contentType: audit.contentType,
      itemName: audit.itemName,
      userName: audit.user?.name || audit.user?.email || 'Unknown User',
      timestamp: audit.createdAt,
      details: audit.details,
    }))

    return NextResponse.json(activity)
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent activity' },
      { status: 500 }
    )
  }
}