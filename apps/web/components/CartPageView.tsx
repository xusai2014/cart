'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import Link from 'next/link'
import { formatUsdFromCents } from '@/lib/format'
import { useCart } from './CartProvider'

export function CartPageView() {
  const { cart, setQuantity, remove } = useCart()
  const lines = cart?.lines ?? []

  if (lines.length === 0) {
    return (
      <Box sx={{ py: { phone: 4, pad: 8 } }}>
        <Typography variant="h1" sx={{ fontSize: { phone: 40, pad: 56 }, mb: 2 }}>
          Your cart is empty
        </Typography>
        <Button component={Link} href="/c/all" variant="contained">
          Continue shopping
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ py: { phone: 3, pad: 5 }, display: 'grid', gap: 3 }}>
      <Typography variant="h1" sx={{ fontSize: { phone: 40, pad: 56 } }}>
        Cart
      </Typography>
      {lines.map((line) => (
        <Box
          key={line.slug}
          sx={{
            display: 'grid',
            gridTemplateColumns: { phone: '88px 1fr', pad: '120px 1fr auto' },
            gap: 2,
            alignItems: 'center',
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            component="img"
            src={line.image}
            alt=""
            sx={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', borderRadius: 2 }}
          />
          <Box>
            <Typography
              component={Link}
              href={`/p/${line.slug}`}
              sx={{ fontWeight: 700, textDecoration: 'none' }}
            >
              {line.name}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>{formatUsdFromCents(line.unitPriceCents)}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <IconButton
                aria-label={`Decrease ${line.name}`}
                disabled={line.quantity <= 1}
                onClick={() => setQuantity(line.slug, line.quantity - 1)}
              >
                <RemoveIcon />
              </IconButton>
              <span>{line.quantity}</span>
              <IconButton
                aria-label={`Increase ${line.name}`}
                disabled={line.quantity >= 8}
                onClick={() => setQuantity(line.slug, line.quantity + 1)}
              >
                <AddIcon />
              </IconButton>
              <Button color="inherit" onClick={() => remove(line.slug)}>
                Remove
              </Button>
            </Box>
          </Box>
          <Typography sx={{ fontWeight: 700, display: { phone: 'none', pad: 'block' } }}>
            {formatUsdFromCents(line.lineTotalCents)}
          </Typography>
        </Box>
      ))}
      <Box sx={{ maxWidth: 360, ml: { pad: 'auto' }, display: 'grid', gap: 1 }}>
        <Typography>
          {cart && cart.amountUntilFreeShippingCents > 0
            ? `Add ${formatUsdFromCents(cart.amountUntilFreeShippingCents)} for free shipping`
            : 'Free shipping on orders over $35'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Shipping</span>
          <span>{formatUsdFromCents(cart?.shippingCents ?? 0)}</span>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Subtotal</span>
          <strong>{formatUsdFromCents(cart?.subtotalCents ?? 0)}</strong>
        </Box>
        <Button component={Link} href="/checkout" variant="contained">
          Checkout
        </Button>
      </Box>
    </Box>
  )
}
