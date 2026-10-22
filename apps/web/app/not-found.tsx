import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { LinkButton } from '@/components/LinkButton'

export default function NotFound() {
  return (
    <Box sx={{ py: 8 }}>
      <Typography variant="h1" sx={{ fontSize: 40, mb: 2 }}>
        We can&apos;t find that page
      </Typography>
      <LinkButton href="/c/all" variant="contained">
        Continue shopping
      </LinkButton>
    </Box>
  )
}
