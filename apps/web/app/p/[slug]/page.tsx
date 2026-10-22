import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ProductGrid } from '@/components/ProductGrid'
import { RatingLine } from '@/components/RatingLine'
import { BffError, getProductPage } from '@/lib/bff'
import { formatUsdFromCents } from '@/lib/format'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const { product } = await getProductPage(slug)
    return { title: product.name, description: product.summary }
  } catch {
    return { title: 'Product' }
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let page
  try {
    page = await getProductPage(slug)
  } catch (error) {
    if (error instanceof BffError && error.status === 404) notFound()
    throw error
  }
  const { product, related } = page

  return (
    <Box sx={{ py: { phone: 3, pad: 5 }, display: 'grid', gap: 6 }}>
      <Box
        sx={{
          display: 'grid',
          gap: { phone: 3, smallPc: 5 },
          gridTemplateColumns: { phone: '1fr', smallPc: 'minmax(0, 1.05fr) minmax(280px, 0.85fr)' },
          alignItems: 'start',
        }}
      >
        <Box sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: '#E7E1D6', aspectRatio: '4 / 5' }}>
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </Box>
        <Box sx={{ position: { phone: 'static', smallPc: 'sticky' }, top: { smallPc: 96 }, display: 'grid', gap: 2 }}>
          <Typography sx={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: 13 }}>
            {product.categoryLabel}
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { phone: 40, pad: 52 } }}>
            {product.name}
          </Typography>
          <Typography sx={{ fontSize: 28, fontWeight: 700 }}>{formatUsdFromCents(product.priceCents)}</Typography>
          <RatingLine rating={product.rating} reviewCount={product.reviewCount} />
          <Typography sx={{ color: 'text.secondary', maxWidth: 460 }}>{product.description}</Typography>
          <Typography>Free shipping on orders over $35</Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5, color: 'text.secondary' }}>
            {product.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </Box>
          <AddToCartButton slug={product.slug} inStock={product.inStock} />
          {!product.inStock ? <Typography>Out of stock</Typography> : null}
        </Box>
      </Box>
      {related.length > 0 ? (
        <Box>
          <Typography variant="h2" sx={{ fontSize: 28, mb: 2 }}>
            More in {product.categoryLabel}
          </Typography>
          <ProductGrid products={related} />
        </Box>
      ) : null}
    </Box>
  )
}
