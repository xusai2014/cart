'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import type { Product } from '@/lib/types'
import { formatUsdFromCents } from '@/lib/format'
import { AddToCartButton } from './AddToCartButton'
import { RatingLine } from './RatingLine'

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        alignItems: 'stretch',
        gap: { phone: 2, pad: 2.5, smallPc: 3, largePc: 3.5 },
        gridTemplateColumns: {
          phone: 'repeat(2, minmax(0, 1fr))',
          pad: 'repeat(3, minmax(0, 1fr))',
          smallPc: 'repeat(4, minmax(0, 1fr))',
          largePc: 'repeat(4, minmax(0, 1fr))',
        },
      }}
    >
      {products.map((product) => (
        <Box
          key={product.slug}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.25,
            minWidth: 0,
            height: '100%',
          }}
        >
          <Box
            component={Link}
            href={`/p/${product.slug}`}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              textDecoration: 'none',
              color: 'inherit',
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: 'background.paper',
              transition:
                'transform 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 16px 40px rgba(28, 43, 39, 0.08)',
              },
            }}
          >
            <Box sx={{ aspectRatio: '4 / 5', flexShrink: 0, bgcolor: '#E7E1D6' }}>
              <Box
                component="img"
                src={product.image}
                alt=""
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </Box>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                p: { phone: 1.25, pad: 1.75 },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 650, lineHeight: 1.3 }}>
                {product.name}
              </Typography>
              <Box sx={{ mt: 'auto', pt: 0.5 }}>
                <Typography sx={{ fontWeight: 650 }}>{formatUsdFromCents(product.priceCents)}</Typography>
                <Box sx={{ mt: 0.75, display: { phone: 'none', pad: 'block' } }}>
                  <RatingLine rating={product.rating} reviewCount={product.reviewCount} />
                </Box>
              </Box>
            </Box>
          </Box>
          <AddToCartButton slug={product.slug} inStock={product.inStock} fullWidth />
        </Box>
      ))}
    </Box>
  )
}
