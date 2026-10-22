'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <Box sx={{ py: 8 }}>
      <Typography variant="h1" sx={{ fontSize: 40, mb: 2 }}>
        We couldn&apos;t load the shop
      </Typography>
      <Button variant="contained" onClick={reset}>
        Try again
      </Button>
    </Box>
  )
}
