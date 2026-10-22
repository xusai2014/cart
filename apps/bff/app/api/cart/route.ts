import { NextResponse } from 'next/server'
import { getProduct, priceCart, type CartDraft } from '../../../lib/catalog'

export const dynamic = 'force-dynamic'

const MAX_QUANTITY = 8

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }
  const lines = (body as { lines?: unknown }).lines
  if (!Array.isArray(lines)) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  const merged = new Map<string, number>()
  for (const line of lines) {
    if (!line || typeof line !== 'object') {
      return NextResponse.json({ error: 'invalid' }, { status: 400 })
    }
    const slug = (line as { slug?: unknown }).slug
    const quantity = (line as { quantity?: unknown }).quantity
    if (typeof slug !== 'string' || !Number.isInteger(quantity)) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 })
    }
    const count = quantity as number
    if (count < 1 || count > MAX_QUANTITY) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 })
    }
    const product = getProduct(slug)
    if (!product) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 })
    }
    if (!product.inStock) {
      return NextResponse.json({ error: 'out_of_stock', slug }, { status: 409 })
    }
    merged.set(slug, Math.min(MAX_QUANTITY, (merged.get(slug) ?? 0) + count))
  }

  const drafts: CartDraft[] = [...merged.entries()].map(([slug, quantity]) => ({ slug, quantity }))
  return NextResponse.json(priceCart(drafts))
}
