'use client'

import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

export default function Loading() {
  return (
    <Box sx={{ py: 4, display: 'grid', gap: 2 }}>
      <Skeleton variant="text" width="40%" height={64} />
      <Skeleton variant="text" width="55%" />
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            phone: 'repeat(2, minmax(0, 1fr))',
            pad: 'repeat(3, minmax(0, 1fr))',
            smallPc: 'repeat(4, minmax(0, 1fr))',
            largePc: 'repeat(4, minmax(0, 1fr))',
          },
        }}
      >
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} variant="rounded" sx={{ aspectRatio: '4 / 5', height: 'auto', transform: 'none' }} />
        ))}
      </Box>
    </Box>
  )
}
