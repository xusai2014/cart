import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LinkButton } from '@/components/LinkButton'
import { ProductGrid } from '@/components/ProductGrid'
import { BffError, getCategories, getProducts } from '@/lib/bff'

export const dynamic = 'force-dynamic'

const titles: Record<string, string> = {
  all: 'Shop',
  kitchen: 'Kitchen',
  living: 'Living',
  travel: 'Travel',
  bath: 'Bath',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  return { title: titles[slug] ?? 'Shop' }
}

export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { slug } = await params
  const { q } = await searchParams
  if (!titles[slug]) notFound()

  let products
  let categories
  try {
    ;[products, categories] = await Promise.all([
      getProducts({ category: slug === 'all' ? undefined : slug, q }),
      getCategories(),
    ])
  } catch (error) {
    if (error instanceof BffError && error.status === 404) notFound()
    throw error
  }

  const title = q ? `Results for “${q}”` : titles[slug]

  return (
    <Box sx={{ py: { phone: 3, pad: 5 }, display: 'grid', gap: 3 }}>
      <Box>
        <Typography variant="h1" sx={{ fontSize: { phone: 40, pad: 56 } }}>
          {title ?? 'Shop'}
        </Typography>
        <Typography sx={{ mt: 1, color: 'text.secondary' }}>Free shipping on orders over $35</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <LinkButton href="/c/all" variant={slug === 'all' && !q ? 'contained' : 'text'} color="inherit">
          All
        </LinkButton>
        {categories.map((category) => (
          <LinkButton
            key={category.id}
            href={`/c/${category.id}`}
            variant={slug === category.id ? 'contained' : 'text'}
            color="inherit"
          >
            {category.label}
          </LinkButton>
        ))}
      </Box>
      {products.length === 0 ? (
        <Box sx={{ py: 4 }}>
          <Typography sx={{ mb: 2 }}>No matches. Try another word, or look through the shop.</Typography>
          <LinkButton href="/c/all" variant="contained">
            Continue shopping
          </LinkButton>
        </Box>
      ) : (
        <ProductGrid products={products} />
      )}
    </Box>
  )
}
