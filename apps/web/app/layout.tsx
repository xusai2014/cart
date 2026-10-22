import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { CartProvider } from '@/components/CartProvider'
import { StoreShell } from '@/components/StoreShell'
import { getCategories } from '@/lib/bff'
import { ThemeRegistry } from '@/theme/ThemeRegistry'
import './globals.css'

const sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { default: 'Northline', template: '%s · Northline' },
  description: 'Everyday goods for a quieter home. A demo storefront.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let categories: Awaited<ReturnType<typeof getCategories>> = []
  try {
    categories = await getCategories()
  } catch {
    categories = []
  }

  return (
    <html lang="en" className={sans.variable}>
      <body>
        <ThemeRegistry>
          <CartProvider>
            <StoreShell categories={categories}>{children}</StoreShell>
          </CartProvider>
        </ThemeRegistry>
      </body>
    </html>
  )
}
