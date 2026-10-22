import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { LinkButton } from '@/components/LinkButton'
import { ProductGrid } from '@/components/ProductGrid'
import { getProducts } from '@/lib/bff'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const products = await getProducts({})
  const featured = products.filter((product) => product.featured)

  return (
    <Box sx={{ py: { phone: 3, pad: 5, largePc: 7 }, display: 'grid', gap: { phone: 4, pad: 6 } }}>
      <Box sx={{ maxWidth: 760 }}>
        <Typography sx={{ letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: 13, mb: 1.5 }}>
          The edit
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { phone: 44, pad: 68, largePc: 84 } }}>
          Everyday goods, chosen slowly.
        </Typography>
        <Typography sx={{ mt: 2, fontSize: { phone: 18, pad: 20 }, maxWidth: 520, color: 'text.secondary' }}>
          Free shipping on orders over $35. Browse the shop, open a piece, and add it to your cart.
        </Typography>
        <LinkButton href="/c/all" variant="contained" sx={{ mt: 3 }}>
          Shop the edit
        </LinkButton>
      </Box>
      <Box>
        <Typography variant="h2" sx={{ fontSize: 28, mb: 2 }}>
          Featured
        </Typography>
        <ProductGrid products={featured} />
      </Box>
    </Box>
  )
}
