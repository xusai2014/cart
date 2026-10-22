export const categories = [
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'living', label: 'Living' },
  { id: 'travel', label: 'Travel' },
  { id: 'bath', label: 'Bath' },
] as const

export type CategoryId = (typeof categories)[number]['id']

export type Product = {
  slug: string
  name: string
  priceCents: number
  category: CategoryId
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

export type CartDraft = {
  slug: string
  quantity: number
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

export const FREE_SHIPPING_THRESHOLD_CENTS = 3500
export const SHIPPING_FEE_CENTS = 595

const products: Product[] = [
  {
    slug: 'stoneware-pour-over',
    name: 'Stoneware Pour-Over Set',
    priceCents: 4200,
    category: 'kitchen',
    categoryLabel: 'Kitchen',
    summary: 'A quiet morning ritual, sized for one or two.',
    description:
      'Speckled stoneware dripper and carafe. The spout pours cleanly, and the set sits on the counter without looking like equipment.',
    details: ['Dripper and 600 ml carafe', 'Dishwasher safe', 'Fits a standard paper filter'],
    rating: 4.7,
    reviewCount: 186,
    image: '/products/stoneware-pour-over.svg',
    inStock: true,
    featured: true,
  },
  {
    slug: 'linen-seat-cushion',
    name: 'Linen Seat Cushion',
    priceCents: 3600,
    category: 'living',
    categoryLabel: 'Living',
    summary: 'Washed linen, firm enough for a wooden chair.',
    description:
      'A square cushion in oatmeal linen with cotton ties. It softens a dining chair without hiding it.',
    details: ['18 inch square', 'Removable cover', 'Washed linen, cotton fill'],
    rating: 4.5,
    reviewCount: 94,
    image: '/products/linen-seat-cushion.svg',
    inStock: true,
    featured: false,
  },
  {
    slug: 'oak-task-lamp',
    name: 'Oak Task Lamp',
    priceCents: 8900,
    category: 'living',
    categoryLabel: 'Living',
    summary: 'Warm oak stem, paper shade, one switch.',
    description:
      'A desk lamp with a turned oak stem and a linen shade. The light is warm and stays on the page.',
    details: ['Oak and linen', 'E26 bulb not included', 'Cord length 6 ft'],
    rating: 4.8,
    reviewCount: 211,
    image: '/products/oak-task-lamp.svg',
    inStock: true,
    featured: true,
  },
  {
    slug: 'merino-travel-throw',
    name: 'Merino Travel Throw',
    priceCents: 7800,
    category: 'travel',
    categoryLabel: 'Travel',
    summary: 'Light wool that folds into a seat-back pouch.',
    description:
      'A merino throw for trains, guest rooms, and cold offices. It packs flat and does not itch.',
    details: ['50 by 60 inches', '100% merino', 'Includes a cotton pouch'],
    rating: 4.6,
    reviewCount: 143,
    image: '/products/merino-travel-throw.svg',
    inStock: true,
    featured: true,
  },
  {
    slug: 'canvas-weekender',
    name: 'Canvas Weekender',
    priceCents: 12800,
    category: 'travel',
    categoryLabel: 'Travel',
    summary: 'One bag for two nights, with a shoe pocket.',
    description:
      'Waxed canvas with leather handles and a zip pocket that actually fits a pair of shoes. No logo patch.',
    details: ['Waxed canvas and leather', 'Shoe pocket', 'Shoulder strap included'],
    rating: 4.4,
    reviewCount: 76,
    image: '/products/canvas-weekender.svg',
    inStock: true,
    featured: true,
  },
  {
    slug: 'glass-bedside-carafe',
    name: 'Glass Bedside Carafe',
    priceCents: 3200,
    category: 'living',
    categoryLabel: 'Living',
    summary: 'A tumbler that nests on the carafe.',
    description:
      'Clear glass for water by the bed. The tumbler sits upside down on the neck so the set is one object.',
    details: ['Carafe and tumbler', '500 ml', 'Hand wash'],
    rating: 4.6,
    reviewCount: 158,
    image: '/products/glass-bedside-carafe.svg',
    inStock: true,
    featured: false,
  },
  {
    slug: 'beeswax-pillar',
    name: 'Beeswax Pillar',
    priceCents: 1800,
    category: 'living',
    categoryLabel: 'Living',
    summary: 'A short candle with a honey smell, not perfume.',
    description:
      'Poured beeswax with a cotton wick. It burns evenly and leaves the room smelling like wax, not a candle shop.',
    details: ['3 inch pillar', 'Cotton wick', 'About 20 hours'],
    rating: 4.3,
    reviewCount: 64,
    image: '/products/beeswax-pillar.svg',
    inStock: false,
    featured: false,
  },
  {
    slug: 'wool-house-slippers',
    name: 'Wool House Slippers',
    priceCents: 5400,
    category: 'bath',
    categoryLabel: 'Bath',
    summary: 'Boiled wool, leather sole, no costume stitching.',
    description:
      'Closed-toe slippers for wood floors. The wool is dense, and the sole is thin enough that you still feel the ground.',
    details: ['Boiled wool upper', 'Leather sole', 'Whole sizes 6–11'],
    rating: 4.7,
    reviewCount: 203,
    image: '/products/wool-house-slippers.svg',
    inStock: true,
    featured: false,
  },
  {
    slug: 'steel-day-flask',
    name: 'Steel Day Flask',
    priceCents: 2800,
    category: 'travel',
    categoryLabel: 'Travel',
    summary: 'A flat bottle that fits a coat pocket.',
    description:
      'Double-wall steel, 12 ounces, with a cap you can drink from. The finish is matte so it does not look like gym gear.',
    details: ['12 oz / 350 ml', 'Keeps cold for 12 hours', 'Wide mouth for ice'],
    rating: 4.5,
    reviewCount: 119,
    image: '/products/steel-day-flask.svg',
    inStock: true,
    featured: false,
  },
  {
    slug: 'cotton-gauze-robe',
    name: 'Cotton Gauze Robe',
    priceCents: 6800,
    category: 'bath',
    categoryLabel: 'Bath',
    summary: 'Double gauze, knee length, one pocket.',
    description:
      'A light robe for after a shower. The gauze is doubled so it is not sheer, and the belt stays tied.',
    details: ['Organic cotton gauze', 'Knee length', 'Sizes XS–XL in one cut'],
    rating: 4.8,
    reviewCount: 97,
    image: '/products/cotton-gauze-robe.svg',
    inStock: true,
    featured: false,
  },
  {
    slug: 'ceramic-dinner-plate',
    name: 'Ceramic Dinner Plate',
    priceCents: 2400,
    category: 'kitchen',
    categoryLabel: 'Kitchen',
    summary: 'A wide rim and a glaze that is not pure white.',
    description:
      'Sold as a single plate so you can replace one without buying a set. The rim is wide enough for a knife.',
    details: ['10.5 inch', 'Reactive glaze', 'Microwave and dishwasher safe'],
    rating: 4.4,
    reviewCount: 88,
    image: '/products/ceramic-dinner-plate.svg',
    inStock: true,
    featured: false,
  },
  {
    slug: 'walnut-serving-board',
    name: 'Walnut Serving Board',
    priceCents: 4600,
    category: 'kitchen',
    categoryLabel: 'Kitchen',
    summary: 'A small board for bread, cheese, or a weekday lunch.',
    description:
      'Solid walnut with a juice groove that is shallow on purpose. Oil it when the wood looks dry.',
    details: ['16 by 8 inches', 'Solid walnut', 'Hand wash, oil occasionally'],
    rating: 4.9,
    reviewCount: 172,
    image: '/products/walnut-serving-board.svg',
    inStock: true,
    featured: false,
  },
]

export function listCategories() {
  return categories.map((category) => ({ id: category.id, label: category.label }))
}

export function isCategoryId(value: string): value is CategoryId {
  return categories.some((category) => category.id === value)
}

export function listProducts(filter: { category?: string | null; q?: string | null }) {
  const query = filter.q?.trim().toLowerCase() ?? ''
  return products.filter((product) => {
    if (filter.category && product.category !== filter.category) return false
    if (!query) return true
    const haystack = `${product.name} ${product.summary} ${product.categoryLabel}`.toLowerCase()
    return haystack.includes(query)
  })
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug) ?? null
}

export function priceCart(drafts: CartDraft[]): PricedCart {
  const lines: PricedLine[] = drafts.map((draft) => {
    const product = getProduct(draft.slug)
    if (!product) {
      throw new Error('unknown')
    }
    return {
      slug: product.slug,
      name: product.name,
      image: product.image,
      unitPriceCents: product.priceCents,
      quantity: draft.quantity,
      lineTotalCents: product.priceCents * draft.quantity,
    }
  })
  const subtotalCents = lines.reduce((sum, line) => sum + line.lineTotalCents, 0)
  const shippingCents =
    subtotalCents === 0 || subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FEE_CENTS
  return {
    lines,
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
    currency: 'USD',
    freeShippingThresholdCents: FREE_SHIPPING_THRESHOLD_CENTS,
    amountUntilFreeShippingCents: Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents),
  }
}
