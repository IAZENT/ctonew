import { redirect } from 'next/navigation'

import { getPayloadServerURL } from '@/lib/payload-client'

export default function AdminCatchallPage() {
  redirect(`${getPayloadServerURL()}/admin`)
}
