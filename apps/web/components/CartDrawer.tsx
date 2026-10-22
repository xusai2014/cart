'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import RemoveIcon from '@mui/icons-material/Remove'
import Link from 'next/link'
import { formatUsdFromCents } from '@/lib/format'
import { useCart } from './CartProvider'

export function CartDrawer() {
  const { cart, drawerOpen, closeDrawer, setQuantity, remove } = useCart()
  const lines = cart?.lines ?? []

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={closeDrawer}
      transitionDuration={{ enter: 280, exit: 200 }}
      slotProps={{
        paper: {
          sx: {
            width: { phone: '100%', pad: 400, smallPc: 420, largePc: 440 },
            maxWidth: '100%',
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h3" sx={{ fontSize: 28 }}>
          Your cart
        </Typography>
        <IconButton aria-label="Close cart" onClick={closeDrawer}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Collapse in={lines.length === 0} unmountOnExit>
        <Box sx={{ py: 4 }}>
          <Typography sx={{ mb: 2 }}>Your cart is empty</Typography>
          <Button component={Link} href="/c/all" variant="outlined" onClick={closeDrawer}>
            Continue shopping
          </Button>
        </Box>
      </Collapse>

      {lines.length > 0 ? (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
            {lines.map((line) => (
              <Box key={line.slug} sx={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 1.5 }}>
                <Box
                  component="img"
                  src={line.image}
                  alt=""
                  sx={{ width: 72, height: 90, objectFit: 'cover', borderRadius: 2, bgcolor: '#E7E1D6' }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 650 }}>{line.name}</Typography>
                  <Typography sx={{ color: 'text.secondary', mt: 0.25 }}>
                    {formatUsdFromCents(line.unitPriceCents)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <IconButton
                      size="small"
                      aria-label={`Decrease ${line.name}`}
                      disabled={line.quantity <= 1}
                      onClick={() => setQuantity(line.slug, line.quantity - 1)}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography component="span" aria-label={`Quantity ${line.quantity}`}>
                      {line.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      aria-label={`Increase ${line.name}`}
                      disabled={line.quantity >= 8}
                      onClick={() => setQuantity(line.slug, line.quantity + 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <Button color="inherit" onClick={() => remove(line.slug)} sx={{ ml: 'auto' }}>
                      Remove
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{ color: 'text.secondary' }}>
              {cart && cart.amountUntilFreeShippingCents > 0
                ? `Add ${formatUsdFromCents(cart.amountUntilFreeShippingCents)} for free shipping`
                : 'Free shipping on orders over $35'}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Subtotal</Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {formatUsdFromCents(cart?.subtotalCents ?? 0)}
              </Typography>
            </Box>
            <Button component={Link} href="/cart" variant="outlined" onClick={closeDrawer}>
              View cart
            </Button>
            <Button component={Link} href="/checkout" variant="contained" onClick={closeDrawer}>
              Checkout
            </Button>
          </Box>
        </>
      ) : null}
    </Drawer>
  )
}
