import { NextResponse } from 'next/server'
import { listCategories } from '../../../lib/catalog'

export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json(listCategories())
}
