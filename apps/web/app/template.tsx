'use client'

import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import useMediaQuery from '@mui/material/useMediaQuery'
import { usePathname } from 'next/navigation'

const ROUTE_MS = 320

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)', { noSsr: true })

  return (
    <Fade in appear timeout={reduce ? 0 : ROUTE_MS} key={pathname}>
      <Box>{children}</Box>
    </Fade>
  )
}
