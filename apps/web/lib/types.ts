export type Category = {
  id: string
  label: string
}

export type Product = {
  slug: string
  name: string
  priceCents: number
  category: string
  categoryLabel: string
  summary: string
  description: string
  details: string[]
  rating: number
  reviewCount: number
  image: string
  inStock: boolean
  featured: boolean
}

export type PricedLine = {
  slug: string
  name: string
  image: string
  unitPriceCents: number
  quantity: number
  lineTotalCents: number
}

export type PricedCart = {
  lines: PricedLine[]
  subtotalCents: number
  shippingCents: number
  totalCents: number
  currency: 'USD'
  freeShippingThresholdCents: number
  amountUntilFreeShippingCents: number
}

export type CartDraft = {
  slug: string
  quantity: number
}
