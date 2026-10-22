import { NextResponse } from 'next/server'
import { isCategoryId, listProducts } from '../../../lib/catalog'

export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  const url = new URL(request.url)
  const category = url.searchParams.get('category')
  const q = url.searchParams.get('q')
  if (category && !isCategoryId(category)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }
  return NextResponse.json(listProducts({ category, q }))
}
