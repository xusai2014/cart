import type { Metadata } from 'next'
import { CheckoutView } from '@/components/CheckoutView'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Checkout' }

export default function CheckoutPage() {
  return <CheckoutView />
}
