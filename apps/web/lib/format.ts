const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const count = new Intl.NumberFormat('en-US')

export function formatUsdFromCents(cents: number) {
  return usd.format(cents / 100)
}

export function formatCount(value: number) {
  return count.format(value)
}
