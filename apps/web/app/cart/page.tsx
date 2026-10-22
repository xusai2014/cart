import type { Metadata } from 'next'
import { CartPageView } from '@/components/CartPageView'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Cart' }

export default function CartPage() {
  return <CartPageView />
}
