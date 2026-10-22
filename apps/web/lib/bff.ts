import type { Category, Product } from './types'

const bffUrl = process.env.BFF_URL ?? 'http://127.0.0.1:3001'

export class BffError extends Error {
  status: number

  constructor(status: number) {
    super(`BFF request failed (${status})`)
    this.status = status
  }
}

async function fetchBff(path: string) {
  const url = new URL(path, bffUrl)
  let lastError: unknown
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      return await fetch(url, { cache: 'no-store' })
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
  }
  throw lastError instanceof Error ? lastError : new Error('BFF unreachable')
}

async function readJson<T>(path: string): Promise<T> {
  const response = await fetchBff(path)
  if (response.status === 404) {
    throw new BffError(404)
  }
  if (!response.ok) {
    throw new BffError(response.status)
  }
  return (await response.json()) as T
}

export function getCategories() {
  return readJson<Category[]>('/api/categories')
}

export function getProducts(query: { category?: string; q?: string }) {
  const url = new URL('/api/products', bffUrl)
  if (query.category) url.searchParams.set('category', query.category)
  if (query.q) url.searchParams.set('q', query.q)
  return readJson<Product[]>(`${url.pathname}${url.search}`)
}

export function getProductPage(slug: string) {
  return readJson<{ product: Product; related: Product[] }>(`/api/products/${slug}`)
}
