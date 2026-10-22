'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { CartDraft, PricedCart } from '@/lib/types'

const STORAGE_KEY = 'northline-cart'

type Notice = { tone: 'success' | 'error'; message: string } | null

type CartContextValue = {
  cart: PricedCart | null
  count: number
  pending: boolean
  drawerOpen: boolean
  notice: Notice
  openDrawer: () => void
  closeDrawer: () => void
  clearNotice: () => void
  add: (slug: string) => Promise<boolean>
  setQuantity: (slug: string, quantity: number) => Promise<void>
  remove: (slug: string) => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

function readDrafts(): CartDraft[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartDraft[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (line) =>
        line &&
        typeof line.slug === 'string' &&
        Number.isInteger(line.quantity) &&
        line.quantity > 0,
    )
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [drafts, setDrafts] = useState<CartDraft[]>([])
  const [cart, setCart] = useState<PricedCart | null>(null)
  const [pending, setPending] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notice, setNotice] = useState<Notice>(null)
  const draftsRef = useRef<CartDraft[]>([])
  const chain = useRef(Promise.resolve())

  const persist = (next: CartDraft[]) => {
    draftsRef.current = next
    setDrafts(next)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const reprice = async (next: CartDraft[]) => {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lines: next }),
    })
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null
      const message = body?.error === 'out_of_stock' ? 'Out of stock' : 'Could not update the cart'
      setNotice({ tone: 'error', message })
      return false
    }
    setCart((await response.json()) as PricedCart)
    return true
  }

  const enqueue = (task: () => Promise<void>) => {
    setPending(true)
    const run = chain.current.then(task, task)
    chain.current = run.then(
      () => undefined,
      () => undefined,
    )
    return run.finally(() => setPending(false))
  }

  useEffect(() => {
    const stored = readDrafts()
    draftsRef.current = stored
    setDrafts(stored)
    if (stored.length === 0) return
    void enqueue(async () => {
      await reprice(stored)
    })
  }, [])

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      count: drafts.reduce((sum, line) => sum + line.quantity, 0),
      pending,
      drawerOpen,
      notice,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      clearNotice: () => setNotice(null),
      add: (slug) => {
        let added = false
        return enqueue(async () => {
          const current = draftsRef.current
          const existing = current.find((line) => line.slug === slug)
          const next = existing
            ? current.map((line) =>
                line.slug === slug ? { ...line, quantity: Math.min(8, line.quantity + 1) } : line,
              )
            : [...current, { slug, quantity: 1 }]
          const ok = await reprice(next)
          if (!ok) return
          persist(next)
          added = true
          setNotice({ tone: 'success', message: 'Added to cart' })
        }).then(() => added)
      },
      setQuantity: (slug, quantity) =>
        enqueue(async () => {
          const next =
            quantity < 1
              ? draftsRef.current.filter((line) => line.slug !== slug)
              : draftsRef.current.map((line) =>
                  line.slug === slug ? { ...line, quantity: Math.min(8, quantity) } : line,
                )
          const ok = await reprice(next)
          if (ok) persist(next)
        }),
      remove: (slug) =>
        enqueue(async () => {
          const next = draftsRef.current.filter((line) => line.slug !== slug)
          const ok = await reprice(next)
          if (ok) persist(next)
        }),
    }),
    [cart, drafts, drawerOpen, notice, pending],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const value = useContext(CartContext)
  if (!value) {
    throw new Error('useCart must be used within CartProvider')
  }
  return value
}
