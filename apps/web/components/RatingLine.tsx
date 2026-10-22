import Box from '@mui/material/Box'
import { formatCount } from '@/lib/format'

export function RatingLine({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)))
  const stars = `${'★'.repeat(filled)}${'☆'.repeat(5 - filled)}`
  return (
    <Box
      component="p"
      aria-label={`${rating.toFixed(1)} out of 5, ${formatCount(reviewCount)} reviews`}
      sx={{ m: 0, display: 'flex', gap: 1, alignItems: 'baseline', color: 'text.secondary' }}
    >
      <Box component="span" aria-hidden sx={{ color: '#8A6A32', letterSpacing: '0.08em' }}>
        {stars}
      </Box>
      <Box component="span" sx={{ fontSize: 14 }}>
        {formatCount(reviewCount)} reviews
      </Box>
    </Box>
  )
}
