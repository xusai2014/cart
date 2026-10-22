'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { formatUsdFromCents } from '@/lib/format'
import { useCart } from './CartProvider'

export function CheckoutView() {
  const { cart } = useCart()
  const lines = cart?.lines ?? []

  return (
    <Box sx={{ py: { phone: 3, pad: 6 }, display: 'grid', gap: 2, maxWidth: 640 }}>
      <Typography variant="h1" sx={{ fontSize: { phone: 40, pad: 56 } }}>
        Checkout
      </Typography>
      <Typography>
        This is a preview of the next step. This demo does not charge a card, and no order is placed.
      </Typography>
      {lines.length === 0 ? (
        <Button component={Link} href="/c/all" variant="contained">
          Continue shopping
        </Button>
      ) : (
        <>
          {lines.map((line) => (
            <Box key={line.slug} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <span>
                {line.name} × {line.quantity}
              </span>
              <span>{formatUsdFromCents(line.lineTotalCents)}</span>
            </Box>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total</span>
            <strong>{formatUsdFromCents(cart?.totalCents ?? 0)}</strong>
          </Box>
          <Button variant="contained" disabled>
            Checkout
          </Button>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Payment is unavailable in this demo.
          </Typography>
        </>
      )}
    </Box>
  )
}
