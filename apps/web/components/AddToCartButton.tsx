'use client'

import { useState } from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Fade from '@mui/material/Fade'
import { useCart } from './CartProvider'

export function AddToCartButton({
  slug,
  inStock,
  fullWidth = false,
}: {
  slug: string
  inStock: boolean
  fullWidth?: boolean
}) {
  const { add, pending } = useCart()
  const [phase, setPhase] = useState<'idle' | 'added'>('idle')
  const [busy, setBusy] = useState(false)

  async function onClick() {
    if (busy) return
    setBusy(true)
    const ok = await add(slug)
    setBusy(false)
    if (!ok) return
    setPhase('added')
    window.setTimeout(() => setPhase('idle'), 1400)
  }

  const label = !inStock ? 'Out of stock' : phase === 'added' ? 'Added' : 'Add to cart'

  return (
    <Button
      variant="contained"
      color="primary"
      fullWidth={fullWidth}
      disabled={!inStock || busy || pending}
      onClick={onClick}
      aria-live="polite"
      sx={{ minWidth: fullWidth ? undefined : 148 }}
    >
      {busy ? (
        <CircularProgress size={18} color="inherit" />
      ) : (
        <Fade in key={label} timeout={180}>
          <span>{label}</span>
        </Fade>
      )}
    </Button>
  )
}
