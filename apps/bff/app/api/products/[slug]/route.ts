import { NextResponse } from 'next/server'
import { getProduct, listProducts } from '../../../../lib/catalog'

export const dynamic = 'force-dynamic'

export function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  return context.params.then(({ slug }) => {
    const product = getProduct(slug)
    if (!product) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }
    const related = listProducts({ category: product.category })
      .filter((item) => item.slug !== product.slug)
      .slice(0, 4)
    return NextResponse.json({ product, related })
  })
}
